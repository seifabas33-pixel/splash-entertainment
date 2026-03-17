import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { ref, set, get, remove, onValue, query, limitToFirst } from 'firebase/database';
import { auth, db } from '@/constants/firebase';
import {
  registerForPushNotifications,
  scheduleShiftReminders,
  sendPushToEmployee,
  sendPushToAll,
} from '@/utils/notifications';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = 'entertainer' | 'leader' | 'admin' | 'kids' | 'dj' | 'pr';

export type SaleItem = 'tshirt' | 'lottery' | 'disco';

export const SALE_PRODUCTS: Record<SaleItem, { label: string; price: number }> = {
  tshirt:  { label: 'Animation T-Shirt', price: 20 },
  lottery: { label: 'Lottery',           price: 5  },
  disco:   { label: 'Disco',             price: 20 },
};

export const COMMISSIONS: Record<Role, Record<SaleItem, number>> = {
  entertainer: { tshirt: 5,   lottery: 1.5, disco: 5   },
  leader:      { tshirt: 2.5, lottery: 0.5, disco: 2.5 },
  admin:       { tshirt: 0,   lottery: 0,   disco: 0   },
  kids:        { tshirt: 5,   lottery: 1.5, disco: 5   },
  dj:          { tshirt: 5,   lottery: 1.5, disco: 5   },
  pr:          { tshirt: 5,   lottery: 1.5, disco: 5   },
};

export interface SaleRecord {
  id:           string;
  employeeId:   string;
  employeeName: string;
  item:         SaleItem;
  quantity:     number;
  amount:       number;
  date:         string;
  recordedBy:   string;
}

export interface SalesTarget {
  employeeId: string;
  year:       number;
  month:      number;
  tshirt:     number;
  lottery:    number;
  disco:      number;
}

export type TaskStatus = 'Pending' | 'In-Progress' | 'Complete';
export type TaskPeriod = 'MORNING' | 'AFTERNOON' | 'EVENING';

export interface Task {
  id:          string;
  title:       string;
  time:        string;
  time24:      string;
  location:    string;
  period:      TaskPeriod;
  assignedTo:  string;
  createdBy:   string;
  date:        string;
  status:      TaskStatus;
  note:        string;
  completedAt: string | null;
}

export interface DebitRecord {
  id:         string;
  amount:     number;
  note:       string;
  date:       string;
  recordedBy: string;
}

export interface Employee {
  id:           string;   // Firebase Auth UID
  name:         string;
  role:         Role;
  status:       'pending' | 'approved';
  email:        string;
  phone:        string;
  instagram:    string;
  whatsapp:     string;
  nationality:  string;
  joinedAt:     string;
  profilePhoto: string;   // base64 image
  idPhoto:      string;   // base64 image
}

export interface CheckInRecord {
  employeeId:   string;
  employeeName: string;
  employeeRole: Role;
  checkedInAt:  string;
  checkedOutAt: string | null;
}

export type LoginResult =
  | { success: true }
  | { success: false; error: 'invalid_credentials' | 'network_error' };

export type RegisterResult =
  | { success: true }
  | { success: false; error: 'email_taken' | 'weak_password' | 'network_error' };

interface AuthContextValue {
  loading:            boolean;
  isAuthenticated:    boolean;
  isPending:          boolean;
  staff:              Employee | null;
  login:              (email: string, password: string) => Promise<LoginResult>;
  logout:             () => Promise<void>;
  register:           (name: string, email: string, password: string, whatsapp: string, profilePhoto: string, idPhoto: string) => Promise<RegisterResult>;
  employees:          Employee[];
  pendingEmployees:   Employee[];
  deleteEmployee:     (id: string) => Promise<void>;
  updateEmployeeRole: (id: string, role: Role) => Promise<void>;
  approveEmployee:    (id: string) => Promise<void>;
  rejectEmployee:     (id: string) => Promise<void>;
  checkIns:           CheckInRecord[];
  myCheckIn:          CheckInRecord | null;
  checkIn:            () => void;
  checkOut:           () => void;
  salesRecords:       SaleRecord[];
  salesTargets:       SalesTarget[];
  addSaleRecord:      (employeeId: string, item: SaleItem, quantity: number) => void;
  deleteSaleRecord:   (id: string) => void;
  setSalesTarget:     (employeeId: string, year: number, month: number, tshirt: number, lottery: number, disco: number) => void;
  debitRecords:       DebitRecord[];
  addDebitRecord:     (amount: number, note: string) => void;
  deleteDebitRecord:  (id: string) => void;
  tasks:              Task[];
  addTask:            (task: Omit<Task, 'id' | 'status' | 'note' | 'completedAt' | 'createdBy'>) => void;
  deleteTask:         (id: string) => void;
  updateTaskStatus:   (id: string, status: TaskStatus) => void;
  updateTaskNote:     (id: string, note: string) => void;
}

// ─── Storage keys (AsyncStorage) ─────────────────────────────────────────────

const CHECKINS_KEY = 'splash_checkins_v1';

// ─── Shift schedule ───────────────────────────────────────────────────────────

export const SHIFT_SCHEDULE = [
  { name: 'Morning',   startH: 9,  startM: 45, endH: 12, endM: 30 },
  { name: 'Afternoon', startH: 14, startM: 45, endH: 16, endM: 30 },
  { name: 'Evening',   startH: 20, startM: 0,  endH: 23, endM: 0  },
] as const;

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading,          setLoading]          = useState(true);
  const [staff,            setStaff]            = useState<Employee | null>(null);
  const [isAuthenticated,  setIsAuthenticated]  = useState(false);
  const [isPending,        setIsPending]        = useState(false);
  const [employees,        setEmployees]        = useState<Employee[]>([]);
  const [pendingEmployees, setPendingEmployees] = useState<Employee[]>([]);
  const [checkIns,        setCheckIns]        = useState<CheckInRecord[]>([]);
  const [salesRecords,    setSalesRecords]    = useState<SaleRecord[]>([]);
  const [salesTargets,    setSalesTargets]    = useState<SalesTarget[]>([]);
  const [debitRecords,    setDebitRecords]    = useState<DebitRecord[]>([]);
  const [tasks,           setTasks]           = useState<Task[]>([]);
  const autoTriggered = useRef<Set<string>>(new Set());

  // ── Firebase Auth session — auto-restores on app open ────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStaff(null);
        setIsAuthenticated(false);
        setIsPending(false);
        setLoading(false);
        return;
      }
      const snap = await get(ref(db, `employees/${user.uid}`));
      if (snap.exists()) {
        const emp = snap.val() as Employee;
        // Admins and accounts without a status field are always approved
        if (!emp.status || emp.role === 'admin') {
          emp.status = 'approved';
          // Write it back to Firebase so it's persistent
          set(ref(db, `employees/${user.uid}/status`), 'approved').catch(() => {});
        }
        setStaff(emp);
        if (emp.status === 'approved') {
          setIsAuthenticated(true);
          setIsPending(false);
          // Register for push notifications + schedule today's shift reminders
          registerForPushNotifications(emp.id).catch(() => {});
          scheduleShiftReminders(SHIFT_SCHEDULE).catch(() => {});
        } else {
          setIsAuthenticated(false);
          setIsPending(true);
        }
      } else {
        setStaff(null);
        setIsAuthenticated(false);
        setIsPending(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ── Real-time status listener — auto-approves pending users ───────────────
  useEffect(() => {
    if (!staff?.id || !isPending) return;
    const unsub = onValue(ref(db, `employees/${staff.id}/status`), (snap) => {
      if (snap.val() === 'approved') {
        get(ref(db, `employees/${staff.id}`)).then((empSnap) => {
          if (empSnap.exists()) {
            const emp = empSnap.val() as Employee;
            setStaff(emp);
            setIsAuthenticated(true);
            setIsPending(false);
            registerForPushNotifications(emp.id).catch(() => {});
            scheduleShiftReminders(SHIFT_SCHEDULE).catch(() => {});
          }
        });
      }
    });
    return () => unsub();
  }, [staff?.id, isPending]);

  // ── Employees list — live from Firebase DB ────────────────────────────────
  useEffect(() => {
    const empRef = ref(db, 'employees');
    const unsub = onValue(empRef, (snap) => {
      if (!snap.exists()) { setEmployees([]); setPendingEmployees([]); return; }
      // Strip base64 photos from approved employees — not needed for the roster list.
      // Pending employees keep their photos so admin can review them.
      const all = Object.values(snap.val() as Record<string, Employee>).map((e) => {
        if (e.status === 'pending') return e;
        return { ...e, profilePhoto: '', idPhoto: '' };
      });
      setEmployees(all.filter((e) => !e.status || e.status === 'approved'));
      setPendingEmployees(all.filter((e) => e.status === 'pending'));
    });
    return () => unsub();
  }, []);

  // ── AsyncStorage — load & persist check-ins ───────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(CHECKINS_KEY).then((raw) => {
      if (raw) try { setCheckIns(JSON.parse(raw)); } catch { /* ignore */ }
    });
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify(checkIns)).catch(() => {});
  }, [checkIns]);

  // ── Firebase — real-time sales (shared across all devices) ──────────────
  useEffect(() => {
    const unsub = onValue(ref(db, 'sales'), (snap) => {
      if (!snap.exists()) { setSalesRecords([]); return; }
      setSalesRecords(Object.values(snap.val() as Record<string, SaleRecord>));
    });
    return () => unsub();
  }, []);

  // ── Firebase — real-time targets (shared across all devices) ─────────────
  useEffect(() => {
    const unsub = onValue(ref(db, 'targets'), (snap) => {
      if (!snap.exists()) { setSalesTargets([]); return; }
      setSalesTargets(Object.values(snap.val() as Record<string, SalesTarget>));
    });
    return () => unsub();
  }, []);

  // ── Firebase — real-time debits (shared across all devices) ──────────────
  useEffect(() => {
    const unsub = onValue(ref(db, 'debits'), (snap) => {
      if (!snap.exists()) { setDebitRecords([]); return; }
      setDebitRecords(Object.values(snap.val() as Record<string, DebitRecord>));
    });
    return () => unsub();
  }, []);

  // ── Firebase — real-time tasks (shared across all devices) ───────────────
  useEffect(() => {
    const unsub = onValue(ref(db, 'tasks'), (snap) => {
      if (!snap.exists()) { setTasks([]); return; }
      setTasks(Object.values(snap.val() as Record<string, Task>));
    });
    return () => unsub();
  }, []);

  // ── Auto check-in/out at scheduled shift times ────────────────────────────
  useEffect(() => {
    if (!staff) return;
    const trigger = () => {
      const now = new Date();
      const totalMins = now.getHours() * 60 + now.getMinutes();
      const dateStr = now.toDateString();
      SHIFT_SCHEDULE.forEach((shift, idx) => {
        const startMins = shift.startH * 60 + shift.startM;
        const endMins   = shift.endH   * 60 + shift.endM;
        const inKey  = `${staff.id}-${dateStr}-${idx}-in`;
        const outKey = `${staff.id}-${dateStr}-${idx}-out`;
        if (!autoTriggered.current.has(inKey) && totalMins >= startMins && totalMins <= startMins + 2) {
          autoTriggered.current.add(inKey);
          const inTime = new Date(now);
          inTime.setHours(shift.startH, shift.startM, 0, 0);
          setCheckIns((prev) => {
            const closed = prev.map((r) =>
              r.employeeId === staff.id && r.checkedOutAt === null
                ? { ...r, checkedOutAt: inTime.toISOString() } : r);
            return [...closed, {
              employeeId:   staff.id,
              employeeName: staff.name,
              employeeRole: staff.role,
              checkedInAt:  inTime.toISOString(),
              checkedOutAt: null,
            }];
          });
        }
        if (!autoTriggered.current.has(outKey) && totalMins >= endMins && totalMins <= endMins + 2) {
          autoTriggered.current.add(outKey);
          const outTime = new Date(now);
          outTime.setHours(shift.endH, shift.endM, 0, 0);
          setCheckIns((prev) =>
            prev.map((r) =>
              r.employeeId === staff.id && r.checkedOutAt === null
                ? { ...r, checkedOutAt: outTime.toISOString() } : r));
        }
      });
    };
    trigger();
    const id = setInterval(trigger, 30_000);
    return () => clearInterval(id);
  }, [staff]);

  // ── Live GPS location — writes to Firebase while on duty ──────────────────
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const isOnDuty = !!staff && checkIns.some(
      (r) => r.employeeId === staff.id && r.checkedOutAt === null,
    );
    if (!isOnDuty || !staff) {
      if (staff) remove(ref(db, `locations/${staff.id}`)).catch(() => {});
      return;
    }
    let watchSub: Location.LocationSubscription | null = null;
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') return;
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 30_000, distanceInterval: 20 },
        ({ coords }) => {
          set(ref(db, `locations/${staff.id}`), {
            lat:       coords.latitude,
            lng:       coords.longitude,
            name:      staff.name,
            role:      staff.role,
            updatedAt: Date.now(),
          }).catch(() => {});
        },
      ).then((sub) => { watchSub = sub; });
    });
    return () => {
      watchSub?.remove();
      remove(ref(db, `locations/${staff.id}`)).catch(() => {});
    };
  }, [staff, checkIns]);

  // ── Auth callbacks ────────────────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code ?? '';
      if (code.includes('invalid') || code.includes('user-not-found') || code.includes('wrong-password')) {
        return { success: false, error: 'invalid_credentials' };
      }
      return { success: false, error: 'network_error' };
    }
  }, []);

  const logout = useCallback(async () => {
    if (staff) remove(ref(db, `locations/${staff.id}`)).catch(() => {});
    await firebaseSignOut(auth);
    setStaff(null);
    setIsAuthenticated(false);
    setIsPending(false);
  }, [staff]);

  const register = useCallback(async (
    name: string, email: string, password: string,
    whatsapp: string, profilePhoto: string, idPhoto: string,
  ): Promise<RegisterResult> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Check if any employee exists — fetch only 1 record to avoid large downloads
      const snap = await get(query(ref(db, 'employees'), limitToFirst(1)));
      const isEmpty = !snap.exists();
      const employee: Employee = {
        id:           cred.user.uid,
        name:         name.trim(),
        role:         isEmpty ? 'admin' : 'entertainer',
        status:       isEmpty ? 'approved' : 'pending',
        email:        email.trim().toLowerCase(),
        phone:        '',
        instagram:    '',
        whatsapp:     whatsapp.trim(),
        nationality:  '',
        joinedAt:     new Date().toISOString(),
        profilePhoto: profilePhoto,
        idPhoto:      idPhoto,
      };
      await set(ref(db, `employees/${cred.user.uid}`), employee);
      // onAuthStateChanged fires before the DB write completes, so we fix
      // the state here to guarantee the correct pending/approved screen shows.
      setStaff(employee);
      if (employee.status === 'approved') {
        setIsAuthenticated(true);
        setIsPending(false);
        registerForPushNotifications(employee.id).catch(() => {});
        scheduleShiftReminders(SHIFT_SCHEDULE).catch(() => {});
      } else {
        setIsAuthenticated(false);
        setIsPending(true);
      }
      // Notify admin(s) about the new pending request
      if (!isEmpty) {
        sendPushToAll(
          '🔔 New Staff Request',
          `${name.trim()} wants to join the team. Open the Employees tab to approve.`,
        ).catch(() => {});
      }
      return { success: true };
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code ?? '';
      if (code === 'auth/email-already-in-use') return { success: false, error: 'email_taken' };
      if (code === 'auth/weak-password')        return { success: false, error: 'weak_password' };
      return { success: false, error: 'network_error' };
    }
  }, [setStaff, setIsAuthenticated, setIsPending]);

  const deleteEmployee = useCallback(async (id: string) => {
    await remove(ref(db, `employees/${id}`)).catch(() => {});
  }, []);

  const updateEmployeeRole = useCallback(async (id: string, role: Role) => {
    await set(ref(db, `employees/${id}/role`), role).catch(() => {});
    setStaff((prev) => prev && prev.id === id ? { ...prev, role } : prev);
  }, []);

  const approveEmployee = useCallback(async (id: string) => {
    await set(ref(db, `employees/${id}/status`), 'approved').catch(() => {});
    // Notify the employee their account was approved
    sendPushToEmployee(
      id,
      '🎉 Account Approved!',
      'Welcome to Splash Entertainment! You can now sign in to the app.',
    ).catch(() => {});
  }, []);

  const rejectEmployee = useCallback(async (id: string) => {
    await remove(ref(db, `employees/${id}`)).catch(() => {});
  }, []);

  // ── Check-in callbacks ────────────────────────────────────────────────────

  const checkIn = useCallback(() => {
    if (!staff) return;
    setCheckIns((prev) => {
      const closed = prev.map((r) =>
        r.employeeId === staff.id && r.checkedOutAt === null
          ? { ...r, checkedOutAt: new Date().toISOString() } : r,
      );
      return [...closed, {
        employeeId:   staff.id,
        employeeName: staff.name,
        employeeRole: staff.role,
        checkedInAt:  new Date().toISOString(),
        checkedOutAt: null,
      }];
    });
  }, [staff]);

  const checkOut = useCallback(() => {
    if (!staff) return;
    setCheckIns((prev) =>
      prev.map((r) =>
        r.employeeId === staff.id && r.checkedOutAt === null
          ? { ...r, checkedOutAt: new Date().toISOString() } : r,
      ),
    );
  }, [staff]);

  // ── Sales callbacks ───────────────────────────────────────────────────────

  const addSaleRecord = useCallback((employeeId: string, item: SaleItem, quantity: number) => {
    if (!staff) return;
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;
    const id = `sale-${Date.now()}`;
    const record: SaleRecord = {
      id,
      employeeId,
      employeeName: emp.name,
      item,
      quantity,
      amount:       quantity * SALE_PRODUCTS[item].price,
      date:         new Date().toISOString(),
      recordedBy:   staff.id,
    };
    set(ref(db, `sales/${id}`), record).catch(() => {});
  }, [staff, employees]);

  const deleteSaleRecord = useCallback((id: string) => {
    remove(ref(db, `sales/${id}`)).catch(() => {});
  }, []);

  const setSalesTarget = useCallback((employeeId: string, year: number, month: number, tshirt: number, lottery: number, disco: number) => {
    const key = `${employeeId}-${year}-${month}`;
    set(ref(db, `targets/${key}`), { employeeId, year, month, tshirt, lottery, disco }).catch(() => {});
  }, []);

  // ── Debit callbacks ───────────────────────────────────────────────────────

  const addDebitRecord = useCallback((amount: number, note: string) => {
    if (!staff) return;
    const id = `debit-${Date.now()}`;
    set(ref(db, `debits/${id}`), {
      id,
      amount,
      note,
      date:       new Date().toISOString(),
      recordedBy: staff.id,
    }).catch(() => {});
  }, [staff]);

  const deleteDebitRecord = useCallback((id: string) => {
    remove(ref(db, `debits/${id}`)).catch(() => {});
  }, []);

  // ── Task callbacks ────────────────────────────────────────────────────────

  const addTask = useCallback((task: Omit<Task, 'id' | 'status' | 'note' | 'completedAt' | 'createdBy'>): void => {
    if (!staff) return;
    const id = `task-${Date.now()}`;
    const fullTask: Task = {
      ...task,
      id,
      createdBy:   staff.id,
      status:      'Pending',
      note:        '',
      completedAt: null,
    };
    set(ref(db, `tasks/${id}`), fullTask).catch(() => {});
  }, [staff]);

  const deleteTask = useCallback((id: string) => {
    remove(ref(db, `tasks/${id}`)).catch(() => {});
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    const completedAt = status === 'Complete'
      ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : null;
    set(ref(db, `tasks/${id}/status`), status).catch(() => {});
    set(ref(db, `tasks/${id}/completedAt`), completedAt).catch(() => {});
  }, []);

  const updateTaskNote = useCallback((id: string, note: string) => {
    set(ref(db, `tasks/${id}/note`), note).catch(() => {});
  }, []);

  const myCheckIn = staff
    ? checkIns.find((r) => r.employeeId === staff.id && r.checkedOutAt === null) ?? null
    : null;

  return (
    <AuthContext.Provider value={{
      loading, isAuthenticated, isPending, staff,
      login, logout, register,
      employees, pendingEmployees, deleteEmployee, updateEmployeeRole,
      approveEmployee, rejectEmployee,
      checkIns, myCheckIn, checkIn, checkOut,
      salesRecords, salesTargets, addSaleRecord, deleteSaleRecord, setSalesTarget,
      debitRecords, addDebitRecord, deleteDebitRecord,
      tasks, addTask, deleteTask, updateTaskStatus, updateTaskNote,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
