import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Redirect } from 'expo-router';
import { ref as dbRef, onValue } from 'firebase/database';
import { db } from '@/constants/firebase';
import StaffMap, { type LiveLocation } from '@/components/StaffMap';
import { useAuth } from '@/context/AuthContext';
import { sendPushToAll, sendPushToEmployee } from '@/utils/notifications';
import { CheckInRecord, Employee, Role, SHIFT_SCHEDULE, SaleItem, SALE_PRODUCTS, SaleRecord, SalesTarget, COMMISSIONS, Task, TaskStatus, TaskPeriod } from '@/context/AuthContext';
import { Brand } from '@/constants/theme';
import { GROQ_API_KEY, GROQ_MODEL, GEMINI_SYSTEM_PROMPT } from '@/constants/gemini';
import { useLanguage } from '@/context/LanguageContext';

const { width, height } = Dimensions.get('window');

const BG_IMAGE = require('@/assets/images/resort_lobby.webp');

interface GuestReview {
  overall:     number;
  aspects:     Record<string, number>;
  comment:     string;
  guestName:   string;
  nationality: string;
  submittedAt: string;
}

function formatDuration(isoStart: string, nowMs: number): string {
  const mins = Math.max(0, Math.floor((nowMs - new Date(isoStart).getTime()) / 60_000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function computeHours(records: CheckInRecord[], empId: string, from: Date, to: Date): string {
  const mins = records
    .filter((r) => r.employeeId === empId && r.checkedOutAt !== null)
    .filter((r) => { const d = new Date(r.checkedInAt); return d >= from && d < to; })
    .reduce((acc, r) => acc + (new Date(r.checkedOutAt!).getTime() - new Date(r.checkedInAt).getTime()) / 60_000, 0);
  const h = Math.floor(mins / 60), m = Math.floor(mins % 60);
  if (h === 0 && m === 0) return '0h';
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

type DayStatus = 'complete' | 'partial';

function computeMonthDayMap(
  records: CheckInRecord[], empId: string, year: number, month: number,
): Map<number, DayStatus> {
  const map = new Map<number, DayStatus>();
  records.filter((r) => r.employeeId === empId).forEach((r) => {
    const d = new Date(r.checkedInAt);
    if (d.getFullYear() !== year || d.getMonth() !== month) return;
    const day = d.getDate();
    const status: DayStatus = r.checkedOutAt !== null ? 'complete' : 'partial';
    if (!map.has(day) || (map.get(day) === 'partial' && status === 'complete')) {
      map.set(day, status);
    }
  });
  return map;
}

function computeMonthTotalMins(
  records: CheckInRecord[], empId: string, year: number, month: number,
): number {
  return records
    .filter((r) => r.employeeId === empId && r.checkedOutAt !== null)
    .filter((r) => {
      const d = new Date(r.checkedInAt);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .reduce((acc, r) =>
      acc + (new Date(r.checkedOutAt!).getTime() - new Date(r.checkedInAt).getTime()) / 60_000, 0);
}

function fmtH(mins: number): string {
  const h = Math.floor(mins / 60);
  return h === 0 ? '0h' : `${h}h`;
}

function dateForDow(targetDow: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + (targetDow - d.getDay()));
  return d;
}

// ─── Helper functions ─────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function periodFromTime24(time24: string): TaskPeriod {
  const hour = parseInt(time24.split(':')[0], 10);
  if (hour < 12) return 'MORNING';
  if (hour < 17) return 'AFTERNOON';
  return 'EVENING';
}

function displayTime(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr || '0', 10);
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

type ListItem =
  | { type: 'header'; label: string }
  | { type: 'task'; data: Task };

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string; border: string }> = {
  'Pending':     Brand.statusPending,
  'In-Progress': Brand.statusInProgress,
  'Complete':    Brand.statusComplete,
};

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  'Pending':     'In-Progress',
  'In-Progress': 'Complete',
  'Complete':    'Pending',
};

// ─── Role config ──────────────────────────────────────────────────────────────

const ROLE_BADGE_COLOR: Record<Role, string> = {
  entertainer: Brand.turquoise,
  leader:      '#00C48C',
  admin:       '#FF6B6B',
};

// ─── Group tasks into Morning / Afternoon / Evening ───────────────────────────

function groupTasks(tasks: Task[]): ListItem[] {
  const periods: TaskPeriod[] = ['MORNING', 'AFTERNOON', 'EVENING'];
  const result: ListItem[] = [];
  periods.forEach((period) => {
    const group = tasks.filter((t) => t.period === period);
    if (group.length > 0) {
      result.push({ type: 'header', label: period });
      group.forEach((t) => result.push({ type: 'task', data: t }));
    }
  });
  return result;
}

// ─── Root component (route guard) ────────────────────────────────────────────

export default function EntertainerDashboard() {
  const router = useRouter();
  const { staff, isAuthenticated, isPending, loading, logout, employees } = useAuth();

  if (loading) return null; // wait for Firebase session restore
  if (!isAuthenticated && !isPending) return <Redirect href="/auth" />;
  if (isPending) return <PendingApprovalScreen onSignOut={logout} />;

  return <Dashboard staff={staff!} logout={logout} router={router} employees={employees} />;
}

// ─── Pending Approval Screen ──────────────────────────────────────────────────

function PendingApprovalScreen({ onSignOut }: { onSignOut: () => Promise<void> }) {
  return (
    <View style={pendingStyles.root}>
      <LinearGradient colors={['#001a33', '#003366']} style={StyleSheet.absoluteFill} />
      <View style={pendingStyles.card}>
        <Text style={pendingStyles.icon}>⏳</Text>
        <Text style={pendingStyles.title}>Waiting for Approval</Text>
        <Text style={pendingStyles.body}>
          Your registration request has been submitted.{'\n'}
          Please wait for an admin to approve your account.{'\n\n'}
          You'll be automatically redirected once approved.
        </Text>
        <ActivityIndicator color="#00B4D8" style={{ marginVertical: 20 }} />
        <TouchableOpacity style={pendingStyles.signOutBtn} onPress={onSignOut} activeOpacity={0.8}>
          <Text style={pendingStyles.signOutTxt}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const pendingStyles = StyleSheet.create({
  root:       { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card:       { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 24, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', maxWidth: 380, width: '100%' },
  icon:       { fontSize: 48, marginBottom: 16 },
  title:      { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 12, letterSpacing: 0.5 },
  body:       { fontSize: 14, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 22 },
  signOutBtn: { marginTop: 8, paddingVertical: 12, paddingHorizontal: 32, backgroundColor: 'rgba(255,80,80,0.15)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,80,80,0.3)' },
  signOutTxt: { color: '#FF7070', fontWeight: '700', fontSize: 14 },
});

// ─── Dashboard inner component ────────────────────────────────────────────────

function Dashboard({
  staff,
  logout,
  router,
  employees,
}: {
  staff: NonNullable<ReturnType<typeof useAuth>['staff']>;
  logout: () => Promise<void>;
  router: ReturnType<typeof useRouter>;
  employees: Employee[];
}) {
  const { t, dayShort, dayFull } = useLanguage();
  const { checkIns, myCheckIn, checkIn, checkOut, salesRecords, salesTargets, addSaleRecord, setSalesTarget, debitRecords, addDebitRecord, deleteDebitRecord, tasks, addTask, deleteTask, updateTaskStatus, updateTaskNote, updateEmployeeRole, deleteEmployee, pendingEmployees, approveEmployee, rejectEmployee } = useAuth();

  const todayDow = useMemo(() => new Date().getDay(), []);
  const [selectedDow, setSelectedDow] = useState(todayDow);
  const [activeTab, setActiveTab] = useState<'schedule' | 'employees' | 'hr' | 'roster'>('schedule');
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  // ── Gemini AI panel state (admin/leader only) ─────────────────────────────
  const [showAiPanel,  setShowAiPanel]  = useState(false);
  const [aiInput,      setAiInput]      = useState('');
  const [aiResponse,   setAiResponse]   = useState<string | null>(null);
  const [aiLoading,    setAiLoading]    = useState(false);
  const [aiError,      setAiError]      = useState<string | null>(null);

  // "Add Task" form state (admin/leader only)
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [addTaskTitle,    setAddTaskTitle]    = useState('');
  const [addTaskLocation, setAddTaskLocation] = useState('');
  const [addTaskTime24,   setAddTaskTime24]   = useState('09:00');
  const [addTaskAssignTo, setAddTaskAssignTo] = useState<string>('all');

  // The date string for the currently selected day (YYYY-MM-DD)
  const selectedDate = useMemo(() => toDateStr(dateForDow(selectedDow)), [selectedDow]);

  // Tasks visible to the current user for the selected date
  const filteredTasks = useMemo(
    () => tasks
      .filter((t) => {
        if (t.date !== selectedDate) return false;
        // Admin and leader see every task so they can manage them
        if (staff.role === 'admin' || staff.role === 'leader') return true;
        return t.assignedTo === 'all' || t.assignedTo === staff.id;
      })
      .sort((a, b) => a.time24.localeCompare(b.time24)),
    [tasks, selectedDate, staff.role, staff.id],
  );
  const [myShiftsExpanded, setMyShiftsExpanded] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [hrView,    setHrView]    = useState<'live' | 'monthly' | 'map' | 'sales' | 'reviews'>('live');
  const [guestReviews, setGuestReviews] = useState<GuestReview[]>([]);
  const [broadcastMsg,  setBroadcastMsg]  = useState('');
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastBusy, setBroadcastBusy] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(false);
  const [addSaleEmpId,  setAddSaleEmpId]  = useState<string | null>(null);
  const [addSaleItem,   setAddSaleItem]   = useState<SaleItem>('tshirt');
  const [addSaleQty,    setAddSaleQty]    = useState('1');
  const [targetInputs,  setTargetInputs]  = useState<Record<string, { tshirt: string; lottery: string; disco: string }>>({});
  const [viewYear,  setViewYear]  = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [debitAmtInput,  setDebitAmtInput]  = useState('');
  const [debitNoteInput, setDebitNoteInput] = useState('');
  const [showDebitForm,  setShowDebitForm]  = useState(false);

  const [liveLocations, setLiveLocations] = useState<LiveLocation[]>([]);

  // Live clock for shift duration display
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Roster data (today's check-in status per employee)
  const rosterItems = useMemo(() => {
    const todayStr = new Date().toDateString();
    return employees.map((emp) => ({
      emp,
      active: checkIns.find(
        (r) =>
          r.employeeId === emp.id &&
          r.checkedOutAt === null &&
          new Date(r.checkedInAt).toDateString() === todayStr,
      ) ?? null,
    }));
  }, [employees, checkIns]);

  const onDutyCount = useMemo(
    () => rosterItems.filter((x) => x.active).length,
    [rosterItems],
  );

  // Shift history for the logged-in staff member (newest first, max 10)
  const myShifts = useMemo(
    () => checkIns
      .filter((r) => r.employeeId === staff.id)
      .sort((a, b) => b.checkedInAt.localeCompare(a.checkedInAt))
      .slice(0, 10),
    [checkIns, staff.id],
  );

  // Date range helpers for hours-worked calculations
  const todayStart = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const weekStart  = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - d.getDay()); d.setHours(0, 0, 0, 0); return d;
  }, []);

  // Sales helpers
  const curYear  = useMemo(() => new Date().getFullYear(), []);
  const curMonth = useMemo(() => new Date().getMonth(), []);

  function empMonthlySales(empId: string): { tshirt: number; lottery: number; disco: number; total: number } {
    const recs = salesRecords.filter((r) => {
      const d = new Date(r.date);
      return r.employeeId === empId && d.getFullYear() === curYear && d.getMonth() === curMonth;
    });
    const tshirt  = recs.filter((r) => r.item === 'tshirt').reduce((s, r) => s + r.amount, 0);
    const lottery = recs.filter((r) => r.item === 'lottery').reduce((s, r) => s + r.amount, 0);
    const disco   = recs.filter((r) => r.item === 'disco').reduce((s, r) => s + r.amount, 0);
    return { tshirt, lottery, disco, total: tshirt + lottery + disco };
  }

  function empTarget(empId: string): { tshirt: number; lottery: number; disco: number } {
    const t = salesTargets.find(
      (s) => s.employeeId === empId && s.year === curYear && s.month === curMonth,
    );
    return { tshirt: t?.tshirt ?? 0, lottery: t?.lottery ?? 0, disco: t?.disco ?? 0 };
  }

  function empMonthlyQty(empId: string): { tshirt: number; lottery: number; disco: number } {
    const recs = salesRecords.filter((r) => {
      const d = new Date(r.date);
      return r.employeeId === empId && d.getFullYear() === curYear && d.getMonth() === curMonth;
    });
    return {
      tshirt:  recs.filter((r) => r.item === 'tshirt').reduce((s, r) => s + r.quantity, 0),
      lottery: recs.filter((r) => r.item === 'lottery').reduce((s, r) => s + r.quantity, 0),
      disco:   recs.filter((r) => r.item === 'disco').reduce((s, r) => s + r.quantity, 0),
    };
  }

  function empMonthlyCommission(empId: string, role: Role): number {
    return salesRecords
      .filter((r) => {
        const d = new Date(r.date);
        return r.employeeId === empId && d.getFullYear() === curYear && d.getMonth() === curMonth;
      })
      .reduce((acc, r) => acc + COMMISSIONS[role][r.item] * r.quantity, 0);
  }

  function monthlyCompanyRevenue(): number {
    return salesRecords
      .filter((r) => { const d = new Date(r.date); return d.getFullYear() === curYear && d.getMonth() === curMonth; })
      .reduce((acc, r) => {
        const emp = employees.find((e) => e.id === r.employeeId);
        const commission = emp ? COMMISSIONS[emp.role][r.item] * r.quantity : 0;
        return acc + r.amount - commission;
      }, 0);
  }

  function fmtComm(n: number): string {
    return n % 1 === 0 ? String(n) : n.toFixed(2);
  }

  function monthlyTotalDebits(): number {
    return debitRecords
      .filter((r) => { const d = new Date(r.date); return d.getFullYear() === curYear && d.getMonth() === curMonth; })
      .reduce((acc, r) => acc + r.amount, 0);
  }

  // Month navigation helpers for monthly attendance view
  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };
  const monthLabel   = new Date(viewYear, viewMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Shift schedule string for the banner (e.g. "09:45–12:30  ·  14:45–16:30  ·  20:00–23:00")
  const shiftTimesStr = SHIFT_SCHEDULE.map((s) =>
    `${String(s.startH).padStart(2, '0')}:${String(s.startM).padStart(2, '0')}–` +
    `${String(s.endH).padStart(2, '0')}:${String(s.endM).padStart(2, '0')}`,
  ).join('  ·  ');

  // Firebase live-location listener — only active when admin is on the MAP sub-tab
  useEffect(() => {
    if (staff.role !== 'admin' || hrView !== 'map') {
      setLiveLocations([]);
      return;
    }
    const locRef = dbRef(db, 'locations');
    const unsub = onValue(locRef, (snap) => {
      const data = snap.val() ?? {};
      setLiveLocations(Object.values(data) as LiveLocation[]);
    });
    return () => unsub();
  }, [staff.role, hrView]);

  // Firebase guest-reviews listener — only active when admin is on the REVIEWS sub-tab
  useEffect(() => {
    if (staff.role !== 'admin' || hrView !== 'reviews') {
      setGuestReviews([]);
      return;
    }
    const revRef = dbRef(db, 'reviews');
    const unsub = onValue(revRef, (snap) => {
      const data = snap.val() ?? {};
      const list = Object.values(data) as GuestReview[];
      setGuestReviews(list.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)));
    });
    return () => unsub();
  }, [staff.role, hrView]);

  const isToday        = selectedDow === todayDow;
  const listData       = useMemo(() => groupTasks(filteredTasks), [filteredTasks]);
  const completedCount = useMemo(() => filteredTasks.filter((t) => t.status === 'Complete').length, [filteredTasks]);
  const totalCount     = filteredTasks.length;

  const toggleStatus = useCallback((id: string, current: TaskStatus) => {
    updateTaskStatus(id, NEXT_STATUS[current]);
  }, [updateTaskStatus]);

  const updateNote = useCallback((id: string, note: string) => {
    updateTaskNote(id, note);
  }, [updateTaskNote]);

  const handleAddTask = useCallback(() => {
    const t24 = addTaskTime24.trim() || '09:00';
    const title = addTaskTitle.trim();
    if (!title) return;
    const location = addTaskLocation.trim() || 'TBD';
    addTask({
      title,
      time:       displayTime(t24),
      time24:     t24,
      location,
      period:     periodFromTime24(t24),
      assignedTo: addTaskAssignTo,
      date:       selectedDate,
    });
    // Send push notification to assigned person(s)
    const notifTitle = '📋 New Task Assigned';
    const notifBody  = `${title} · ${displayTime(t24)} · ${location}`;
    if (addTaskAssignTo === 'all') {
      sendPushToAll(notifTitle, notifBody).catch(() => {});
    } else {
      sendPushToEmployee(addTaskAssignTo, notifTitle, notifBody).catch(() => {});
    }
    setAddTaskTitle('');
    setAddTaskLocation('');
    setAddTaskTime24('09:00');
    setAddTaskAssignTo('all');
    setShowAddTaskForm(false);
  }, [addTask, addTaskTitle, addTaskTime24, addTaskLocation, addTaskAssignTo, selectedDate]);

  const askGemini = useCallback(async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiError(null);
    setAiResponse(null);
    try {
      // Build context about the current team and schedule
      const teamContext = employees.map((e) => `${e.name} (${e.role})`).join(', ');
      const todayTasks  = filteredTasks.map((t) => `${t.time} – ${t.title} @ ${t.location}`).join('\n');
      const contextPrompt = `
RESORT: Hilton Marsa Alam Nubian Resort, Egypt
DATE: ${new Date().toDateString()}
TEAM: ${teamContext || 'No employees yet'}
TODAY'S TASKS: ${todayTasks || 'No tasks added yet'}
SHIFT SCHEDULE: 09:45–12:30 · 14:45–16:30 · 20:00–23:00

QUESTION: ${aiInput.trim()}`;

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: GEMINI_SYSTEM_PROMPT },
            { role: 'user',   content: contextPrompt },
          ],
          max_tokens: 512,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? `HTTP ${res.status}`);
      setAiResponse(data.choices[0]?.message?.content ?? '');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setAiError(msg.includes('401') || msg.includes('invalid_api_key') ? 'Add your Groq API key in constants/gemini.ts' : `Error: ${msg}`);
    } finally {
      setAiLoading(false);
    }
  }, [aiInput, employees, filteredTasks]);

  const handleSignOut = useCallback(async () => {
    await logout();
    router.replace('/');
  }, [logout, router]);

  const PERIOD_KEY: Record<string, string> = {
    MORNING: 'morning', AFTERNOON: 'afternoon', EVENING: 'evening_period',
  };

  const STATUS_LABEL: Record<TaskStatus, string> = {
    'Pending':     t('status_pending'),
    'In-Progress': t('status_in_progress'),
    'Complete':    t('status_complete'),
  };

  const renderItem: ListRenderItem<ListItem> = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.periodHeader}>
          <Text style={styles.periodHeaderText}>{t(PERIOD_KEY[item.label] ?? item.label.toLowerCase())}</Text>
          <View style={styles.periodDivider} />
        </View>
      );
    }

    const { data: task } = item;
    const colors = STATUS_COLORS[task.status];
    const isExpanded = expandedNoteId === task.id;

    return (
      <BlurView
        intensity={90}
        tint="light"
        style={[
          styles.taskCard,
          task.status === 'Complete' && styles.taskCardComplete,
          { borderLeftColor: colors.text, borderLeftWidth: 4 },
        ]}
      >
        {/* ── Top row: info + status badge + delete ── */}
        <View style={styles.taskRow}>
          <View style={styles.taskInfo}>
            <Text
              style={[
                styles.taskTitle,
                task.status === 'Complete' && styles.taskTitleComplete,
              ]}
            >
              {task.title}
            </Text>
            <Text style={styles.taskMeta}>
              {task.time} · {task.location}
            </Text>
            {task.completedAt ? (
              <Text style={styles.completedAtText}>
                ✓ {t('done_at', { time: task.completedAt })}
              </Text>
            ) : null}
          </View>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <TouchableOpacity
              style={[
                styles.statusBadge,
                { backgroundColor: colors.bg, borderColor: colors.border },
              ]}
              onPress={() => toggleStatus(task.id, task.status)}
              activeOpacity={0.7}
            >
              <Text style={[styles.statusText, { color: colors.text }]}>
                {STATUS_LABEL[task.status]}
              </Text>
            </TouchableOpacity>
            {(staff.role === 'admin' || staff.role === 'leader') && (
              <TouchableOpacity
                onPress={() => deleteTask(task.id)}
                hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
              >
                <Text style={styles.taskDeleteTxt}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── Note section ── */}
        <View style={styles.noteSection}>
          {isExpanded ? (
            <TextInput
              style={styles.noteInput}
              value={task.note}
              onChangeText={(text) => updateNote(task.id, text)}
              placeholder={t('task_note_placeholder')}
              placeholderTextColor="#aaa"
              multiline
              maxLength={200}
              autoFocus
              onBlur={() => setExpandedNoteId(null)}
            />
          ) : (
            <TouchableOpacity
              onPress={() => setExpandedNoteId(task.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.noteHint, task.note ? styles.noteHintFilled : null]}>
                {task.note || t('task_note_hint')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    );
  };

  // ─── Sales employee card renderer (reused for grouped sections) ──────────────
  const renderSalesEmpCard = (emp: Employee) => {
    const sales      = empMonthlySales(emp.id);
    const qty        = empMonthlyQty(emp.id);
    const target     = empTarget(emp.id);
    const commission = empMonthlyCommission(emp.id, emp.role);
    const isAdding   = addSaleEmpId === emp.id;
    const tInputs    = targetInputs[emp.id] ?? {
      tshirt:  target.tshirt  > 0 ? String(target.tshirt)  : '',
      lottery: target.lottery > 0 ? String(target.lottery) : '',
      disco:   target.disco   > 0 ? String(target.disco)   : '',
    };
    const hasCommission = COMMISSIONS[emp.role].tshirt > 0 || COMMISSIONS[emp.role].lottery > 0 || COMMISSIONS[emp.role].disco > 0;
    const ITEM_LABELS: Record<SaleItem, string> = { tshirt: t('tshirt_label'), lottery: t('lottery_label'), disco: t('disco_label') };

    const saveTargets = () => {
      const cur = targetInputs[emp.id] ?? { tshirt: '', lottery: '', disco: '' };
      const ts = parseInt(cur.tshirt  || '0', 10);
      const lo = parseInt(cur.lottery || '0', 10);
      const di = parseInt(cur.disco   || '0', 10);
      setSalesTarget(emp.id, curYear, curMonth, isNaN(ts) ? 0 : ts, isNaN(lo) ? 0 : lo, isNaN(di) ? 0 : di);
    };

    return (
      <BlurView key={emp.id} intensity={98} tint="light" style={styles.salesEmpCard}>
        {/* Header row */}
        <View style={styles.rosterCardHeader}>
          <Text style={styles.rosterName}>{emp.name}</Text>
          <View style={[styles.empRoleBadge, { backgroundColor: `${ROLE_BADGE_COLOR[emp.role]}22` }]}>
            <Text style={[styles.empRoleText, { color: ROLE_BADGE_COLOR[emp.role] }]}>{emp.role.toUpperCase()}</Text>
          </View>
        </View>

        {/* Per-item qty sold + target input + progress bar */}
        {(['tshirt', 'lottery', 'disco'] as SaleItem[]).map((item) => {
          const qSold = qty[item];
          const qTgt  = target[item];
          const pct   = qTgt > 0 ? Math.min(qSold / qTgt, 1) : 0;
          return (
            <View key={item} style={styles.salesItemTargetBlock}>
              <View style={styles.salesItemRow}>
                <Text style={styles.salesItemLabel}>{ITEM_LABELS[item]}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {qTgt > 0 && (
                    <Text style={styles.qtyOfTarget}>{t('qty_of_target', { n: String(qSold), t: String(qTgt) })}</Text>
                  )}
                  <Text style={styles.salesItemAmt}>${sales[item]}</Text>
                </View>
              </View>
              {qTgt > 0 && (
                <View style={styles.salesProgressBar}>
                  <View style={[styles.salesProgressFill, { width: `${Math.round(pct * 100)}%` as any }]} />
                </View>
              )}
              <View style={styles.salesTargetRow}>
                <Text style={styles.salesTargetLabel}>QTY Target:</Text>
                <TextInput
                  style={styles.salesTargetInput}
                  value={tInputs[item]}
                  onChangeText={(v) => setTargetInputs((prev) => ({
                    ...prev,
                    [emp.id]: { ...(prev[emp.id] ?? { tshirt: '', lottery: '', disco: '' }), [item]: v },
                  }))}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  onBlur={saveTargets}
                />
              </View>
            </View>
          );
        })}

        {/* Totals row */}
        {sales.total > 0 && (
          <View style={[styles.salesItemRow, { marginTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.08)', paddingTop: 8 }]}>
            <Text style={[styles.salesItemLabel, { fontWeight: '700' }]}>${sales.total}</Text>
            {hasCommission && (
              <Text style={[styles.salesItemLabel, { color: '#00C48C', fontWeight: '700' }]}>
                {t('commission_earned', { n: fmtComm(commission) })}
              </Text>
            )}
          </View>
        )}

        {/* Add Sale panel */}
        {isAdding ? (
          <View style={styles.addSalePanel}>
            {(['tshirt', 'lottery', 'disco'] as SaleItem[]).map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.addSaleItemBtn, addSaleItem === item && styles.addSaleItemBtnActive]}
                onPress={() => setAddSaleItem(item)}
              >
                <Text style={[styles.addSaleItemTxt, addSaleItem === item && { color: Brand.navy }]}>
                  {SALE_PRODUCTS[item].label} · ${SALE_PRODUCTS[item].price}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.addSaleQtyRow}>
              <Text style={styles.salesTargetLabel}>Qty:</Text>
              <TextInput
                style={styles.salesTargetInput}
                value={addSaleQty}
                onChangeText={setAddSaleQty}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor="rgba(0,0,0,0.3)"
              />
              <TouchableOpacity
                style={styles.addSaleConfirmBtn}
                onPress={() => {
                  const q = parseInt(addSaleQty, 10);
                  if (!isNaN(q) && q > 0) addSaleRecord(emp.id, addSaleItem, q);
                  setAddSaleEmpId(null);
                  setAddSaleQty('1');
                }}
              >
                <Text style={styles.addSaleConfirmTxt}>✓ Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAddSaleEmpId(null)} style={styles.addSaleCancelBtn}>
                <Text style={styles.addSaleCancelTxt}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.addSaleBtn} onPress={() => { setAddSaleEmpId(emp.id); setAddSaleItem('tshirt'); setAddSaleQty('1'); }}>
            <Text style={styles.addSaleBtnTxt}>+ {t('add_sale')}</Text>
          </TouchableOpacity>
        )}
      </BlurView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground source={BG_IMAGE} style={styles.bgImage} resizeMode="cover" />
      <View style={styles.overlay}>

        {/* ─── Header ─── */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <Text style={styles.brandLabel}>SPLASH ENTERTAINMENT</Text>
            <TouchableOpacity onPress={handleSignOut} style={styles.logoutBtn}>
              <Text style={styles.logoutText}>{t('sign_out')}</Text>
            </TouchableOpacity>
          </View>
          {/* ── Name + role pill + task count on one row ── */}
          <View style={styles.nameRow}>
            <Text style={styles.headerTitle}>{staff.name}</Text>
            <View style={[styles.rolePill, { backgroundColor: `${ROLE_BADGE_COLOR[staff.role]}28` }]}>
              <Text style={[styles.rolePillText, { color: ROLE_BADGE_COLOR[staff.role] }]}>
                {staff.role.toUpperCase()}
              </Text>
            </View>
            {isToday && totalCount > 0 && (
              <Text style={styles.progressCompact}>
                {completedCount}/{totalCount} {Math.round((completedCount / totalCount) * 100)}%
              </Text>
            )}
          </View>

          {/* ── Slim check-in bar (single row) ── */}
          <View style={[styles.checkInSlim, myCheckIn ? styles.checkInSlimActive : null]}>
            {myCheckIn ? (
              <>
                <View style={styles.checkInDot} />
                <Text style={styles.checkInOnDutyText}>{t('on_duty')}</Text>
                <Text style={styles.checkInSinceText}>
                  {' · '}{new Date(myCheckIn.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' · '}{formatDuration(myCheckIn.checkedInAt, now.getTime())}
                </Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.clockOutBtn} onPress={checkOut} activeOpacity={0.8}>
                  <Text style={styles.clockBtnText}>{t('clock_out')}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.checkInPromptText}>{t('check_in_prompt')}</Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.clockInBtn} onPress={checkIn} activeOpacity={0.8}>
                  <Text style={styles.clockBtnText}>{t('clock_in')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* MY SALES card moved to FlatList ListHeaderComponent below */}

          {/* ── Tab switcher: leader gets SCHEDULE|ROSTER, admin gets SCHEDULE|HR|EMPLOYEES ── */}
          {(staff.role === 'admin' || staff.role === 'leader') && (
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'schedule' && styles.tabBtnActive]}
                onPress={() => setActiveTab('schedule')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabBtnText, activeTab === 'schedule' && styles.tabBtnTextActive]}>
                  {t('todays_schedule')}
                </Text>
              </TouchableOpacity>
              {staff.role === 'leader' && (
                <TouchableOpacity
                  style={[styles.tabBtn, activeTab === 'roster' && styles.tabBtnActive]}
                  onPress={() => setActiveTab('roster')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabBtnText, activeTab === 'roster' && styles.tabBtnTextActive]}>
                    {t('roster_tab')}
                  </Text>
                </TouchableOpacity>
              )}
              {staff.role === 'admin' && (
                <>
                  <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'hr' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('hr')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tabBtnText, activeTab === 'hr' && styles.tabBtnTextActive]}>
                      {t('hr_tab')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'employees' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('employees')}
                    activeOpacity={0.8}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.tabBtnText, activeTab === 'employees' && styles.tabBtnTextActive]}>
                        {t('employees_tab')}
                      </Text>
                      {pendingEmployees.length > 0 && (
                        <View style={styles.tabPendingBadge}>
                          <Text style={styles.tabPendingBadgeText}>{pendingEmployees.length}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {/* ── Pending requests alert banner (admin only, when not on employees tab) ── */}
          {staff.role === 'admin' && pendingEmployees.length > 0 && activeTab !== 'employees' && (
            <TouchableOpacity
              style={styles.pendingAlertBanner}
              onPress={() => setActiveTab('employees')}
              activeOpacity={0.85}
            >
              <Text style={styles.pendingAlertIcon}>🔔</Text>
              <Text style={styles.pendingAlertText}>
                {pendingEmployees.length} new staff request{pendingEmployees.length > 1 ? 's' : ''} waiting for approval
              </Text>
              <Text style={styles.pendingAlertArrow}>→</Text>
            </TouchableOpacity>
          )}

          {/* ── Day selector (schedule tab only) ── */}
          {activeTab === 'schedule' && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daySelectorContent}
              style={styles.daySelector}
            >
              {dayShort.map((name, dow) => {
                const isSelected    = selectedDow === dow;
                const isCurrentDay  = dow === todayDow;
                const date          = dateForDow(dow);
                return (
                  <TouchableOpacity
                    key={dow}
                    style={[styles.dayBtn, isSelected && styles.dayBtnSelected]}
                    onPress={() => setSelectedDow(dow)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.dayBtnName, isSelected && styles.dayBtnTextSelected]}>
                      {name}
                    </Text>
                    <Text style={[styles.dayBtnDate, isSelected && styles.dayBtnTextSelected]}>
                      {date.getDate()}
                    </Text>
                    {isCurrentDay && (
                      <View style={[styles.todayDot, isSelected && styles.todayDotSelected]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* ─── Content area ─── */}
        {activeTab === 'hr' ? (
          // ─── HR attendance tab (admin only) ────────────────────────────────
          <ScrollView contentContainerStyle={[styles.listContainer, { paddingHorizontal: 20, paddingTop: 24 }]} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeaderWrap}>
              <Text style={styles.sectionTitle}>{t('attendance_title')}</Text>
              <View style={styles.divider} />
            </View>

            {/* ── Broadcast to all staff ── */}
            {staff.role === 'admin' && (
              <View style={styles.broadcastBox}>
                <TouchableOpacity
                  style={styles.broadcastHeader}
                  onPress={() => { setBroadcastOpen(v => !v); setBroadcastDone(false); }}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={['#004AAD', '#0077FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.broadcastHeaderGrad}>
                    <Text style={styles.broadcastHeaderIcon}>📣</Text>
                    <Text style={styles.broadcastHeaderTitle}>ANNOUNCE TO ALL STAFF</Text>
                    <Text style={styles.broadcastChevron}>{broadcastOpen ? '▲' : '▼'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                {broadcastOpen && (
                  <View style={styles.broadcastBody}>
                    {broadcastDone ? (
                      <View style={styles.broadcastSuccess}>
                        <Text style={styles.broadcastSuccessIcon}>✅</Text>
                        <Text style={styles.broadcastSuccessText}>Notification sent to all staff!</Text>
                        <TouchableOpacity onPress={() => { setBroadcastDone(false); setBroadcastMsg(''); }} style={styles.broadcastResetBtn}>
                          <Text style={styles.broadcastResetText}>Send another</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <>
                        <Text style={styles.broadcastLabel}>Message</Text>
                        <TextInput
                          style={styles.broadcastInput}
                          value={broadcastMsg}
                          onChangeText={setBroadcastMsg}
                          placeholder="e.g. Team meeting at 19:00 near main pool"
                          placeholderTextColor="rgba(255,255,255,0.3)"
                          multiline
                          numberOfLines={3}
                          returnKeyType="done"
                        />
                        <TouchableOpacity
                          style={[styles.broadcastSendBtn, (!broadcastMsg.trim() || broadcastBusy) && { opacity: 0.5 }]}
                          disabled={!broadcastMsg.trim() || broadcastBusy}
                          activeOpacity={0.85}
                          onPress={async () => {
                            setBroadcastBusy(true);
                            await sendPushToAll('📣 Splash Entertainment', broadcastMsg.trim()).catch(() => {});
                            setBroadcastBusy(false);
                            setBroadcastDone(true);
                          }}
                        >
                          {broadcastBusy
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.broadcastSendText}>SEND NOW</Text>
                          }
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* LIVE | MONTHLY | MAP | SALES | REVIEWS sub-tab toggle */}
            <View style={styles.hrSubTabRow}>
              {(['live', 'monthly', ...(staff.role === 'admin' ? ['map', 'sales', 'reviews'] : [])] as const).map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.hrSubTab, hrView === v && styles.hrSubTabActive]}
                  onPress={() => setHrView(v as 'live' | 'monthly' | 'map' | 'sales' | 'reviews')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.hrSubTabText, hrView === v && styles.hrSubTabTextActive]}>
                    {v === 'live' ? t('live_tab') : v === 'monthly' ? t('monthly_tab') : v === 'map' ? t('map_tab') : v === 'sales' ? t('sales_tab') : 'REVIEWS'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {hrView === 'live' ? (
              <>
                {/* Stats strip */}
                <View style={styles.hrStatsRow}>
                  <BlurView intensity={80} tint="light" style={[styles.hrStatCard, { borderColor: 'rgba(0,196,140,0.5)' }]}>
                    <Text style={[styles.hrStatNum, { color: '#00C48C' }]}>{onDutyCount}</Text>
                    <Text style={styles.hrStatLabel}>{t('on_duty_label')}</Text>
                  </BlurView>
                  <BlurView intensity={80} tint="light" style={[styles.hrStatCard, { borderColor: 'rgba(255,107,107,0.5)' }]}>
                    <Text style={[styles.hrStatNum, { color: '#FF6B6B' }]}>{employees.length - onDutyCount}</Text>
                    <Text style={styles.hrStatLabel}>{t('off_duty_label')}</Text>
                  </BlurView>
                  <BlurView intensity={80} tint="light" style={[styles.hrStatCard, { borderColor: `${Brand.turquoise}88` }]}>
                    <Text style={[styles.hrStatNum, { color: Brand.turquoise }]}>{employees.length}</Text>
                    <Text style={styles.hrStatLabel}>{t('total_label')}</Text>
                  </BlurView>
                </View>

                {/* Live roster */}
                <View style={[styles.sectionHeaderWrap, { marginTop: 20 }]}>
                  <Text style={styles.sectionTitle}>{t('live_roster')}</Text>
                  <View style={styles.divider} />
                </View>
                {rosterItems.map(({ emp, active }) => (
                  <BlurView key={emp.id} intensity={85} tint="light" style={styles.rosterCard}>
                    <View style={styles.rosterCardHeader}>
                      <View style={[styles.rosterStatusDot, { backgroundColor: active ? '#00C48C' : '#ccc' }]} />
                      <Text style={styles.rosterName}>{emp.name}</Text>
                      <View style={[styles.empRoleBadge, { backgroundColor: `${ROLE_BADGE_COLOR[emp.role]}22` }]}>
                        <Text style={[styles.empRoleText, { color: ROLE_BADGE_COLOR[emp.role] }]}>{emp.role.toUpperCase()}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setExpandedHistoryId(expandedHistoryId === emp.id ? null : emp.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.historyToggleText}>
                          {expandedHistoryId === emp.id ? t('hide_history') : t('view_history')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {active ? (
                      <Text style={styles.rosterOnDutyText}>
                        ✓ {t('on_duty')} · {t('since_time', { time: new Date(active.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })} · {t('shift_label', { d: formatDuration(active.checkedInAt, now.getTime()) })}
                      </Text>
                    ) : (
                      <Text style={styles.rosterOffDutyText}>{t('not_checked_in')}</Text>
                    )}
                    {expandedHistoryId === emp.id && (
                      <View style={styles.historyPanel}>
                        <Text style={styles.historyHoursRow}>
                          {t('hours_today', { h: computeHours(checkIns, emp.id, todayStart, new Date(todayStart.getTime() + 86_400_000)) })}
                          {'  ·  '}
                          {t('hours_week', { h: computeHours(checkIns, emp.id, weekStart, new Date()) })}
                        </Text>
                        {checkIns
                          .filter((r) => r.employeeId === emp.id)
                          .sort((a, b) => b.checkedInAt.localeCompare(a.checkedInAt))
                          .slice(0, 5)
                          .map((r, i) => (
                            <Text key={i} style={styles.historyRecord}>
                              {new Date(r.checkedInAt).toLocaleDateString()}{' · '}
                              {new Date(r.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {' → '}
                              {r.checkedOutAt
                                ? new Date(r.checkedOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : t('still_on_duty')}
                              {r.checkedOutAt ? `  (${formatDuration(r.checkedInAt, new Date(r.checkedOutAt).getTime())})` : ''}
                            </Text>
                          ))}
                        {checkIns.filter((r) => r.employeeId === emp.id).length === 0 && (
                          <Text style={styles.historyRecord}>{t('no_shifts_yet')}</Text>
                        )}
                      </View>
                    )}
                  </BlurView>
                ))}
              </>
            ) : hrView === 'monthly' ? (
              <>
                {/* Monthly attendance view */}
                <View style={styles.sectionHeaderWrap}>
                  <Text style={styles.sectionTitle}>{t('monthly_attendance')}</Text>
                  <View style={styles.divider} />
                </View>

                {/* Month navigation */}
                <View style={styles.monthNavRow}>
                  <TouchableOpacity onPress={prevMonth} style={styles.monthNavBtn} activeOpacity={0.7}>
                    <Text style={styles.monthNavArrow}>‹</Text>
                  </TouchableOpacity>
                  <Text style={styles.monthNavLabel}>{monthLabel.toUpperCase()}</Text>
                  <TouchableOpacity onPress={nextMonth} style={styles.monthNavBtn} activeOpacity={0.7}>
                    <Text style={styles.monthNavArrow}>›</Text>
                  </TouchableOpacity>
                </View>

                {/* Employee attendance cards */}
                {employees.map((emp) => {
                  const dayMap  = computeMonthDayMap(checkIns, emp.id, viewYear, viewMonth);
                  const totalH  = fmtH(computeMonthTotalMins(checkIns, emp.id, viewYear, viewMonth));
                  return (
                    <BlurView key={emp.id} intensity={85} tint="light" style={styles.monthEmpCard}>
                      <View style={styles.monthEmpHeader}>
                        <Text style={styles.rosterName}>{emp.name}</Text>
                        <View style={[styles.empRoleBadge, { backgroundColor: `${ROLE_BADGE_COLOR[emp.role]}22` }]}>
                          <Text style={[styles.empRoleText, { color: ROLE_BADGE_COLOR[emp.role] }]}>{emp.role.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.monthEmpStats}>
                          {t('days_worked', { n: String(dayMap.size) })}{'  ·  '}{totalH}
                        </Text>
                      </View>
                      {dayMap.size === 0 ? (
                        <Text style={styles.noDataMonth}>{t('no_data_month')}</Text>
                      ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <View style={styles.dayStrip}>
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                              const status = dayMap.get(day);
                              return (
                                <View key={day} style={styles.dayCellWrap}>
                                  <View style={[styles.dayCellBox, {
                                    backgroundColor: status === 'complete' ? '#00C48C'
                                      : status === 'partial' ? '#FFB800'
                                      : 'rgba(255,255,255,0.12)',
                                  }]} />
                                  <Text style={styles.dayCellNum}>{day}</Text>
                                </View>
                              );
                            })}
                          </View>
                        </ScrollView>
                      )}
                    </BlurView>
                  );
                })}
              </>
            ) : hrView === 'map' ? (
              /* MAP view — live employee GPS */
              <StaffMap
                locations={liveLocations}
                roleColors={ROLE_BADGE_COLOR}
                noEmployeesText={t('no_employees_map')}
                locationSharingText={t('location_sharing')}
                liveRosterLabel={t('live_roster')}
              />
            ) : hrView === 'reviews' ? (
              /* REVIEWS view — guest feedback */
              <View style={styles.reviewsContainer}>
                {/* Header summary */}
                <BlurView intensity={85} tint="light" style={styles.reviewsSummaryCard}>
                  <Text style={styles.reviewsSummaryTitle}>GUEST REVIEWS</Text>
                  <Text style={styles.reviewsSummaryCount}>
                    {guestReviews.length === 0 ? 'No reviews yet' : `${guestReviews.length} review${guestReviews.length !== 1 ? 's' : ''}`}
                  </Text>
                  {guestReviews.length > 0 && (
                    <Text style={styles.reviewsSummaryAvg}>
                      {'★'.repeat(Math.round(guestReviews.reduce((s, r) => s + r.overall, 0) / guestReviews.length))}
                      {'☆'.repeat(5 - Math.round(guestReviews.reduce((s, r) => s + r.overall, 0) / guestReviews.length))}
                      {'  '}
                      {(guestReviews.reduce((s, r) => s + r.overall, 0) / guestReviews.length).toFixed(1)} / 5.0
                    </Text>
                  )}
                </BlurView>

                {guestReviews.length === 0 ? (
                  <BlurView intensity={80} tint="light" style={styles.reviewsEmptyCard}>
                    <Text style={styles.reviewsEmptyIcon}>💬</Text>
                    <Text style={styles.reviewsEmptyText}>No guest reviews yet.</Text>
                    <Text style={styles.reviewsEmptyHint}>Reviews submitted by guests will appear here.</Text>
                  </BlurView>
                ) : (
                  guestReviews.map((review, idx) => {
                    const starFilled = Math.round(review.overall);
                    const ASPECT_LABELS: Record<string, string> = {
                      pool:          '🏊 Pool & Beach',
                      food:          '🍽️ Food & Dining',
                      entertainment: '🎭 Entertainment',
                      staff:         '👥 Staff',
                      room:          '🛏️ Room',
                      cleanliness:   '✨ Cleanliness',
                    };
                    return (
                      <BlurView key={idx} intensity={85} tint="light" style={styles.reviewCard}>
                        {/* Header row */}
                        <View style={styles.reviewCardHeader}>
                          <View style={styles.reviewAvatarCircle}>
                            <Text style={styles.reviewAvatarLetter}>
                              {review.guestName ? review.guestName.charAt(0).toUpperCase() : '?'}
                            </Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.reviewGuestName}>{review.guestName || 'Anonymous Guest'}</Text>
                            {review.nationality ? (
                              <Text style={styles.reviewNationality}>{review.nationality}</Text>
                            ) : null}
                          </View>
                          <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.reviewOverallStars}>
                              {'★'.repeat(starFilled)}{'☆'.repeat(5 - starFilled)}
                            </Text>
                            <Text style={styles.reviewDate}>
                              {new Date(review.submittedAt).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>

                        {/* Comment */}
                        {!!review.comment && (
                          <Text style={styles.reviewComment}>"{review.comment}"</Text>
                        )}

                        {/* Aspect ratings */}
                        {review.aspects && Object.keys(review.aspects).length > 0 && (
                          <View style={styles.reviewAspectsGrid}>
                            {Object.entries(review.aspects).map(([key, val]) => (
                              <View key={key} style={styles.reviewAspectChip}>
                                <Text style={styles.reviewAspectLabel}>
                                  {ASPECT_LABELS[key] ?? key}
                                </Text>
                                <Text style={styles.reviewAspectStars}>
                                  {'★'.repeat(Math.round(val as number))}{'☆'.repeat(5 - Math.round(val as number))}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </BlurView>
                    );
                  })
                )}
              </View>
            ) : (
              /* SALES view — admin manages targets & logs sales, grouped by role */
              <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>

                {/* Commission Schedule table */}
                <BlurView intensity={85} tint="light" style={styles.commSchedCard}>
                  <Text style={styles.commSchedTitle}>{t('commission_schedule')}</Text>
                  {/* Header row */}
                  <View style={[styles.commSchedRow, styles.commSchedHeaderRow]}>
                    <Text style={[styles.commSchedCell, styles.commSchedHeaderCell, { flex: 2 }]}>ITEM</Text>
                    <Text style={[styles.commSchedCell, styles.commSchedHeaderCell]}>{t('entertainers_sheet').replace(/S$/, '')}</Text>
                    <Text style={[styles.commSchedCell, styles.commSchedHeaderCell]}>{t('leaders_sheet').replace(/S$/, '')}</Text>
                    <Text style={[styles.commSchedCell, styles.commSchedHeaderCell]}>CO.</Text>
                  </View>
                  {([
                    { item: 'tshirt'  as SaleItem, label: 'T-Shirt',  price: 20 },
                    { item: 'lottery' as SaleItem, label: 'Lottery',  price: 5  },
                    { item: 'disco'   as SaleItem, label: 'Disco',    price: 20 },
                  ]).map(({ item, label, price }, idx) => {
                    const entRate  = COMMISSIONS.entertainer[item];
                    const leadRate = COMMISSIONS.leader[item];
                    const company  = price - entRate; // worst case (entertainer)
                    return (
                      <View key={item} style={[styles.commSchedRow, idx % 2 === 0 && styles.commSchedAltRow]}>
                        <View style={[styles.commSchedCell, { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
                          <Text style={styles.commSchedItemLabel}>{label}</Text>
                          <Text style={styles.commSchedItemPrice}>${price}</Text>
                        </View>
                        <Text style={[styles.commSchedCell, styles.commSchedEntCell]}>${entRate}{t('per_unit')}</Text>
                        <Text style={[styles.commSchedCell, styles.commSchedLeadCell]}>${leadRate}{t('per_unit')}</Text>
                        <Text style={[styles.commSchedCell, styles.commSchedCoCell]}>${price - entRate}+</Text>
                      </View>
                    );
                  })}
                </BlurView>

                {/* Company Revenue summary card */}
                {(() => {
                  const companyRev  = monthlyCompanyRevenue();
                  const totalDebits = monthlyTotalDebits();
                  const netCash     = companyRev - totalDebits;
                  const totalSales  = salesRecords.filter((r) => {
                    const d = new Date(r.date);
                    return d.getFullYear() === curYear && d.getMonth() === curMonth;
                  }).reduce((s, r) => s + r.amount, 0);
                  return (
                    <BlurView intensity={90} tint="light" style={styles.companyRevCard}>
                      <Text style={styles.companyRevLabel}>{t('company_revenue')}</Text>
                      <Text style={styles.companyRevAmount}>${fmtComm(companyRev)}</Text>
                      <Text style={styles.companyRevSub}>of ${totalSales} total sales</Text>
                      {totalDebits > 0 && (
                        <View style={styles.companyRevDebitRow}>
                          <Text style={styles.companyRevDebitText}>− ${fmtComm(totalDebits)} {t('total_debited').toLowerCase()}</Text>
                          <Text style={styles.companyRevNetText}>{t('net_cash')}: ${fmtComm(netCash)}</Text>
                        </View>
                      )}
                    </BlurView>
                  );
                })()}

                {/* ENTERTAINERS section */}
                {employees.filter((e) => e.role === 'entertainer').length > 0 && (
                  <>
                    <View style={[styles.salesSheetHeader, { borderLeftColor: Brand.turquoise }]}>
                      <Text style={[styles.salesSheetTitle, { color: Brand.turquoise }]}>{t('entertainers_sheet')}</Text>
                    </View>
                    {employees.filter((e) => e.role === 'entertainer').map(renderSalesEmpCard)}
                  </>
                )}

                {/* LEADERS section */}
                {employees.filter((e) => e.role === 'leader').length > 0 && (
                  <>
                    <View style={[styles.salesSheetHeader, { borderLeftColor: '#00C48C' }]}>
                      <Text style={[styles.salesSheetTitle, { color: '#00C48C' }]}>{t('leaders_sheet')}</Text>
                    </View>
                    {employees.filter((e) => e.role === 'leader').map(renderSalesEmpCard)}
                  </>
                )}

                {/* ADMIN section (no commission) */}
                {employees.filter((e) => e.role === 'admin').length > 0 && (
                  <>
                    <View style={[styles.salesSheetHeader, { borderLeftColor: '#FF6B6B' }]}>
                      <Text style={[styles.salesSheetTitle, { color: '#FF6B6B' }]}>ADMIN</Text>
                    </View>
                    {employees.filter((e) => e.role === 'admin').map(renderSalesEmpCard)}
                  </>
                )}

                {/* CASH DEDUCTIONS sheet */}
                <View style={[styles.salesSheetHeader, { borderLeftColor: '#FFB800', marginTop: 20 }]}>
                  <Text style={[styles.salesSheetTitle, { color: '#FFB800' }]}>{t('debit_sheet')}</Text>
                </View>

                {/* Debit list */}
                {debitRecords
                  .filter((r) => { const d = new Date(r.date); return d.getFullYear() === curYear && d.getMonth() === curMonth; })
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .length === 0 ? (
                  <BlurView intensity={98} tint="light" style={[styles.salesEmpCard, { alignItems: 'center', paddingVertical: 18 }]}>
                    <Text style={{ fontSize: 12, color: '#aaa', fontWeight: '500' }}>{t('no_debits_yet')}</Text>
                  </BlurView>
                ) : (
                  debitRecords
                    .filter((r) => { const d = new Date(r.date); return d.getFullYear() === curYear && d.getMonth() === curMonth; })
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((r) => (
                      <BlurView key={r.id} intensity={85} tint="light" style={styles.debitRecordCard}>
                        <View style={styles.debitRecordRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.debitRecordAmt}>− ${fmtComm(r.amount)}</Text>
                            {r.note ? <Text style={styles.debitRecordNote}>{r.note}</Text> : null}
                            <Text style={styles.debitRecordDate}>
                              {new Date(r.date).toLocaleDateString()} · {new Date(r.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </View>
                          <TouchableOpacity onPress={() => deleteDebitRecord(r.id)} style={styles.debitDeleteBtn}>
                            <Text style={styles.debitDeleteTxt}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      </BlurView>
                    ))
                )}

                {/* Total debited row */}
                {monthlyTotalDebits() > 0 && (
                  <View style={styles.debitTotalRow}>
                    <Text style={styles.debitTotalLabel}>{t('total_debited')}</Text>
                    <Text style={styles.debitTotalAmt}>− ${fmtComm(monthlyTotalDebits())}</Text>
                  </View>
                )}

                {/* Add deduction form */}
                {showDebitForm ? (
                  <BlurView intensity={85} tint="light" style={styles.salesEmpCard}>
                    <TextInput
                      style={[styles.salesTargetInput, { width: '100%', textAlign: 'left', marginBottom: 8 }]}
                      value={debitAmtInput}
                      onChangeText={setDebitAmtInput}
                      keyboardType="numeric"
                      placeholder="Amount ($)"
                      placeholderTextColor="rgba(0,0,0,0.3)"
                    />
                    <TextInput
                      style={[styles.noteInput, { backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 8, padding: 10, minHeight: 60 }]}
                      value={debitNoteInput}
                      onChangeText={setDebitNoteInput}
                      placeholder={t('debit_note_hint')}
                      placeholderTextColor="rgba(0,0,0,0.3)"
                      multiline
                    />
                    <View style={[styles.addSaleQtyRow, { marginTop: 10 }]}>
                      <TouchableOpacity
                        style={styles.addSaleConfirmBtn}
                        onPress={() => {
                          const amt = parseFloat(debitAmtInput);
                          if (!isNaN(amt) && amt > 0) {
                            addDebitRecord(amt, debitNoteInput.trim());
                            setDebitAmtInput('');
                            setDebitNoteInput('');
                            setShowDebitForm(false);
                          }
                        }}
                      >
                        <Text style={styles.addSaleConfirmTxt}>✓ Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setShowDebitForm(false)} style={styles.addSaleCancelBtn}>
                        <Text style={styles.addSaleCancelTxt}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </BlurView>
                ) : (
                  <TouchableOpacity style={[styles.addSaleBtn, { borderColor: '#FFB80030', backgroundColor: '#FFB80015' }]} onPress={() => setShowDebitForm(true)}>
                    <Text style={[styles.addSaleBtnTxt, { color: '#CC9200' }]}>+ {t('add_debit')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>

        ) : activeTab === 'roster' ? (
          // ─── Roster tab (leader only) ───────────────────────────────────────
          <ScrollView contentContainerStyle={[styles.listContainer, { paddingHorizontal: 20, paddingTop: 24 }]} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeaderWrap}>
              <Text style={styles.sectionTitle}>{t('team_today')}</Text>
              <View style={styles.divider} />
              <Text style={styles.progressText}>
                {onDutyCount > 0
                  ? `${onDutyCount} ${t('on_duty_label').toLowerCase()}`
                  : t('not_checked_in')}
              </Text>
            </View>
            {onDutyCount === 0 ? (
              <BlurView intensity={80} tint="light" style={styles.emptyEmpCard}>
                <Text style={styles.emptyEmpText}>{t('not_checked_in')}</Text>
              </BlurView>
            ) : (
              rosterItems
                .filter((x) => x.active)
                .map(({ emp, active }) => (
                  <BlurView key={emp.id} intensity={85} tint="light" style={styles.rosterCard}>
                    <View style={styles.rosterCardHeader}>
                      <View style={[styles.rosterStatusDot, { backgroundColor: '#00C48C' }]} />
                      <Text style={styles.rosterName}>{emp.name}</Text>
                      <View style={[styles.empRoleBadge, { backgroundColor: `${ROLE_BADGE_COLOR[emp.role]}22` }]}>
                        <Text style={[styles.empRoleText, { color: ROLE_BADGE_COLOR[emp.role] }]}>{emp.role.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={styles.rosterOnDutyText}>
                      ✓ {t('on_duty')} · {t('since_time', { time: new Date(active!.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })} · {t('shift_label', { d: formatDuration(active!.checkedInAt, now.getTime()) })}
                    </Text>
                  </BlurView>
                ))
            )}
          </ScrollView>

        ) : activeTab === 'employees' ? (
          // ─── Employees list (admin only) ───────────────────────────────────
          <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>

            {/* ── Pending Requests ── */}
            {pendingEmployees.length > 0 && (
              <View style={{ marginBottom: 8 }}>
                <View style={styles.pendingSectionHeader}>
                  <View style={styles.pendingSectionDot} />
                  <Text style={styles.pendingSectionTitle}>
                    PENDING REQUESTS
                  </Text>
                  <View style={styles.pendingCountBadge}>
                    <Text style={styles.pendingCountText}>{pendingEmployees.length}</Text>
                  </View>
                </View>
                {pendingEmployees.map((emp) => (
                  <View key={emp.id} style={styles.pendingCard}>
                    {/* Top accent bar */}
                    <LinearGradient
                      colors={['#FF8C00', '#FFB700']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={styles.pendingAccentBar}
                    />
                    <View style={styles.pendingCardInner}>
                      {/* Profile row */}
                      <View style={styles.pendingTopRow}>
                        <View style={styles.pendingAvatarWrap}>
                          {emp.profilePhoto
                            ? <Image source={{ uri: emp.profilePhoto }} style={styles.pendingAvatar} />
                            : <View style={styles.pendingAvatarFallback}><Text style={{ fontSize: 26 }}>👤</Text></View>
                          }
                          <View style={styles.pendingAvatarBadge} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 14 }}>
                          <Text style={styles.pendingName}>{emp.name}</Text>
                          <Text style={styles.pendingEmail}>{emp.email}</Text>
                          {emp.whatsapp ? (
                            <View style={styles.pendingWhatsappRow}>
                              <Text style={styles.pendingWhatsappIcon}>💬</Text>
                              <Text style={styles.pendingWhatsapp}>{emp.whatsapp}</Text>
                            </View>
                          ) : null}
                          <Text style={styles.pendingDate}>
                            Applied {new Date(emp.joinedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </Text>
                        </View>
                      </View>

                      {/* ID Photo */}
                      {emp.idPhoto ? (
                        <View style={styles.idPhotoWrap}>
                          <View style={styles.idPhotoHeader}>
                            <Text style={styles.idPhotoLabel}>🪪  ID / PASSPORT</Text>
                          </View>
                          <Image source={{ uri: emp.idPhoto }} style={styles.idPhotoPreview} resizeMode="cover" />
                        </View>
                      ) : null}

                      {/* Action buttons */}
                      <View style={styles.pendingBtnRow}>
                        <TouchableOpacity style={styles.approveBtn} onPress={() => approveEmployee(emp.id)} activeOpacity={0.85}>
                          <Text style={styles.approveTxt}>✓  APPROVE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rejectBtn} onPress={() => rejectEmployee(emp.id)} activeOpacity={0.85}>
                          <Text style={styles.rejectTxt}>✕  REJECT</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.sectionHeaderWrap}>
              <Text style={styles.sectionTitle}>{t('employees_title')}</Text>
              <View style={styles.divider} />
              <Text style={styles.progressText}>{t('employees_count', { n: String(employees.length) })}</Text>
            </View>
            {employees.length === 0 ? (
              <BlurView intensity={80} tint="light" style={styles.emptyEmpCard}>
                <Text style={styles.emptyEmpText}>{t('no_employees')}</Text>
              </BlurView>
            ) : (
              employees.map((emp) => (
                <BlurView key={emp.id} intensity={85} tint="light" style={styles.empCard}>
                  <View style={styles.empCardHeader}>
                    <Text style={styles.empName}>{emp.name}</Text>
                    <View style={[styles.empRoleBadge, { backgroundColor: `${ROLE_BADGE_COLOR[emp.role]}22` }]}>
                      <Text style={[styles.empRoleText, { color: ROLE_BADGE_COLOR[emp.role] }]}>
                        {emp.role.toUpperCase()}
                      </Text>
                    </View>
                    {emp.id !== staff.id && (
                      <TouchableOpacity onPress={() => deleteEmployee(emp.id)} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                        <Text style={[styles.taskDeleteTxt, { fontSize: 14 }]}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {emp.email      ? <Text style={styles.empDetail}>✉️  {emp.email}</Text>      : null}
                  {emp.phone      ? <Text style={styles.empDetail}>📞 {emp.phone}</Text>      : null}
                  {emp.instagram  ? <Text style={styles.empDetail}>📸 {emp.instagram}</Text>  : null}
                  {emp.whatsapp   ? <Text style={styles.empDetail}>💬 {emp.whatsapp}</Text>   : null}
                  {emp.nationality? <Text style={styles.empDetail}>🌍 {emp.nationality}</Text>: null}
                  <Text style={styles.empJoined}>
                    Joined {new Date(emp.joinedAt).toLocaleDateString()}
                  </Text>
                  {/* Role change — admin can promote/demote anyone except themselves */}
                  {emp.id !== staff.id && (
                    <View style={styles.roleChangeRow}>
                      {(['entertainer', 'leader', 'admin'] as Role[]).map((r) => (
                        <TouchableOpacity
                          key={r}
                          style={[styles.roleChangeBtn, emp.role === r && { backgroundColor: `${ROLE_BADGE_COLOR[r]}22`, borderColor: ROLE_BADGE_COLOR[r] }]}
                          onPress={() => updateEmployeeRole(emp.id, r)}
                          activeOpacity={0.75}
                        >
                          <Text style={[styles.roleChangeTxt, emp.role === r && { color: ROLE_BADGE_COLOR[r] }]}>
                            {r.toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </BlurView>
              ))
            )}
          </ScrollView>
        ) : (
          // ─── Task list ──────────────────────────────────────────────────────
          <View style={styles.content}>
            <View style={styles.sectionHeaderWrap}>
              <Text style={styles.sectionTitle}>
                {isToday
                  ? t('todays_schedule')
                  : t('days_schedule', { day: dayShort[selectedDow].toUpperCase() })}
              </Text>
              <View style={styles.divider} />
            </View>

            <FlatList
              data={listData}
              keyExtractor={(item) =>
                item.type === 'header' ? `header-${item.label}` : item.data.id
              }
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListHeaderComponent={staff.role !== 'admin' ? (() => {
                const qty        = empMonthlyQty(staff.id);
                const target     = empTarget(staff.id);
                const commission = empMonthlyCommission(staff.id, staff.role);
                const ITEM_LABELS: Record<SaleItem, string> = { tshirt: t('tshirt_label'), lottery: t('lottery_label'), disco: t('disco_label') };
                const hasAnySales = qty.tshirt > 0 || qty.lottery > 0 || qty.disco > 0;
                return (
                  <BlurView intensity={70} tint="light" style={[styles.mySalesCard, { marginHorizontal: 0, marginBottom: 16 }]}>
                    <Text style={styles.mySalesTitle}>{t('sales_title')}</Text>
                    {/* Commission rate chips */}
                    <View style={styles.myRateRow}>
                      {(['tshirt', 'lottery', 'disco'] as SaleItem[]).map((item) => (
                        <View key={item} style={styles.myRateChip}>
                          <Text style={styles.myRateItem}>
                            {item === 'tshirt' ? 'T-SHIRT' : item === 'lottery' ? 'LOTTERY' : 'DISCO'}
                          </Text>
                          <Text style={styles.myRateAmt}>${COMMISSIONS[staff.role][item]}{t('per_unit')}</Text>
                        </View>
                      ))}
                    </View>
                    {/* Per-item qty sold vs target — no dollar amounts shown */}
                    {(['tshirt', 'lottery', 'disco'] as SaleItem[]).map((item) => {
                      const qSold = qty[item];
                      const qTgt  = target[item];
                      const pct   = qTgt > 0 ? Math.min(qSold / qTgt, 1) : 0;
                      const earned = COMMISSIONS[staff.role][item] * qSold;
                      return (
                        <View key={item} style={{ marginBottom: 6 }}>
                          <View style={styles.salesItemRow}>
                            <Text style={styles.salesItemLabel}>{ITEM_LABELS[item]}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              {qTgt > 0 && (
                                <Text style={styles.qtyOfTarget}>{t('qty_of_target', { n: String(qSold), t: String(qTgt) })}</Text>
                              )}
                              {qSold > 0 && qTgt === 0 && (
                                <Text style={styles.qtyOfTarget}>{qSold} sold</Text>
                              )}
                              {earned > 0 && (
                                <Text style={[styles.salesItemAmt, { color: '#00C48C' }]}>${fmtComm(earned)}</Text>
                              )}
                            </View>
                          </View>
                          {qTgt > 0 && (
                            <View style={[styles.salesProgressBar, { marginTop: 4 }]}>
                              <View style={[styles.salesProgressFill, { width: `${Math.round(pct * 100)}%` as any }]} />
                            </View>
                          )}
                        </View>
                      );
                    })}
                    {/* Total commission earned */}
                    {hasAnySales ? (
                      <View style={[styles.salesItemRow, { marginTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 8 }]}>
                        <Text style={[styles.myShiftsTitle, { letterSpacing: 1 }]}>{t('commission_earned', { n: fmtComm(commission) })}</Text>
                      </View>
                    ) : (
                      <Text style={styles.noSalesText}>{t('no_sales_yet')}</Text>
                    )}
                  </BlurView>
                );
              })() : null}
              ListEmptyComponent={(
                <BlurView intensity={70} tint="light" style={styles.emptyTaskCard}>
                  <Text style={styles.emptyTaskIcon}>📋</Text>
                  <Text style={styles.emptyTaskTitle}>
                    {staff.role === 'entertainer' || staff.role === 'leader'
                      ? 'No tasks assigned yet'
                      : 'No tasks for this day'}
                  </Text>
                  <Text style={styles.emptyTaskSub}>
                    {staff.role === 'entertainer'
                      ? 'Your admin or leader will assign tasks here'
                      : 'Tap "+ Add Task" below to create one'}
                  </Text>
                </BlurView>
              )}
              ListFooterComponent={(
                <View style={styles.myShiftsFooter}>
                  {/* ── Add Task form (admin / leader only) ── */}
                  {(staff.role === 'admin' || staff.role === 'leader') && (
                    showAddTaskForm ? (
                      <BlurView intensity={85} tint="light" style={styles.addTaskForm}>
                        <Text style={styles.addTaskFormTitle}>+ NEW TASK</Text>
                        <TextInput
                          style={styles.addTaskInput}
                          value={addTaskTitle}
                          onChangeText={setAddTaskTitle}
                          placeholder="Task title"
                          placeholderTextColor="rgba(0,0,0,0.3)"
                        />
                        <TextInput
                          style={styles.addTaskInput}
                          value={addTaskLocation}
                          onChangeText={setAddTaskLocation}
                          placeholder="Location"
                          placeholderTextColor="rgba(0,0,0,0.3)"
                        />
                        <TextInput
                          style={styles.addTaskInput}
                          value={addTaskTime24}
                          onChangeText={setAddTaskTime24}
                          placeholder="Time 24h (e.g. 09:00)"
                          placeholderTextColor="rgba(0,0,0,0.3)"
                          keyboardType="numbers-and-punctuation"
                        />
                        <Text style={styles.addTaskSubLabel}>ASSIGN TO</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                          <View style={{ flexDirection: 'row', gap: 6 }}>
                            <TouchableOpacity
                              style={[styles.addTaskAssignChip, addTaskAssignTo === 'all' && styles.addTaskAssignChipActive]}
                              onPress={() => setAddTaskAssignTo('all')}
                            >
                              <Text style={[styles.addTaskAssignChipText, addTaskAssignTo === 'all' && styles.addTaskAssignChipTextActive]}>All Team</Text>
                            </TouchableOpacity>
                            {employees.map((emp) => (
                              <TouchableOpacity
                                key={emp.id}
                                style={[styles.addTaskAssignChip, addTaskAssignTo === emp.id && styles.addTaskAssignChipActive]}
                                onPress={() => setAddTaskAssignTo(emp.id)}
                              >
                                <Text style={[styles.addTaskAssignChipText, addTaskAssignTo === emp.id && styles.addTaskAssignChipTextActive]}>{emp.name}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </ScrollView>
                        <View style={styles.addSaleQtyRow}>
                          <TouchableOpacity style={styles.addSaleConfirmBtn} onPress={handleAddTask}>
                            <Text style={styles.addSaleConfirmTxt}>✓ Add Task</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.addSaleCancelBtn} onPress={() => setShowAddTaskForm(false)}>
                            <Text style={styles.addSaleCancelTxt}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      </BlurView>
                    ) : (
                      <TouchableOpacity
                        style={styles.addTaskBtn}
                        onPress={() => setShowAddTaskForm(true)}
                      >
                        <Text style={styles.addTaskBtnTxt}>+ Add Task</Text>
                      </TouchableOpacity>
                    )
                  )}

                  {/* ── Gemini AI panel (admin / leader only) ── */}
                  {(staff.role === 'admin' || staff.role === 'leader') && (
                    <BlurView intensity={98} tint="light" style={styles.aiPanel}>
                      <TouchableOpacity
                        style={styles.aiPanelHeader}
                        onPress={() => setShowAiPanel((v) => !v)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.aiPanelHeaderLeft}>
                          <Text style={styles.aiSparkle}>✦</Text>
                          <Text style={styles.aiPanelTitle}>AI ASSISTANT</Text>
                          <View style={styles.aiGeminiTag}>
                            <Text style={styles.aiGeminiTagText}>Gemini</Text>
                          </View>
                        </View>
                        <Text style={styles.aiChevron}>{showAiPanel ? '▲' : '▼'}</Text>
                      </TouchableOpacity>

                      {showAiPanel && (
                        <View style={styles.aiBody}>
                          <TextInput
                            style={styles.aiInput}
                            value={aiInput}
                            onChangeText={setAiInput}
                            placeholder="Ask for task ideas, activity suggestions, shift planning…"
                            placeholderTextColor="rgba(0,0,0,0.3)"
                            multiline
                            maxLength={400}
                          />
                          <TouchableOpacity
                            style={[styles.aiSendBtn, aiLoading && { opacity: 0.6 }]}
                            onPress={askGemini}
                            disabled={aiLoading}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.aiSendTxt}>{aiLoading ? 'Thinking…' : '✦ Ask Gemini'}</Text>
                          </TouchableOpacity>

                          {aiError && (
                            <View style={styles.aiErrorBox}>
                              <Text style={styles.aiErrorTxt}>{aiError}</Text>
                            </View>
                          )}

                          {aiResponse && (
                            <View style={styles.aiResponseBox}>
                              <Text style={styles.aiResponseLabel}>✦ GEMINI SUGGESTS</Text>
                              <Text style={styles.aiResponseText}>{aiResponse}</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </BlurView>
                  )}

                  <BlurView intensity={80} tint="light" style={styles.myShiftsCard}>
                    <TouchableOpacity
                      style={styles.myShiftsSectionHeader}
                      onPress={() => setMyShiftsExpanded((v) => !v)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.myShiftsTitle}>{t('my_shifts')}</Text>
                      <Text style={styles.myShiftsChevron}>{myShiftsExpanded ? '▲' : '▼'}</Text>
                    </TouchableOpacity>
                    {myShiftsExpanded && (
                      myShifts.length === 0 ? (
                        <Text style={styles.noShiftsText}>{t('no_shifts_yet')}</Text>
                      ) : (
                        myShifts.map((r, i) => (
                          <View key={i} style={styles.shiftRecordCard}>
                            <Text style={styles.shiftRecordDate}>
                              {new Date(r.checkedInAt).toLocaleDateString()}
                            </Text>
                            <Text style={styles.shiftRecordTimes}>
                              {new Date(r.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {' → '}
                              {r.checkedOutAt
                                ? new Date(r.checkedOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : t('still_on_duty')}
                            </Text>
                            {r.checkedOutAt && (
                              <Text style={styles.shiftDuration}>
                                {formatDuration(r.checkedInAt, new Date(r.checkedOutAt).getTime())}
                              </Text>
                            )}
                          </View>
                        ))
                      )
                    )}
                  </BlurView>
                </View>
              )}
            />
          </View>
        )}

      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 12,
    backgroundColor: Brand.navyLight,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  brandLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  logoutBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,180,216,0.35)',
  },
  logoutText: {
    color: Brand.turquoise,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
  },
  roleBadge: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '300',
    color: Brand.white,
    letterSpacing: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  rolePill: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rolePillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  progressCompact: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  checkInSlim: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
  },
  checkInSlimActive: {
    backgroundColor: 'rgba(0,196,140,0.1)',
    borderColor: 'rgba(0,196,140,0.35)',
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
    marginBottom: 16,
  },
  daySelector: {
    marginHorizontal: -24,
  },
  daySelectorContent: {
    paddingHorizontal: 20,
    gap: 6,
    flexDirection: 'row',
  },
  dayBtn: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    minWidth: 50,
  },
  dayBtnSelected: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: `${Brand.turquoise}88`,
  },
  dayBtnName: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dayBtnDate: {
    fontSize: 20,
    fontWeight: '200',
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  dayBtnTextSelected: {
    color: Brand.white,
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Brand.turquoise,
    marginTop: 5,
  },
  todayDotSelected: {
    backgroundColor: Brand.turquoise,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeaderWrap: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Brand.white,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: Brand.turquoise,
    marginTop: 8,
    borderRadius: 1,
  },
  listContainer: {
    paddingBottom: 40,
  },
  // Period headers
  periodHeader: {
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  periodHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    color: Brand.turquoise,
    letterSpacing: 4,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  periodDivider: {
    flex: 1,
    height: 1,
    backgroundColor: Brand.turquoise,
    opacity: 0.25,
  },
  // Tab switcher (admin)
  tabRow: {
    flexDirection: 'row',
    marginBottom: 8,
    marginTop: 0,
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: Brand.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.52)',
    letterSpacing: 1.5,
  },
  tabBtnTextActive: {
    color: Brand.navy,
  },
  tabPendingBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPendingBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  pendingAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8C00',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
  },
  pendingAlertIcon: { fontSize: 16 },
  pendingAlertText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  pendingAlertArrow: { fontSize: 14, color: '#fff', fontWeight: '700' },
  // Employee cards
  emptyEmpCard: {
    borderRadius: 16,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyEmpText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  empCard: {
    borderRadius: 20,
    padding: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  empCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  empName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
  },
  empRoleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  empRoleText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  empDetail: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  empJoined: {
    fontSize: 11,
    color: '#999',
    fontWeight: '400',
    marginTop: 6,
  },
  roleChangeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  roleChangeBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  roleChangeTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.35)',
    letterSpacing: 1,
  },
  // Progress bar
  progressBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    marginTop: 4,
  },
  progressBarTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 5,
    borderRadius: 3,
    backgroundColor: Brand.turquoise,
  },
  progressPct: {
    fontSize: 12,
    fontWeight: '700',
    color: Brand.turquoise,
    letterSpacing: 0.5,
    minWidth: 36,
    textAlign: 'right',
  },
  // Task cards
  taskCard: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingRight: 16,
    paddingLeft: 18,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  taskCardComplete: {
    opacity: 0.7,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskInfo: {
    flex: 1,
    paddingRight: 10,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    lineHeight: 20,
  },
  taskTitleComplete: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskMeta: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  completedAtText: {
    fontSize: 11,
    color: Brand.statusComplete.text,
    fontWeight: '600',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 86,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  // Note section
  noteSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 8,
  },
  noteHint: {
    fontSize: 12,
    color: '#aaa',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  noteHintFilled: {
    color: '#444',
  },
  noteInput: {
    fontSize: 13,
    color: '#222',
    fontWeight: '500',
    paddingVertical: 4,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  // ── Check-in banner ──────────────────────────────────────────────────────────
  checkInBanner: {
    marginBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  checkInBannerActive: {
    backgroundColor: 'rgba(0,196,140,0.12)',
    borderColor: 'rgba(0,196,140,0.4)',
  },
  checkInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkInStatusInfo: {
    flex: 1,
  },
  checkInDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkInDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C48C',
    marginRight: 7,
  },
  checkInOnDutyText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00C48C',
    letterSpacing: 1.5,
  },
  checkInSinceText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  checkInShiftText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  checkInPromptText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
    flex: 1,
    letterSpacing: 0.2,
  },
  clockInBtn: {
    backgroundColor: Brand.turquoise,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: Brand.turquoise,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  clockOutBtn: {
    backgroundColor: 'rgba(255,107,107,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  clockBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: Brand.white,
    letterSpacing: 1.2,
  },
  // ── HR tab ───────────────────────────────────────────────────────────────────
  hrStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  hrStatCard: {
    flex: 1,
    borderRadius: 18,
    padding: 18,
    overflow: 'hidden',
    borderWidth: 1,
    alignItems: 'center',
  },
  hrStatNum: {
    fontSize: 36,
    fontWeight: '200',
    marginBottom: 2,
  },
  hrStatLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#999',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  // ── Roster cards (shared by HR + Roster tab) ─────────────────────────────────
  rosterCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  rosterCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  rosterStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rosterName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  rosterOnDutyText: {
    fontSize: 12,
    color: '#00C48C',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  rosterOffDutyText: {
    fontSize: 12,
    color: '#bbb',
    fontWeight: '500',
  },
  // ── History toggle + panel (HR tab) ──────────────────────────────────────────
  historyToggleText: {
    fontSize: 10,
    fontWeight: '800',
    color: Brand.turquoise,
    letterSpacing: 0.8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: `${Brand.turquoise}44`,
  },
  historyPanel: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  historyHoursRow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#444',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  historyRecord: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 18,
  },
  // ── MY SHIFTS footer (schedule tab) ──────────────────────────────────────────
  emptyTaskCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  emptyTaskIcon: { fontSize: 36, marginBottom: 12 },
  emptyTaskTitle: { fontSize: 15, fontWeight: '700', color: Brand.navy, marginBottom: 6, textAlign: 'center' },
  emptyTaskSub:   { fontSize: 12, color: 'rgba(0,0,80,0.45)', textAlign: 'center', lineHeight: 18 },
  myShiftsFooter: {
    marginTop: 28,
    marginBottom: 16,
  },
  addTaskBtn: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,74,173,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  addTaskBtnTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: Brand.navy,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  myShiftsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  myShiftsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  myShiftsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Brand.navy,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  myShiftsChevron: {
    fontSize: 12,
    color: Brand.navy,
    fontWeight: '700',
  },
  noShiftsText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.35)',
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 12,
  },
  shiftRecordCard: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  shiftRecordDate: {
    fontSize: 10,
    fontWeight: '700',
    color: '#999',
    marginBottom: 3,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  shiftRecordTimes: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  shiftDuration: {
    fontSize: 11,
    color: Brand.turquoise,
    fontWeight: '700',
    marginTop: 5,
    letterSpacing: 0.3,
  },
  // ── Shift schedule text (header) ─────────────────────────────────────────────
  shiftScheduleText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 2,
  },
  // ── HR sub-tab (LIVE / MONTHLY / MAP / SALES toggle) ─────────────────────────
  hrSubTabRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: 12,
    padding: 4,
  },
  hrSubTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  hrSubTabActive: {
    backgroundColor: Brand.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  hrSubTabText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.48)',
    textTransform: 'uppercase',
  },
  hrSubTabTextActive: {
    color: Brand.navy,
  },
  // ── Monthly view — navigation row ────────────────────────────────────────────
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 14,
  },
  monthNavBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  monthNavArrow: {
    fontSize: 22,
    color: Brand.white,
    fontWeight: '300',
  },
  monthNavLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Brand.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // ── Monthly view — employee cards ─────────────────────────────────────────────
  monthEmpCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  monthEmpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  monthEmpStats: {
    fontSize: 11,
    color: '#777',
    fontWeight: '700',
    marginLeft: 'auto',
    letterSpacing: 0.3,
  },
  noDataMonth: {
    fontSize: 12,
    color: '#bbb',
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 10,
  },
  // ── Monthly view — day strip ──────────────────────────────────────────────────
  dayStrip: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 4,
  },
  dayCellWrap: {
    alignItems: 'center',
    width: 26,
  },
  dayCellBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    marginBottom: 4,
  },
  dayCellNum: {
    fontSize: 9,
    color: '#999',
    fontWeight: '600',
  },
  // ── Live Map view (HR MAP sub-tab) ───────────────────────────────────────────
  mapContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  mapView: {
    height: width * 0.7,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  mapEmptyCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  mapEmptyText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
    textAlign: 'center',
  },
  mapEmpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  mapEmpMeta: {
    fontSize: 11,
    color: '#00C48C',
    fontWeight: '600',
    marginLeft: 'auto',
    letterSpacing: 0.3,
  },
  // ── Sales styles ──────────────────────────────────────────────────────────────
  salesEmpCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.72)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  salesTargetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 2,
  },
  salesTargetLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.45)',
    letterSpacing: 0.5,
    flex: 1,
  },
  salesTargetInput: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    width: 72,
    textAlign: 'center',
  },
  salesProgressBar: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.07)',
    overflow: 'hidden',
    marginBottom: 8,
    marginTop: 4,
  },
  salesProgressFill: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#00C48C',
  },
  salesBreakdown: {
    gap: 4,
  },
  salesItemTargetBlock: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    paddingBottom: 8,
  },
  qtyOfTarget: {
    fontSize: 11,
    fontWeight: '700',
    color: Brand.navy,
    opacity: 0.7,
  },
  salesItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salesItemLabel: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '500',
  },
  salesItemAmt: {
    fontSize: 12,
    fontWeight: '700',
    color: Brand.navy,
  },
  addSaleBtn: {
    marginTop: 12,
    backgroundColor: `${Brand.navy}15`,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Brand.navy}30`,
  },
  addSaleBtnTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.navy,
    letterSpacing: 0.3,
  },
  addSalePanel: {
    marginTop: 12,
    gap: 6,
  },
  addSaleItemBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  addSaleItemBtnActive: {
    backgroundColor: `${Brand.navy}15`,
    borderColor: Brand.navy,
  },
  addSaleItemTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.5)',
  },
  addSaleQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  addSaleConfirmBtn: {
    backgroundColor: '#00C48C',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  addSaleConfirmTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  addSaleCancelBtn: {
    padding: 7,
  },
  addSaleCancelTxt: {
    fontSize: 15,
    color: '#FF6B6B',
    fontWeight: '700',
  },
  // My-sales card (now in FlatList ListHeaderComponent, non-admin)
  mySalesCard: {
    marginTop: 0,
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mySalesTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  mySalesTotal: {
    fontSize: 11,
    color: '#00C48C',
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'right',
  },
  noSalesText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center',
  },
  liveRosterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
    marginBottom: 4,
  },
  // ── Sales sheet headers (role grouping) ──────────────────────────────────────
  salesSheetHeader: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    marginBottom: 12,
    marginTop: 20,
  },
  salesSheetTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  // ── Commission Schedule table ─────────────────────────────────────────────────
  commSchedCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  commSchedTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  commSchedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  commSchedHeaderRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.07)',
    marginBottom: 2,
    paddingBottom: 4,
  },
  commSchedAltRow: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  commSchedCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  commSchedHeaderCell: {
    fontSize: 9,
    fontWeight: '800',
    color: '#bbb',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  commSchedItemLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  commSchedItemPrice: {
    fontSize: 10,
    fontWeight: '500',
    color: '#bbb',
  },
  commSchedEntCell: {
    color: Brand.turquoise,
    fontWeight: '800',
  },
  commSchedLeadCell: {
    color: '#00C48C',
    fontWeight: '800',
  },
  commSchedCoCell: {
    color: '#aaa',
  },
  // ── My rate chips (non-admin MY SALES header card) ────────────────────────────
  myRateRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  myRateChip: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  myRateItem: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  myRateAmt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#00C48C',
  },
  // ── Company Revenue card ──────────────────────────────────────────────────────
  companyRevCard: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  companyRevLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#999',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  companyRevAmount: {
    fontSize: 42,
    fontWeight: '200',
    color: Brand.navy,
    letterSpacing: 1,
  },
  companyRevSub: {
    fontSize: 11,
    color: '#bbb',
    fontWeight: '500',
    marginTop: 4,
  },
  companyRevDebitRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.07)',
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
  companyRevDebitText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '700',
  },
  companyRevNetText: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.navy,
    letterSpacing: 0.3,
  },
  // ── Debit sheet ───────────────────────────────────────────────────────────────
  debitRecordCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: 'rgba(255,107,107,0.25)',
    borderLeftColor: 'rgba(255,107,107,0.7)',
  },
  debitRecordRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  debitRecordAmt: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FF6B6B',
    marginBottom: 3,
  },
  debitRecordNote: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
    marginBottom: 4,
  },
  debitRecordDate: {
    fontSize: 10,
    color: '#bbb',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  debitDeleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  debitDeleteTxt: {
    fontSize: 16,
    color: 'rgba(255,107,107,0.6)',
    fontWeight: '700',
  },
  debitTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    marginBottom: 10,
  },
  debitTotalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  debitTotalAmt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FF6B6B',
  },
  // ── Guest Reviews tab ─────────────────────────────────────────────────────────
  reviewsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  reviewsSummaryCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
  },
  reviewsSummaryTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#999',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  reviewsSummaryCount: {
    fontSize: 28,
    fontWeight: '200',
    color: Brand.navy,
    letterSpacing: 1,
  },
  reviewsSummaryAvg: {
    fontSize: 16,
    color: '#FFB800',
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  reviewsEmptyCard: {
    borderRadius: 18,
    padding: 36,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  reviewsEmptyIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  reviewsEmptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#555',
    marginBottom: 6,
  },
  reviewsEmptyHint: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    fontWeight: '500',
  },
  reviewCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  reviewAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Brand.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarLetter: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  reviewGuestName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  reviewNationality: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  reviewOverallStars: {
    fontSize: 16,
    color: '#FFB800',
    letterSpacing: 1,
  },
  reviewDate: {
    fontSize: 10,
    color: '#bbb',
    fontWeight: '600',
    marginTop: 3,
  },
  reviewComment: {
    fontSize: 13,
    color: '#444',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: Brand.turquoise,
  },
  reviewAspectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  reviewAspectChip: {
    backgroundColor: 'rgba(0,74,173,0.06)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,74,173,0.12)',
  },
  reviewAspectLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
    marginBottom: 2,
  },
  reviewAspectStars: {
    fontSize: 11,
    color: '#FFB800',
    letterSpacing: 0.5,
  },
  // ── Task delete button ────────────────────────────────────────────────────────
  taskDeleteTxt: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.22)',
    fontWeight: '700',
  },
  // ── Add Task form ─────────────────────────────────────────────────────────────
  addTaskForm: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  addTaskFormTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Brand.navy,
    letterSpacing: 3,
    marginBottom: 12,
  },
  addTaskInput: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  addTaskSubLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.4)',
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  addTaskAssignChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  addTaskAssignChipActive: {
    backgroundColor: Brand.navy,
    borderColor: Brand.navy,
  },
  addTaskAssignChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.55)',
  },
  addTaskAssignChipTextActive: {
    color: Brand.white,
  },
  // ── Gemini AI panel ──────────────────────────────────────────────────────────
  aiPanel: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.75)',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  aiPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  aiPanelHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiSparkle: {
    fontSize: 14,
    color: '#6366F1',
  },
  aiPanelTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6366F1',
    letterSpacing: 3,
  },
  aiGeminiTag: {
    backgroundColor: 'rgba(99,102,241,0.12)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.25)',
  },
  aiGeminiTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6366F1',
    letterSpacing: 0.5,
  },
  aiChevron: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '700',
  },
  aiBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  aiInput: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1A1A1A',
    minHeight: 72,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.2)',
    marginBottom: 10,
  },
  aiSendBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  aiSendTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  aiErrorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  aiErrorTxt: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  aiResponseBox: {
    backgroundColor: 'rgba(99,102,241,0.06)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.2)',
  },
  aiResponseLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6366F1',
    letterSpacing: 2.5,
    marginBottom: 8,
  },
  aiResponseText: {
    fontSize: 13,
    color: '#1A1A1A',
    lineHeight: 20,
    fontWeight: '400',
  },
  // ── Pending requests ──────────────────────────────────────────────────────
  pendingSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  pendingSectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF8C00',
  },
  pendingSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF8C00',
    letterSpacing: 2,
    flex: 1,
  },
  pendingCountBadge: {
    backgroundColor: '#FF8C00',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  pendingCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  pendingCard: {
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
  },
  pendingAccentBar: {
    height: 4,
    width: '100%',
  },
  pendingCardInner: {
    padding: 16,
  },
  pendingTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pendingAvatarWrap: {
    position: 'relative',
  },
  pendingAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#FFB700',
  },
  pendingAvatarFallback: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF3DC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFB700',
  },
  pendingAvatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF8C00',
    borderWidth: 2,
    borderColor: '#fff',
  },
  pendingName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  pendingEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 1,
  },
  pendingWhatsappRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 4,
  },
  pendingWhatsappIcon: {
    fontSize: 12,
  },
  pendingWhatsapp: {
    fontSize: 12,
    color: '#25D366',
    fontWeight: '600',
  },
  pendingDate: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 5,
    fontWeight: '500',
  },
  idPhotoWrap: {
    marginTop: 14,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    overflow: 'hidden',
  },
  idPhotoHeader: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F0F0F0',
  },
  idPhotoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1.2,
  },
  idPhotoPreview: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
  },
  pendingBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  approveBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#00B874',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00B874',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  approveTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  rejectTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1,
  },

  // Broadcast panel
  broadcastBox: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#0D1B35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  broadcastHeader: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  broadcastHeaderGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  broadcastHeaderIcon: {
    fontSize: 18,
  },
  broadcastHeaderTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1.5,
  },
  broadcastChevron: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  broadcastBody: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  broadcastLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  broadcastInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  broadcastSendBtn: {
    backgroundColor: '#004AAD',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    shadowColor: '#004AAD',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  broadcastSendText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1.5,
  },
  broadcastSuccess: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  broadcastSuccessIcon: {
    fontSize: 28,
  },
  broadcastSuccessText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00C878',
  },
  broadcastResetBtn: {
    marginTop: 4,
  },
  broadcastResetText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textDecorationLine: 'underline',
  },
});
