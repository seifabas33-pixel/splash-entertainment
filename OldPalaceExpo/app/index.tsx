import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Brand } from '@/constants/theme';
import { useLanguage, LANGUAGE_META, Language } from '@/context/LanguageContext';

const { width, height } = Dimensions.get('window');

const BG_IMAGES = [
  require('@/assets/images/resort_pool.webp'),
  require('@/assets/images/resort_beach.webp'),
  require('@/assets/images/resort_lobby.webp'),
];

const LANGUAGES = Object.keys(LANGUAGE_META) as Language[];

export default function LandingScreen() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const { width: winW } = useWindowDimensions();

  // ── Slideshow ──────────────────────────────────────────────────────────────
  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx]       = useState(1);
  const crossFade = useRef(new Animated.Value(0)).current;

  // ── Entrance animated values ───────────────────────────────────────────────
  const logoOpacity     = useRef(new Animated.Value(0)).current;
  const logoScale       = useRef(new Animated.Value(0.7)).current;
  const bgScale         = useRef(new Animated.Value(Platform.OS === 'web' ? 1 : 1.1)).current;
  const titleOpacity    = useRef(new Animated.Value(0)).current;
  const titleY          = useRef(new Animated.Value(50)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleY       = useRef(new Animated.Value(35)).current;
  const dividerScaleX   = useRef(new Animated.Value(0)).current;
  const taglineOpacity  = useRef(new Animated.Value(0)).current;
  const taglineY        = useRef(new Animated.Value(20)).current;
  const locationOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity     = useRef(new Animated.Value(0)).current;
  const cardY           = useRef(new Animated.Value(100)).current;
  const dividerGlow     = useRef(new Animated.Value(0.6)).current;
  const guestScale      = useRef(new Animated.Value(1)).current;
  const staffScale      = useRef(new Animated.Value(1)).current;
  const scrollHintY     = useRef(new Animated.Value(0)).current;

  // Slideshow loop
  useEffect(() => {
    let activeBg = 0;
    const startCycle = () => {
      crossFade.setValue(0);
      Animated.sequence([
        Animated.delay(5000),
        Animated.timing(crossFade, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) {
          activeBg = (activeBg + 1) % BG_IMAGES.length;
          setCurrentIdx(activeBg);
          setNextIdx((activeBg + 1) % BG_IMAGES.length);
          startCycle();
        }
      });
    };
    startCycle();
    return () => crossFade.stopAnimation();
  }, []);

  // Entrance animations
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Animated.timing(bgScale, { toValue: 1, duration: 4000, useNativeDriver: true }).start();
    }
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(logoScale,   { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();

    const headerTimeout = setTimeout(() => {
      Animated.stagger(190, [
        Animated.parallel([
          Animated.timing(titleOpacity,    { toValue: 1, duration: 950, useNativeDriver: true }),
          Animated.timing(titleY,          { toValue: 0, duration: 950, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(subtitleOpacity, { toValue: 1, duration: 750, useNativeDriver: true }),
          Animated.timing(subtitleY,       { toValue: 0, duration: 750, useNativeDriver: true }),
        ]),
        Animated.timing(dividerScaleX, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(taglineOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(taglineY,       { toValue: 0, duration: 600, useNativeDriver: true }),
        ]),
        Animated.timing(locationOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 350);

    const cardTimeout = setTimeout(() => {
      Animated.parallel([
        Animated.spring(cardY, { toValue: 0, tension: 52, friction: 9, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 1150);

    const hintTimeout = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollHintY, { toValue: 7, duration: 900, useNativeDriver: true }),
          Animated.timing(scrollHintY, { toValue: 0, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    }, 2000);

    let pulseAnim: Animated.CompositeAnimation | null = null;
    const pulseTimeout = setTimeout(() => {
      pulseAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(dividerGlow, { toValue: 1,    duration: 1800, useNativeDriver: true }),
          Animated.timing(dividerGlow, { toValue: 0.35, duration: 1800, useNativeDriver: true }),
        ])
      );
      pulseAnim.start();
    }, 1600);

    return () => {
      clearTimeout(headerTimeout);
      clearTimeout(cardTimeout);
      clearTimeout(hintTimeout);
      clearTimeout(pulseTimeout);
      pulseAnim?.stop();
    };
  }, []);

  const pressIn  = (v: Animated.Value) =>
    Animated.spring(v, { toValue: 0.955, useNativeDriver: true, speed: 60, bounciness: 0 }).start();
  const pressOut = (v: Animated.Value) =>
    Animated.spring(v, { toValue: 1,     useNativeDriver: true, speed: 30, bounciness: 5 }).start();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* ── Slideshow backgrounds ── */}
      <View style={styles.bgLayer}>
        <Animated.View style={[styles.fullscreen, { transform: [{ scale: bgScale }] }]}>
          <ImageBackground source={BG_IMAGES[currentIdx]} style={styles.fullscreen} resizeMode="cover" />
        </Animated.View>
        <Animated.View style={[styles.fullscreen, { opacity: crossFade }]}>
          <ImageBackground source={BG_IMAGES[nextIdx]} style={styles.fullscreen} resizeMode="cover" />
        </Animated.View>
        {/* Cinematic vignette gradient */}
        <LinearGradient
          colors={['rgba(0,5,20,0.72)', 'rgba(0,0,0,0.08)', 'rgba(0,5,20,0.85)']}
          locations={[0, 0.5, 1]}
          style={styles.fullscreen}
          pointerEvents="none"
        />
        {/* Subtle side vignette */}
        <LinearGradient
          colors={['rgba(0,5,20,0.5)', 'transparent', 'rgba(0,5,20,0.5)']}
          start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
          style={styles.fullscreen}
          pointerEvents="none"
        />
      </View>

      {/* ── Language selector ── */}
      <View style={styles.langBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langScroll}>
          {LANGUAGES.map((lang) => {
            const meta = LANGUAGE_META[lang];
            const active = lang === language;
            return (
              <TouchableOpacity
                key={lang}
                style={[styles.langPill, active && styles.langPillActive]}
                onPress={() => setLanguage(lang)}
                activeOpacity={0.75}
              >
                <Text style={styles.langFlag}>{meta.flag}</Text>
                <Text style={[styles.langCode, active && styles.langCodeActive]}>{meta.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Main scrollable content ── */}
      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false} bounces>

        {/* ── HERO PAGE (full screen) ── */}
        <View style={styles.heroPage}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
              <Image source={require('@/assets/images/splash_logo.png')} style={styles.logo} resizeMode="contain" />
            </Animated.View>
            <Animated.Text style={[styles.eyebrow, { opacity: subtitleOpacity }]}>
              HILTON · MARSA ALAM
            </Animated.Text>
            <Animated.Text style={[styles.title, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
              NUBIAN RESORT
            </Animated.Text>
            <Animated.View style={[styles.divider, { opacity: dividerGlow, transform: [{ scaleX: dividerScaleX }] }]} />
            <Animated.Text style={[styles.tagline, { opacity: taglineOpacity, transform: [{ translateY: taglineY }] }]}>
              Splash Entertainment Platform
            </Animated.Text>
            <Animated.Text style={[styles.location, { opacity: locationOpacity }]}>
              📍  Abu Dabbab Bay · Red Sea, Egypt
            </Animated.Text>
          </View>

          {/* Buttons + scroll hint */}
          <View>
            <Animated.View style={{ opacity: cardOpacity, transform: [{ translateY: cardY }] }}>
              {/* Glass card */}
              <BlurView intensity={22} tint="dark" style={styles.glassCard}>
                {/* Gold top accent line */}
                <View style={styles.cardGoldLine} />
                <Text style={styles.instruction}>{t('welcome_tap')}</Text>

                {/* Guest button */}
                <Animated.View style={{ transform: [{ scale: guestScale }] }}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    activeOpacity={1}
                    onPressIn={() => pressIn(guestScale)}
                    onPressOut={() => pressOut(guestScale)}
                    onPress={() => router.push('/guest')}
                  >
                    <LinearGradient
                      colors={[Brand.navyDeep, '#002878']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <Text style={styles.buttonTitle}>🏖️  {t('guest_experience')}</Text>
                    <Text style={styles.buttonSubtitle}>{t('guest_sub')}</Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* Gold divider */}
                <View style={styles.cardInnerDivider} />

                {/* Staff pill */}
                <Animated.View style={{ transform: [{ scale: staffScale }] }}>
                  <TouchableOpacity
                    style={styles.staffPill}
                    activeOpacity={1}
                    onPressIn={() => pressIn(staffScale)}
                    onPressOut={() => pressOut(staffScale)}
                    onPress={() => router.push('/auth')}
                  >
                    <Text style={styles.staffPillIcon}>🔐</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.staffPillTitle}>{t('staff_portal')}</Text>
                      <Text style={styles.staffPillSub}>{t('staff_sub')}</Text>
                    </View>
                    <Text style={styles.staffPillChevron}>›</Text>
                  </TouchableOpacity>
                </Animated.View>
              </BlurView>
            </Animated.View>

            {/* Scroll hint */}
            <Animated.View style={{ alignItems: 'center', marginTop: 20, transform: [{ translateY: scrollHintY }] }}>
              <Text style={styles.scrollHint}>↓  {t('scroll_to_explore')}</Text>
            </Animated.View>
          </View>
        </View>

        {/* ── PORTFOLIO SECTION ── */}
        <View style={styles.portfolioSection}>

          {/* Thin gold top border */}
          <View style={styles.sectionTopBorder} />

          {/* About header */}
          <View style={styles.portfolioHeader}>
            <View style={styles.portfolioStarsRow}>
              <Text style={styles.portfolioStarText}>★ ★ ★ ★ ★</Text>
              <View style={styles.portfolioStarBadge}>
                <Text style={styles.portfolioStarBadgeText}>5 STAR</Text>
              </View>
            </View>
            <Text style={styles.portfolioTitle}>{t('about_resort')}</Text>
            <View style={styles.portfolioTitleDivider} />
            <Text style={styles.portfolioAddressText}>📍  Abu Dabbab Bay · Marsa Alam · Red Sea, Egypt</Text>
            <Text style={styles.portfolioDesc}>{t('portfolio_desc')}</Text>
          </View>

          {/* Stats strip */}
          <View style={styles.statsStrip}>
            {([
              { value: '400', label: 'Rooms' },
              { value: '5',   label: 'Pools' },
              { value: '35+', label: 'Dive Sites' },
              { value: '11',  label: 'Venues' },
            ] as { value: string; label: string }[]).map((s, i) => (
              <View key={i} style={[styles.statItem, i < 3 && styles.statItemBorder]}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Gallery */}
          <Text style={styles.portfolioSectionTitle}>GALLERY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
            {([
              { src: require('@/assets/images/resort_pool.webp')  as number, caption: 'Entertainment Pool Complex' },
              { src: require('@/assets/images/resort_beach.webp') as number, caption: 'Private Beach · Abu Dabbab Bay' },
              { src: require('@/assets/images/resort_lobby.webp') as number, caption: 'Main Lobby & Reception' },
            ] as { src: number; caption: string }[]).map((photo, i) => (
              <View key={i} style={[styles.galleryCard, { width: winW * 0.75 }]}>
                <ImageBackground source={photo.src} style={styles.galleryImage} resizeMode="cover" imageStyle={{ borderRadius: 18 }}>
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.82)']} style={styles.galleryGradient}>
                    <View style={styles.galleryCaptionRow}>
                      <View style={styles.galleryCaptionBar} />
                      <Text style={styles.galleryCaption}>{photo.caption}</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>

          {/* Highlights grid */}
          <Text style={styles.portfolioSectionTitle}>HIGHLIGHTS</Text>
          <View style={styles.highlightsGrid}>
            {([
              { icon: '🏖️', title: 'Private Beach',    sub: 'Abu Dabbab Bay' },
              { icon: '🏊', title: '5 Pools',          sub: '2,590 m²' },
              { icon: '🤿', title: 'PADI Dive Centre', sub: '35+ dive sites' },
              { icon: '💆', title: 'Planet Spa',       sub: 'Full-service' },
              { icon: '🎭', title: 'Nightly Shows',    sub: 'Amphitheater' },
              { icon: '🍽️', title: '5 Restaurants',   sub: '6 bars & lounges' },
            ] as { icon: string; title: string; sub: string }[]).map((h, i) => (
              <View key={i} style={styles.highlightCard}>
                <Text style={styles.highlightIcon}>{h.icon}</Text>
                <Text style={styles.highlightTitle}>{h.title}</Text>
                <Text style={styles.highlightSub}>{h.sub}</Text>
              </View>
            ))}
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {(['All-Inclusive', 'Family Friendly', 'Adults Retreat', 'Private Beach'] as string[]).map((tag) => (
              <View key={tag} style={styles.portfolioTag}>
                <Text style={styles.portfolioTagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 64 }} />
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#000', width: '100%', ...(Platform.OS !== 'web' ? { overflow: 'hidden' } : {}) },
  fullscreen: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  bgLayer: Platform.OS === 'web' ? ({ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 } as any) : {},

  // ── Language bar ────────────────────────────────────────────────────────────
  langBar: { position: 'absolute', top: 52, right: 0, left: 0, zIndex: 20 },
  langScroll: { paddingHorizontal: 16, gap: 6, flexDirection: 'row', justifyContent: 'flex-end' },
  langPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  langPillActive: {
    backgroundColor: 'rgba(0,15,50,0.7)',
    borderColor: Brand.goldBorder,
  },
  langFlag: { fontSize: 14 },
  langCode: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5 },
  langCodeActive: { color: Brand.gold },

  // ── Scroll + Hero ───────────────────────────────────────────────────────────
  mainScroll: { flex: 1 },
  heroPage: {
    minHeight: height,
    justifyContent: 'space-between',
    paddingTop: 110,
    paddingBottom: 44,
    paddingHorizontal: 22,
    maxWidth: 540,
    width: '100%',
    alignSelf: 'center',
  },
  scrollHint: {
    color: Brand.gold,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3,
    textTransform: 'uppercase',
    opacity: 0.7,
  },

  // ── Hero typography ─────────────────────────────────────────────────────────
  headerContainer: { alignItems: 'center' },
  logoWrap: { marginBottom: 20, alignSelf: 'stretch' },
  logo: { width: '100%', height: 110 },
  eyebrow: {
    fontSize: 11, fontWeight: '400', color: Brand.gold,
    letterSpacing: 6, textTransform: 'uppercase', marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6,
  },
  title: {
    fontSize: 48, fontWeight: '200', letterSpacing: 10, color: Brand.white, marginBottom: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 12,
  },
  divider: {
    width: 64, height: 1, backgroundColor: Brand.gold, marginVertical: 20,
    shadowColor: Brand.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8, elevation: 6,
  },
  tagline: {
    fontSize: 11, color: 'rgba(255,255,255,0.8)', letterSpacing: 4,
    fontWeight: '400', textTransform: 'uppercase', marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6,
  },
  location: {
    fontSize: 12, color: 'rgba(255,255,255,0.65)', letterSpacing: 1, fontWeight: '400', marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6,
  },

  // ── Glass card ──────────────────────────────────────────────────────────────
  glassCard: {
    width: '100%', maxWidth: 460, alignSelf: 'center',
    borderRadius: 28, paddingBottom: 28, overflow: 'hidden',
    borderWidth: 1, borderColor: Brand.goldBorder,
  },
  cardGoldLine: {
    height: 1, backgroundColor: Brand.gold, opacity: 0.6, marginBottom: 28,
  },
  instruction: {
    fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 20,
    fontWeight: '400', textAlign: 'center', letterSpacing: 1.5,
    fontStyle: 'italic', paddingHorizontal: 28,
  },
  primaryButton: {
    borderRadius: 18, paddingVertical: 20, paddingHorizontal: 24,
    alignItems: 'center', overflow: 'hidden',
    borderWidth: 1, borderColor: Brand.goldBorder,
    marginHorizontal: 20,
    shadowColor: Brand.gold, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 6,
  },
  buttonTitle:    { fontSize: 16, fontWeight: '600', color: Brand.gold, marginBottom: 5, letterSpacing: 1.5 },
  buttonSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: '300', letterSpacing: 0.8 },
  cardInnerDivider: {
    height: 1, backgroundColor: Brand.goldBorder, marginVertical: 18, marginHorizontal: 20,
  },
  staffPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 14,
    marginHorizontal: 20,
  },
  staffPillIcon:    { fontSize: 20 },
  staffPillTitle:   { fontSize: 14, fontWeight: '600', color: Brand.white, letterSpacing: 0.8 },
  staffPillSub:     { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '300', marginTop: 2, letterSpacing: 0.3 },
  staffPillChevron: { fontSize: 22, color: Brand.gold, fontWeight: '200', opacity: 0.7 },

  // ── Portfolio section ───────────────────────────────────────────────────────
  portfolioSection: { backgroundColor: '#060C1A' },
  sectionTopBorder: { height: 1, backgroundColor: Brand.gold, opacity: 0.25 },
  portfolioHeader: { paddingHorizontal: 28, paddingTop: 52, paddingBottom: 32 },
  portfolioStarsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  portfolioStarText: { color: Brand.gold, fontSize: 14, letterSpacing: 5 },
  portfolioStarBadge: {
    borderWidth: 1, borderColor: Brand.goldBorder,
    borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3,
  },
  portfolioStarBadgeText: { color: Brand.gold, fontSize: 9, fontWeight: '700', letterSpacing: 2 },
  portfolioTitle: {
    color: Brand.white, fontSize: 32, fontWeight: '200',
    letterSpacing: 2, marginBottom: 16, lineHeight: 40,
  },
  portfolioTitleDivider: {
    width: 48, height: 1, backgroundColor: Brand.gold, marginBottom: 20, opacity: 0.8,
  },
  portfolioAddressText: {
    color: 'rgba(255,255,255,0.45)', fontSize: 12,
    fontWeight: '400', marginBottom: 16, letterSpacing: 0.5,
  },
  portfolioDesc: {
    color: 'rgba(255,255,255,0.65)', fontSize: 15,
    lineHeight: 26, fontWeight: '300', letterSpacing: 0.3,
  },

  // ── Stats strip ─────────────────────────────────────────────────────────────
  statsStrip: {
    flexDirection: 'row',
    borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: 'rgba(201,168,76,0.15)',
    paddingVertical: 28, paddingHorizontal: 20,
    backgroundColor: 'rgba(201,168,76,0.03)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statItemBorder: {
    borderRightWidth: 1, borderRightColor: 'rgba(201,168,76,0.15)',
  },
  statValue: { color: Brand.gold, fontSize: 30, fontWeight: '200', letterSpacing: 1 },
  statLabel: {
    color: 'rgba(255,255,255,0.38)', fontSize: 9,
    fontWeight: '700', letterSpacing: 2, marginTop: 5, textTransform: 'uppercase',
  },

  // ── Gallery ─────────────────────────────────────────────────────────────────
  portfolioSectionTitle: {
    color: Brand.gold, fontSize: 9, fontWeight: '700',
    letterSpacing: 4, textTransform: 'uppercase',
    paddingHorizontal: 28, paddingTop: 44, paddingBottom: 18,
    opacity: 0.8,
  },
  galleryRow: { paddingHorizontal: 22, gap: 14, paddingBottom: 4 },
  galleryCard: { height: 240 },
  galleryImage: { width: '100%', height: '100%', overflow: 'hidden' },
  galleryGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
    borderBottomLeftRadius: 18, borderBottomRightRadius: 18,
    justifyContent: 'flex-end', padding: 16,
  },
  galleryCaptionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  galleryCaptionBar: { width: 3, height: 14, backgroundColor: Brand.gold, borderRadius: 2, opacity: 0.9 },
  galleryCaption: { color: Brand.white, fontSize: 12, fontWeight: '500', letterSpacing: 0.5 },

  // ── Highlights ──────────────────────────────────────────────────────────────
  highlightsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 18, gap: 10, paddingBottom: 8,
  },
  highlightCard: {
    width: '30%', borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.18)',
    backgroundColor: 'rgba(201,168,76,0.04)',
    alignItems: 'center', gap: 7,
  },
  highlightIcon:  { fontSize: 26 },
  highlightTitle: { color: Brand.white, fontSize: 11, fontWeight: '600', textAlign: 'center', lineHeight: 15, letterSpacing: 0.3 },
  highlightSub:   { color: Brand.gold, fontSize: 9, fontWeight: '500', textAlign: 'center', opacity: 0.7, letterSpacing: 0.5 },

  // ── Tags ────────────────────────────────────────────────────────────────────
  tagsRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 22, gap: 8, paddingTop: 36, paddingBottom: 16,
  },
  portfolioTag: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: Brand.goldBorder,
    backgroundColor: Brand.goldLight,
  },
  portfolioTagText: { color: Brand.gold, fontSize: 11, fontWeight: '500', letterSpacing: 1 },
});
