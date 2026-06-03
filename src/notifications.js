// ── Festival dates ────────────────────────────────────────────────────────
// Act `start` = minuten na 10:00 op die dag  (bijv. start=120 → 12:00)
const FESTIVAL_BASE = { sat: '2026-09-05', sun: '2026-09-06' };

function actStartDate(day, startMins) {
  const totalMins = 10 * 60 + startMins;
  const h = String(Math.floor(totalMins / 60)).padStart(2, '0');
  const m = String(totalMins % 60).padStart(2, '0');
  return new Date(`${FESTIVAL_BASE[day]}T${h}:${m}:00`);
}

// ── Notification text per offset ──────────────────────────────────────────
const OFFSET_MSGS = {
  15: { nl: 'Begint over 15 minuten', en: 'Starts in 15 minutes' },
  10: { nl: 'Begint over 10 minuten', en: 'Starts in 10 minutes' },
  5:  { nl: 'Begint over 5 minuten',  en: 'Starts in 5 minutes'  },
};

// ── Active timeout handles so we can cancel them ─────────────────────────
const activeTimeouts = new Map();

export function cancelAllNotifications() {
  for (const id of activeTimeouts.values()) clearTimeout(id);
  activeTimeouts.clear();
}

// ── Post a SHOW_NOTIFICATION message to the service worker ────────────────
async function postToSW(msg) {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage(msg);
  } catch (_) { /* SW not yet ready – ignore */ }
}

// ── Request notification permission ──────────────────────────────────────
// Returns: 'granted' | 'denied' | 'default' | 'unsupported'
export async function requestPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  return Notification.requestPermission();
}

// ── Schedule notifications for all favourite acts ─────────────────────────
// favItems = array of { day, start, act, stage: { id, name } }
// lang = 'nl' | 'en'
export function scheduleNotificationsForFavs(favItems, lang = 'nl') {
  cancelAllNotifications();
  if (Notification.permission !== 'granted') return;

  const now = Date.now();

  for (const { day, start: startMins, act, stage } of favItems) {
    const startDate = actStartDate(day, startMins);

    for (const mins of [15, 5]) {
      const fireAt = startDate.getTime() - mins * 60_000;
      const delay  = fireAt - now;
      if (delay <= 0) continue; // moment al voorbij

      const tag  = `${day}-${stage?.id}-${startMins}-${act}-${mins}`;
      const body = `${OFFSET_MSGS[mins][lang]} · ${stage?.name ?? ''}`;

      const id = setTimeout(() => {
        postToSW({ type: 'SHOW_NOTIFICATION', title: act, body, tag });
      }, delay);

      activeTimeouts.set(tag, id);
    }
  }
}
