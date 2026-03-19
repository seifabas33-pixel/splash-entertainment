import { Platform } from 'react-native';

// ─── Splash Entertainment Brand Palette ──────────────────────────────────────
export const Brand = {
  navy: '#004AAD',
  navyDark: '#003580',
  navyDeep: '#001F5B',
  navyLight: 'rgba(0, 74, 173, 0.85)',
  turquoise: '#00B4D8',
  turquoiseDark: '#0096B4',
  gold: '#C9A84C',
  goldLight: 'rgba(201,168,76,0.18)',
  goldBorder: 'rgba(201,168,76,0.35)',
  white: '#FFFFFF',
  offWhite: '#F5F2F0',
  surfaceLight: '#F5F9FF',
  overlayDark: 'rgba(0,0,0,0.4)',
  overlayLight: 'rgba(255,255,255,0.8)',
  glassCard: 'rgba(255,255,255,0.4)',
  glassBorder: 'rgba(255,255,255,0.4)',
  // Status colours
  statusPending:    { bg: 'rgba(255, 107, 107, 0.15)', text: '#D32F2F', border: 'rgba(211, 47, 47, 0.3)'  },
  statusInProgress: { bg: 'rgba(0, 180, 216, 0.15)',   text: '#004AAD', border: 'rgba(0, 74, 173, 0.3)'   },
  statusComplete:   { bg: 'rgba(0, 168, 107, 0.15)',   text: '#007E50', border: 'rgba(0, 126, 80, 0.3)'   },
};

// ─── System Theme (light / dark) ─────────────────────────────────────────────
const tintColorLight = Brand.navy;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: Brand.offWhite,
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
