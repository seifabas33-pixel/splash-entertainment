import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { ref, set, get } from 'firebase/database';
import { db } from '@/constants/firebase';

const PROJECT_ID = 'fc9bc8a6-b89a-4f1f-a1a0-08d8669ec86a';

// Show notifications even when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ── Register device & save token to Firebase ──────────────────────────────────

export async function registerForPushNotifications(employeeId: string): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  const { status } = existing !== 'granted'
    ? await Notifications.requestPermissionsAsync()
    : { status: existing };

  if (status !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Splash Entertainment',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#004AAD',
    });
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID });
  const token = tokenData.data;

  await set(ref(db, `push_tokens/${employeeId}`), token).catch(() => {});
  return token;
}

// ── Send a push via Expo Push API (no server needed) ─────────────────────────

async function sendPush(token: string, title: string, body: string) {
  await fetch('https://exp.host/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
    },
    body: JSON.stringify({ to: token, title, body, sound: 'default' }),
  }).catch(() => {});
}

// Send to one employee by their Firebase id
export async function sendPushToEmployee(employeeId: string, title: string, body: string) {
  const snap = await get(ref(db, `push_tokens/${employeeId}`)).catch(() => null);
  if (!snap?.exists()) return;
  await sendPush(snap.val() as string, title, body);
}

// Send to every employee (admin broadcast)
export async function sendPushToAll(title: string, body: string) {
  const snap = await get(ref(db, 'push_tokens')).catch(() => null);
  if (!snap?.exists()) return;
  const tokens = Object.values(snap.val() as Record<string, string>);
  await Promise.all(tokens.map((t) => sendPush(t, title, body)));
}

// ── Schedule local shift-reminder notifications ───────────────────────────────

export async function scheduleShiftReminders(
  shifts: ReadonlyArray<{ name: string; startH: number; startM: number }>,
) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = new Date();
  for (const shift of shifts) {
    const reminderTime = new Date(now);
    reminderTime.setHours(shift.startH, shift.startM - 15, 0, 0);
    if (reminderTime > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Shift Starting Soon',
          body: `Your ${shift.name} shift starts in 15 minutes (${String(shift.startH).padStart(2, '0')}:${String(shift.startM).padStart(2, '0')})`,
          sound: true,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminderTime },
      }).catch(() => {});
    }
  }
}
