import React, { useMemo, useState } from 'react';
import { useNow } from '@/hooks/useNow';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Brand } from '@/constants/theme';
import {
  Activity,
  ActivityCategory,
  ALL_CATEGORIES,
  CATEGORY_COLORS,
  getActivitiesForDate,
  getHappeningNow,
  getTonightsShow,
} from '@/data/activities';
import { useLanguage } from '@/context/LanguageContext';

const BG_IMAGE = require('@/assets/images/resort_pool.webp');

const CAT_KEY: Record<string, string> = {
  All: 'filter_all', Aqua: 'filter_aqua', Sport: 'filter_sport',
  Kids: 'filter_kids', Dance: 'filter_dance', Games: 'filter_games', Evening: 'filter_evening',
};

/** Returns a Date within the current week for a given day-of-week index */
function dateForDow(targetDow: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + (targetDow - d.getDay()));
  return d;
}

export default function ActivitiesScreen() {
  const router = useRouter();
  const now    = useNow();
  const { t, dayShort, dayFull } = useLanguage();

  const [selectedDow,      setSelectedDow]      = useState(() => now.getDay());
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'All'>('All');

  const todayDow     = now.getDay();
  const isToday      = selectedDow === todayDow;
  const isSaturday   = selectedDow === 6;

  // Recompute only when selected day changes, not on every 60s tick
  const selectedDate = useMemo(() => dateForDow(selectedDow), [selectedDow]);
  const activities   = useMemo(() => getActivitiesForDate(selectedDate), [selectedDate]);
  const tonightsShow = useMemo(() => getTonightsShow(selectedDate), [selectedDate]);

  // Recompute "happening now" on every tick, but only for today's view
  const happeningNow = useMemo(
    () => (isToday ? getHappeningNow(activities, now) : null),
    [isToday, activities, now],
  );

  const filtered: Activity[] = useMemo(
    () => selectedCategory === 'All'
      ? activities
      : activities.filter((a) => a.category === selectedCategory),
    [activities, selectedCategory],
  );

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Hero Header ─── */}
        <ImageBackground source={BG_IMAGE} style={styles.hero} resizeMode="cover">
          <View style={styles.heroOverlay}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backText}>{t('back_guest')}</Text>
            </TouchableOpacity>
            <View style={styles.heroBottom}>
              <Text style={styles.heroLabel}>{t('activity_schedule').toUpperCase()}</Text>
              <Text style={styles.heroTitle}>{dayFull[selectedDow]}</Text>
              <View style={styles.heroDivider} />
              {isToday && (
                <Text style={styles.heroTime}>🕐 {formatTime(now)}</Text>
              )}
            </View>
          </View>
        </ImageBackground>

        {/* ─── Day Selector ─── */}
        <View style={styles.daySelectorWrap}>
          <BlurView intensity={85} tint="light" style={styles.daySelectorCard}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daySelectorContent}
            >
              {dayShort.map((name, dow) => {
                const isSelected = selectedDow === dow;
                const isCurrentDay = dow === todayDow;
                const date = dateForDow(dow);
                return (
                  <TouchableOpacity
                    key={dow}
                    style={[
                      styles.dayBtn,
                      isSelected && styles.dayBtnSelected,
                    ]}
                    onPress={() => {
                      setSelectedDow(dow);
                      setSelectedCategory('All');
                    }}
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
          </BlurView>
        </View>

        <View style={styles.content}>

          {/* ─── Saturday Day Off Banner ─── */}
          {isSaturday ? (
            <BlurView intensity={80} tint="light" style={styles.dayOffCard}>
              <Text style={styles.dayOffEmoji}>😴</Text>
              <Text style={styles.dayOffTitle}>{t('animation_day_off')}</Text>
              <Text style={styles.dayOffSubtitle}>{t('day_off_desc')}</Text>
            </BlurView>
          ) : (
            <>
              {/* ─── Happening Now / Tonight card ─── */}
              {isToday && happeningNow ? (
                <BlurView intensity={85} tint="light" style={styles.happeningCard}>
                  <View style={styles.happeningBadge}>
                    <Text style={styles.happeningBadgeText}>{t('happening_now_badge')}</Text>
                  </View>
                  <Text style={styles.happeningTitle}>
                    {happeningNow.icon}  {happeningNow.title}
                  </Text>
                  <Text style={styles.happeningMeta}>📍 {happeningNow.location}</Text>
                  <Text style={styles.happeningDesc}>{happeningNow.description}</Text>
                  <View
                    style={[styles.categoryPill, { backgroundColor: CATEGORY_COLORS[happeningNow.category].bg }]}
                  >
                    <Text style={[styles.categoryPillText, { color: CATEGORY_COLORS[happeningNow.category].text }]}>
                      {happeningNow.category}
                    </Text>
                  </View>
                </BlurView>
              ) : (
                <BlurView intensity={80} tint="light" style={styles.tonightCard}>
                  <View style={[styles.happeningBadge, { backgroundColor: Brand.turquoise }]}>
                    <Text style={styles.happeningBadgeText}>
                      {isToday ? t('tonight') : dayShort[selectedDow].toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.happeningTitle}>🎭  {tonightsShow.title}</Text>
                  <Text style={styles.happeningMeta}>
                    📍 {tonightsShow.venue} · {tonightsShow.startTime}
                  </Text>
                  <Text style={styles.happeningDesc}>{tonightsShow.description}</Text>
                </BlurView>
              )}
            </>
          )}

          {/* ─── Category filter pills ─── */}
          {!isSaturday && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterContent}
            >
              {(['All', ...ALL_CATEGORIES] as (ActivityCategory | 'All')[]).map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.filterPill, active && styles.filterPillActive]}
                    onPress={() => setSelectedCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                      {t(CAT_KEY[cat] ?? cat.toLowerCase())}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* ─── Timeline ─── */}
          <View style={styles.timeline}>
            {filtered.map((activity, idx) => {
              const catColors = CATEGORY_COLORS[activity.category];
              const isActive  = happeningNow?.id === activity.id;

              return (
                <View key={activity.id} style={styles.timelineRow}>
                  {/* Left: time + connector */}
                  <View style={styles.timelineLeft}>
                    <Text style={[styles.timeLabel, isActive && styles.timeLabelActive]}>
                      {activity.displayTime}
                    </Text>
                    {idx < filtered.length - 1 && (
                      <View style={styles.timelineConnector} />
                    )}
                  </View>

                  {/* Right: activity card */}
                  <BlurView
                    intensity={isActive ? 90 : 70}
                    tint="light"
                    style={[
                      styles.activityCard,
                      { borderLeftColor: catColors.text },
                      isActive && styles.activityCardActive,
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <Text style={styles.activityTitle}>
                        {activity.icon}  {activity.title}
                      </Text>
                      <View style={[styles.categoryPill, { backgroundColor: catColors.bg }]}>
                        <Text style={[styles.categoryPillText, { color: catColors.text }]}>
                          {activity.category}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.activityLocation}>📍 {activity.location}</Text>
                    <Text style={styles.activityDesc}>{activity.description}</Text>
                    <Text style={styles.activityDuration}>⏱ {activity.durationMinutes} min</Text>
                  </BlurView>
                </View>
              );
            })}
          </View>

          {filtered.length === 0 && !isSaturday && (
            <BlurView intensity={70} tint="light" style={styles.emptyCard}>
              <Text style={styles.emptyText}>{t('no_activities')}</Text>
            </BlurView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.offWhite,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  hero: {
    width: '100%',
    height: 220,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: Brand.overlayDark,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  backBtn: {},
  backText: {
    fontSize: 14,
    color: Brand.white,
    fontWeight: '700',
    letterSpacing: 2,
  },
  heroBottom: {},
  heroLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 3,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 26,
    color: Brand.white,
    fontWeight: '300',
    letterSpacing: 1,
    marginTop: 4,
  },
  heroDivider: {
    width: 32,
    height: 2,
    backgroundColor: Brand.turquoise,
    marginVertical: 10,
  },
  heroTime: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  // ── Day Selector ──
  daySelectorWrap: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 4,
    zIndex: 10,
  },
  daySelectorCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  daySelectorContent: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 6,
    flexDirection: 'row',
  },
  dayBtn: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    minWidth: 48,
    position: 'relative',
  },
  dayBtnSelected: {
    backgroundColor: Brand.navy,
  },
  dayBtnName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  dayBtnDate: {
    fontSize: 18,
    fontWeight: '300',
    color: '#333',
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
    marginTop: 4,
  },
  todayDotSelected: {
    backgroundColor: Brand.white,
  },
  // ── Content ──
  content: {
    paddingHorizontal: 20,
    marginTop: 14,
  },
  // ── Day Off ──
  dayOffCard: {
    borderRadius: 22,
    padding: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    marginBottom: 20,
  },
  dayOffEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  dayOffTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  dayOffSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 21,
  },
  // ── Happening Now / Tonight ──
  happeningCard: {
    borderRadius: 22,
    padding: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: Brand.glassCard,
    marginBottom: 16,
    elevation: 4,
  },
  tonightCard: {
    borderRadius: 22,
    padding: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: Brand.glassCard,
    marginBottom: 16,
    elevation: 4,
  },
  happeningBadge: {
    backgroundColor: Brand.navy,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  happeningBadgeText: {
    color: Brand.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  happeningTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  happeningMeta: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
    marginBottom: 8,
  },
  happeningDesc: {
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 19,
    marginBottom: 12,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterContent: {
    paddingRight: 8,
    gap: 8,
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,74,173,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(0,74,173,0.15)',
  },
  filterPillActive: {
    backgroundColor: Brand.navy,
    borderColor: Brand.navy,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.navy,
  },
  filterPillTextActive: {
    color: Brand.white,
  },
  timeline: {
    paddingBottom: 8,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  timelineLeft: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: 14,
    paddingTop: 14,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777',
    textAlign: 'right',
    lineHeight: 16,
  },
  timeLabelActive: {
    color: Brand.navy,
    fontWeight: '800',
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Brand.turquoise,
    marginTop: 6,
    marginRight: -1,
    minHeight: 20,
    opacity: 0.5,
  },
  activityCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    borderLeftWidth: 3,
  },
  activityCardActive: {
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: Brand.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  activityLocation: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 6,
  },
  activityDesc: {
    fontSize: 12,
    color: '#4A4A4A',
    lineHeight: 17,
    marginBottom: 8,
  },
  activityDuration: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  emptyCard: {
    borderRadius: 16,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#777',
    fontWeight: '500',
  },
});
