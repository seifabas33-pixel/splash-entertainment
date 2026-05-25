import React from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Brand } from '@/constants/theme';
import { useNow } from '@/hooks/useNow';
import {
  Bar,
  BARS,
  isRestaurantOpenNow,
  isVenueOpenNow,
  Restaurant,
  RESTAURANTS,
} from '@/data/dining';
import { useLanguage } from '@/context/LanguageContext';

const { width } = Dimensions.get('window');
const BG_IMAGE = require('@/assets/images/resort_lobby.webp');

type Tab = 'restaurants' | 'bars';

// Accent colour per cuisine/type
const CUISINE_ACCENT: Record<string, [string, string]> = {
  International: ['#0096C7', '#00B4D8'],
  Seafood:       ['#0077B6', '#023E8A'],
  Italian:       ['#C1121F', '#E63946'],
  Arabian:       ['#D4882B', '#F4A261'],
  Oriental:      ['#BC4749', '#E76F51'],
};
function accentFor(cuisine: string): [string, string] {
  const key = Object.keys(CUISINE_ACCENT).find(k => cuisine.includes(k));
  return key ? CUISINE_ACCENT[key] : ['#1B4079', '#2563EB'];
}

// Meal period gradient colours
const PERIOD_COLOR: Record<string, string> = {
  Breakfast: '#F4A261',
  Lunch:     '#2EC4B6',
  Dinner:    '#7B2D8B',
  'All Day': '#0096C7',
};

export default function DiningScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<Tab>('restaurants');
  const now = useNow();
  const { t } = useLanguage();

  const openCount = activeTab === 'restaurants'
    ? RESTAURANTS.filter(r => isRestaurantOpenNow(r, now)).length
    : BARS.filter(b => isVenueOpenNow(b.openTime, b.closeTime, now)).length;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <ImageBackground source={BG_IMAGE} style={styles.hero} resizeMode="cover">
          <LinearGradient
            colors={['rgba(6,16,31,0.35)', 'rgba(6,16,31,0.92)']}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>
          <View style={styles.heroBottom}>
            <Text style={styles.heroEyebrow}>HILTON MARSA ALAM</Text>
            <Text style={styles.heroTitle}>{t('dining_bars')}</Text>
            <View style={styles.heroRule} />
            <View style={styles.heroMeta}>
              <View style={styles.heroMetaItem}>
                <Text style={styles.heroMetaNum}>{RESTAURANTS.length}</Text>
                <Text style={styles.heroMetaLabel}>Restaurants</Text>
              </View>
              <View style={styles.heroMetaDivider} />
              <View style={styles.heroMetaItem}>
                <Text style={styles.heroMetaNum}>{BARS.length}</Text>
                <Text style={styles.heroMetaLabel}>Bars & Lounges</Text>
              </View>
              {openCount > 0 && (
                <>
                  <View style={styles.heroMetaDivider} />
                  <View style={styles.heroOpenNow}>
                    <View style={styles.heroGreenDot} />
                    <Text style={styles.heroOpenText}>{openCount} Open Now</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </ImageBackground>

        {/* ── Tab switcher ── */}
        <View style={styles.tabWrapper}>
          {(['restaurants', 'bars'] as Tab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabBtn}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.85}
            >
              {activeTab === tab ? (
                <LinearGradient
                  colors={['#0096C7', '#0077B6']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.tabBtnInner}
                >
                  <Text style={styles.tabTextActive}>
                    {tab === 'restaurants' ? t('restaurants_tab') : t('bars_tab')}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabBtnInner}>
                  <Text style={styles.tabText}>
                    {tab === 'restaurants' ? t('restaurants_tab') : t('bars_tab')}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Cards ── */}
        <View style={styles.cards}>
          {activeTab === 'restaurants'
            ? RESTAURANTS.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} now={now} t={t} />
              ))
            : BARS.map((b) => (
                <BarCard key={b.id} bar={b} now={now} t={t} />
              ))
          }
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Restaurant card ──────────────────────────────────────────────────────────

function RestaurantCard({ restaurant: r, now, t }: { restaurant: Restaurant; now: Date; t: (k: string) => string }) {
  const open = isRestaurantOpenNow(r, now);
  const [c1, c2] = accentFor(r.cuisine);

  return (
    <View style={styles.card}>
      {/* Gradient header */}
      <LinearGradient colors={[c1, c2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardGradientHeader}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>{r.icon}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.cardName}>{r.name}</Text>
            <Text style={styles.cardSubtitle}>{r.type} · {r.cuisine}</Text>
          </View>
          {open ? (
            <View style={styles.openPill}>
              <View style={styles.greenDot} />
              <Text style={styles.openPillText}>OPEN</Text>
            </View>
          ) : (
            <View style={styles.closedPill}>
              <Text style={styles.closedPillText}>CLOSED</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Body */}
      <View style={styles.cardBody}>
        <Text style={styles.cardDesc}>{r.description}</Text>

        {/* Location */}
        <View style={styles.locationRow}>
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.locationText}>{r.location}</Text>
        </View>

        {/* Hours */}
        <View style={styles.periodsRow}>
          {r.periods.map((p) => (
            <View key={p.label} style={[styles.periodPill, { borderColor: PERIOD_COLOR[p.label] ?? '#555' }]}>
              <Text style={[styles.periodPillLabel, { color: PERIOD_COLOR[p.label] ?? '#aaa' }]}>{p.label.toUpperCase()}</Text>
              <Text style={styles.periodPillTime}>{p.open} – {p.close}</Text>
            </View>
          ))}
        </View>

        {/* Reservation */}
        {r.reservationRequired && (
          <View style={styles.reservationBox}>
            <Text style={styles.reservationIcon}>📅</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.reservationTitle}>{t('reservation_required')}</Text>
              {r.reservationNote && <Text style={styles.reservationNote}>{r.reservationNote}</Text>}
            </View>
          </View>
        )}

        {/* Footer badges */}
        <View style={styles.footerRow}>
          {r.allInclusive && (
            <View style={styles.alBadge}>
              <Text style={styles.alText}>{t('all_inclusive')}</Text>
            </View>
          )}
          {r.dresscode && (
            <View style={styles.dresscodeBadge}>
              <Text style={styles.dresscodeText}>👔 {r.dresscode}</Text>
            </View>
          )}
        </View>

        {r.specialNote && <Text style={styles.specialNote}>{r.specialNote}</Text>}
      </View>
    </View>
  );
}

// ─── Bar card ─────────────────────────────────────────────────────────────────

function BarCard({ bar: b, now, t }: { bar: Bar; now: Date; t: (k: string) => string }) {
  const open = isVenueOpenNow(b.openTime, b.closeTime, now);

  return (
    <View style={styles.card}>
      {/* Gradient header — purple/navy vibe for bars */}
      <LinearGradient colors={['#1B1464', '#2C3E7A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardGradientHeader}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Text style={styles.iconText}>{b.icon}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.cardName}>{b.name}</Text>
            <Text style={styles.cardSubtitle}>📍 {b.location}</Text>
          </View>
          {open ? (
            <View style={styles.openPill}>
              <View style={styles.greenDot} />
              <Text style={styles.openPillText}>OPEN</Text>
            </View>
          ) : (
            <View style={styles.closedPill}>
              <Text style={styles.closedPillText}>CLOSED</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Body */}
      <View style={styles.cardBody}>
        <Text style={styles.cardDesc}>{b.description}</Text>

        {/* Highlights */}
        <View style={styles.highlightsRow}>
          {b.highlights.map((h) => (
            <View key={h} style={styles.highlightChip}>
              <Text style={styles.highlightText}>{h}</Text>
            </View>
          ))}
        </View>

        {/* Hours row */}
        <View style={styles.hoursRow}>
          <Text style={styles.hoursIcon}>🕐</Text>
          <Text style={styles.hoursText}>{b.openTime} – {b.closeTime}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#06101F',
  },
  scroll: {
    paddingBottom: 48,
  },

  // Hero
  hero: {
    width: '100%',
    height: 280,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  backBtn: {},
  backText: {
    fontSize: 13,
    color: Brand.white,
    fontWeight: '700',
    letterSpacing: 2,
  },
  heroBottom: {},
  heroEyebrow: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 4,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 32,
    color: Brand.white,
    fontWeight: '200',
    letterSpacing: 2,
  },
  heroRule: {
    width: 36,
    height: 2,
    backgroundColor: '#00B4D8',
    marginVertical: 12,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroMetaItem: {
    alignItems: 'center',
  },
  heroMetaNum: {
    fontSize: 20,
    fontWeight: '700',
    color: Brand.white,
    lineHeight: 22,
  },
  heroMetaLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  heroMetaDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroOpenNow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,200,120,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,200,120,0.35)',
    gap: 5,
  },
  heroGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00C878',
  },
  heroOpenText: {
    fontSize: 11,
    color: '#00C878',
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Tabs
  tabWrapper: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
    backgroundColor: '#0D1B35',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  tabBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabBtnInner: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.white,
    letterSpacing: 0.5,
  },

  // Cards
  cards: {
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
    backgroundColor: '#0D1B35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },

  // Card gradient header
  cardGradientHeader: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 26,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    fontWeight: '500',
  },
  openPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,200,120,0.2)',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,200,120,0.4)',
    gap: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C878',
  },
  openPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00C878',
    letterSpacing: 1,
  },
  closedPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  closedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },

  // Card body
  cardBody: {
    padding: 18,
  },
  cardDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 20,
    marginBottom: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 5,
  },
  locationPin: {
    fontSize: 13,
  },
  locationText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },

  // Period pills
  periodsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  periodPill: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  periodPillLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  periodPillTime: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
    marginTop: 2,
  },

  // Reservation
  reservationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,150,199,0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,150,199,0.25)',
    gap: 8,
  },
  reservationIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  reservationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00B4D8',
  },
  reservationNote: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 3,
    lineHeight: 16,
  },

  // Footer badges
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  alBadge: {
    backgroundColor: 'rgba(0,180,216,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,180,216,0.3)',
  },
  alText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00B4D8',
    letterSpacing: 0.5,
  },
  dresscodeBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dresscodeText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  specialNote: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    fontStyle: 'italic',
    marginTop: 8,
  },

  // Bar highlights
  highlightsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  highlightChip: {
    backgroundColor: 'rgba(0,119,182,0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,119,182,0.35)',
  },
  highlightText: {
    fontSize: 11,
    color: '#48CAE4',
    fontWeight: '600',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hoursIcon: {
    fontSize: 14,
  },
  hoursText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '600',
  },
});
