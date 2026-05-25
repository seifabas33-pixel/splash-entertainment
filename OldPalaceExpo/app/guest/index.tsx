import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
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
import { RESORT } from '@/constants/config';
import {
  getActivitiesForDate,
  getHappeningNow,
  getTonightsShow,
} from '@/data/activities';
import {
  BARS,
  isRestaurantOpenNow,
  isVenueOpenNow,
  RESTAURANTS,
} from '@/data/dining';
import { useNow } from '@/hooks/useNow';
import { useLanguage } from '@/context/LanguageContext';

const { width } = Dimensions.get('window');
const IMG_BEACH = require('@/assets/images/resort_beach.webp');

// Cards: big enough to be readable on any screen
const CARD_W = Math.min(width * 0.72, 300);
const CARD_H = 290;

// ─── Helpers ──────────────────────────────────────────────────────────────────

type GreetingKey = 'good_morning' | 'good_afternoon' | 'good_evening';
function getGreetingKey(h: number): GreetingKey {
  if (h < 12) return 'good_morning';
  if (h < 18) return 'good_afternoon';
  return 'good_evening';
}

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── Fade + slide hook ────────────────────────────────────────────────────────

function useFadeSlide(delay: number) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { opacity, transform: [{ translateY }] };
}

// ─── Service cards data ───────────────────────────────────────────────────────

const SERVICE_CARD_DEFS = [
  { id: 'activities', labelKey: 'card_activities', emoji: '🎯', route: '/guest/activities', colors: ['#0EA5E9', '#0369A1'] as [string, string] },
  { id: 'dining',     labelKey: 'card_dining',     emoji: '🍽️', route: '/guest/dining',     colors: ['#F59E0B', '#B45309'] as [string, string] },
  { id: 'map',        labelKey: 'card_map',         emoji: '🗺️', route: '/guest/map',         colors: ['#3B82F6', '#1D4ED8'] as [string, string] },
  { id: 'room',       labelKey: 'card_room',        emoji: '🔑', route: '/guest/room',        colors: ['#8B5CF6', '#5B21B6'] as [string, string] },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function GuestDashboard() {
  const router = useRouter();
  const now    = useNow();
  const { t }  = useLanguage();

  const todayActivities = useMemo(() => getActivitiesForDate(now), [now]);
  const happeningNow    = useMemo(() => getHappeningNow(todayActivities, now), [todayActivities, now]);
  const tonightsShow    = useMemo(() => getTonightsShow(now), [now]);
  const openVenues      = useMemo(
    () =>
      RESTAURANTS.filter(r => isRestaurantOpenNow(r, now)).length +
      BARS.filter(b => isVenueOpenNow(b.openTime, b.closeTime, now)).length,
    [now],
  );

  const timeStr  = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr  = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}`;
  const greeting = t(getGreetingKey(now.getHours()));
  const isNow    = happeningNow !== null;

  const a0 = useFadeSlide(0);
  const a1 = useFadeSlide(140);
  const a2 = useFadeSlide(260);
  const a3 = useFadeSlide(370);

  // Extra info per card (localized)
  const cardSubs: Record<string, string> = {
    activities: `${todayActivities.length} ${t('activities_today')}`,
    dining:     openVenues > 0 ? t('n_open_now', { n: String(openVenues) }) : t('card_dining_desc'),
    map:        `6 zones · ${RESORT.poolCount} ${t('pools_section').toLowerCase()}`,
    room:       t('card_room_desc'),
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── HERO ── */}
        <Animated.View style={a0}>
          <ImageBackground source={IMG_BEACH} style={styles.hero} resizeMode="cover">
            <LinearGradient
              colors={['rgba(0,0,0,0.62)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.55)']}
              locations={[0, 0.45, 1]}
              style={StyleSheet.absoluteFill}
            />

            {/* Top bar */}
            <View style={styles.heroTop}>
              <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/')}>
                <Text style={styles.backTxt}>{t('back_home')}</Text>
              </TouchableOpacity>
              <View style={styles.timePill}>
                <Text style={styles.timeTxt}>{timeStr}</Text>
              </View>
            </View>

            {/* Bottom text */}
            <View style={styles.heroBottom}>
              <Text style={styles.greetingTxt}>{greeting}</Text>
              <Text style={styles.resortTxt}>{RESORT.shortName}</Text>
              <View style={styles.heroDivider} />
              <View style={styles.metaRow}>
                <Text style={styles.metaTxt}>☀️  28°C</Text>
                <View style={styles.metaDot} />
                <Text style={styles.metaTxt}>{dateStr}</Text>
              </View>
            </View>
          </ImageBackground>
        </Animated.View>

        {/* ── LIGHT CONTENT ── */}
        <View style={styles.lightBg}>

          {/* Tonight / Happening Now */}
          <Animated.View style={a1}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/guest/activities')}
            >
              <View style={styles.nowCard}>
                {/* Left accent bar */}
                <View style={[styles.nowAccent, { backgroundColor: isNow ? Brand.turquoise : Brand.navy }]} />

                <View style={styles.nowBody}>
                  <View style={[styles.nowBadge, { backgroundColor: isNow ? Brand.turquoise : Brand.navy }]}>
                    <Text style={styles.nowBadgeTxt}>
                      {isNow ? `● ${t('happening_now_badge')}` : `🌙  ${t('tonight')}`}
                    </Text>
                  </View>
                  <Text style={styles.nowTitle} numberOfLines={1}>
                    {isNow ? happeningNow!.title : tonightsShow.title}
                  </Text>
                  <Text style={styles.nowMeta}>
                    📍 {isNow ? happeningNow!.location : tonightsShow.venue}
                    {'   ·   '}
                    {isNow ? happeningNow!.displayTime : tonightsShow.startTime}
                  </Text>
                </View>

                <Text style={styles.nowEmoji}>
                  {isNow ? happeningNow!.icon : '🎭'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Section header */}
          <Animated.View style={a2}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('guest_services')}</Text>
              <Text style={styles.sectionHint}>{t('swipe_explore')}</Text>
            </View>
          </Animated.View>

          {/* Horizontal scroll cards */}
          <Animated.View style={a2}>
            <View style={styles.hScrollWrap}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hScroll}
                decelerationRate="fast"
                snapToInterval={CARD_W + 14}
                snapToAlignment="start"
              >
                {SERVICE_CARD_DEFS.map((card) => (
                  <TouchableOpacity
                    key={card.id}
                    activeOpacity={0.85}
                    onPress={() => router.push(card.route as any)}
                  >
                    <LinearGradient
                      colors={card.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.serviceCard}
                    >
                      {/* Decorative circles */}
                      <View style={styles.cardCircle1} />
                      <View style={styles.cardCircle2} />

                      {/* Top: label */}
                      <Text style={styles.cardLabel}>{t(card.labelKey).toUpperCase()}</Text>

                      {/* Middle: emoji */}
                      <Text style={styles.cardEmoji}>{card.emoji}</Text>

                      {/* Bottom: title + sub */}
                      <View>
                        <Text style={styles.cardTitle}>{t(card.labelKey)}</Text>
                        <Text style={styles.cardSub}>{cardSubs[card.id]}</Text>
                      </View>

                      {/* Arrow */}
                      <View style={styles.cardArrow}>
                        <Text style={styles.cardArrowTxt}>→</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Animated.View>

          {/* ── Rate Your Stay banner ── */}
          <Animated.View style={a3}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push('/guest/review' as any)}
              style={{ marginHorizontal: 16, marginBottom: 20 }}
            >
              <LinearGradient
                colors={['#FF6B35', '#E63946']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.reviewBanner}
              >
                <View style={styles.reviewBannerCircle} />
                <View style={styles.reviewBannerLeft}>
                  <Text style={styles.reviewBannerLabel}>SHARE YOUR EXPERIENCE</Text>
                  <Text style={styles.reviewBannerTitle}>{t('card_review')}</Text>
                  <Text style={styles.reviewBannerStars}>⭐⭐⭐⭐⭐</Text>
                </View>
                <View style={styles.reviewBannerArrow}>
                  <Text style={styles.reviewBannerArrowTxt}>→</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Info strip */}
          <Animated.View style={a3}>
            <View style={styles.infoStrip}>
              {[
                { val: '15:00', lbl: 'Check-in' },
                { val: '12:00', lbl: 'Check-out' },
                { val: String(RESORT.poolCount), lbl: 'Pools' },
                { val: String(RESORT.roomCount), lbl: 'Rooms' },
              ].map((item, i, arr) => (
                <React.Fragment key={item.lbl}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoVal}>{item.val}</Text>
                    <Text style={styles.infoLbl}>{item.lbl}</Text>
                  </View>
                  {i < arr.length - 1 && <View style={styles.infoSep} />}
                </React.Fragment>
              ))}
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F2EE',
  },
  scroll: {
    paddingBottom: 48,
  },

  // Hero
  hero: {
    width: '100%',
    height: 310,
    justifyContent: 'space-between',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 58,
    paddingHorizontal: 20,
  },
  backBtn: {
    backgroundColor: 'rgba(0,0,0,0.40)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  backTxt: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  timePill: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  timeTxt: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroBottom: {
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  greetingTxt: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.90)',
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  resortTxt: {
    fontSize: 38,
    color: '#fff',
    fontWeight: '300',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  heroDivider: {
    width: 30,
    height: 2,
    backgroundColor: Brand.turquoise,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaTxt: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  // Light content area
  lightBg: {
    backgroundColor: '#F5F2EE',
    paddingTop: 20,
    paddingBottom: 8,
  },

  // Tonight / Now card
  nowCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  nowAccent: {
    width: 5,
    alignSelf: 'stretch',
  },
  nowBody: {
    flex: 1,
    padding: 18,
  },
  nowBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  nowBadgeTxt: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  nowTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  nowMeta: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  nowEmoji: {
    fontSize: 56,
    paddingRight: 20,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.3,
  },
  sectionHint: {
    fontSize: 13,
    color: '#999',
    fontWeight: '600',
  },

  // Horizontal scroll
  hScrollWrap: {
    height: CARD_H + 32,   // explicit height so web doesn't collapse it
    marginBottom: 8,
  },
  hScroll: {
    paddingLeft: 16,
    paddingRight: 8,
    gap: 14,
    alignItems: 'flex-start',
  },
  serviceCard: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardCircle1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.10)',
    top: -50,
    right: -40,
  },
  cardCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.07)',
    bottom: 20,
    left: -20,
  },
  cardLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '800',
    letterSpacing: 2.5,
  },
  cardEmoji: {
    fontSize: 54,
  },
  cardTitle: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '800',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  cardSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.80)',
    fontWeight: '600',
    marginTop: 6,
  },
  cardArrow: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.40)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardArrowTxt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },

  // Info strip
  infoStrip: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    flexDirection: 'row',
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoVal: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.navy,
    marginBottom: 3,
  },
  infoLbl: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  infoSep: {
    width: 1,
    backgroundColor: '#EEE',
  },

  // Review banner
  reviewBanner: {
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  reviewBannerCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    right: -40,
    top: -50,
  },
  reviewBannerLeft: {
    flex: 1,
    gap: 4,
  },
  reviewBannerLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '800',
    letterSpacing: 2.5,
  },
  reviewBannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.3,
  },
  reviewBannerStars: {
    fontSize: 16,
    marginTop: 2,
  },
  reviewBannerArrow: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBannerArrowTxt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});
