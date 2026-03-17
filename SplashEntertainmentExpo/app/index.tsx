import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

  // ── Slideshow ──────────────────────────────────────────────────────────────
  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx]       = useState(1);
  const crossFade = useRef(new Animated.Value(0)).current;

  // ── Entrance animated values ───────────────────────────────────────────────
  const logoOpacity     = useRef(new Animated.Value(0)).current;
  const logoScale       = useRef(new Animated.Value(0.7)).current;
  const bgScale         = useRef(new Animated.Value(1.1)).current;
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
    Animated.timing(bgScale, { toValue: 1, duration: 4000, useNativeDriver: true }).start();
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
          Animated.timing(dividerGlow, { toValue: 1,    duration: 1500, useNativeDriver: true }),
          Animated.timing(dividerGlow, { toValue: 0.45, duration: 1500, useNativeDriver: true }),
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
      <Animated.View style={[styles.fullscreen, { transform: [{ scale: bgScale }] }]}>
        <ImageBackground source={BG_IMAGES[currentIdx]} style={styles.fullscreen} resizeMode="cover" />
      </Animated.View>
      <Animated.View style={[styles.fullscreen, { opacity: crossFade }]}>
        <ImageBackground source={BG_IMAGES[nextIdx]} style={styles.fullscreen} resizeMode="cover" />
      </Animated.View>

      {/* ── Gradient (covers hero only) ── */}
      <LinearGradient
        colors={['rgba(0,0,0,0.62)', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.68)']}
        locations={[0, 0.45, 1]}
        style={styles.fullscreen}
        pointerEvents="none"
      />

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
            <Animated.Text style={[styles.title, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
              HILTON
            </Animated.Text>
            <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity, transform: [{ translateY: subtitleY }] }]}>
              MARSA ALAM NUBIAN RESORT
            </Animated.Text>
            <Animated.View style={[styles.divider, { opacity: dividerGlow, transform: [{ scaleX: dividerScaleX }] }]} />
            <Animated.Text style={[styles.tagline, { opacity: taglineOpacity, transform: [{ translateY: taglineY }] }]}>
              Splash Entertainment Platform
            </Animated.Text>
            <Animated.Text style={[styles.location, { opacity: locationOpacity }]}>
              📍 Abu Dabbab Bay · Egypt
            </Animated.Text>
          </View>

          {/* Buttons + scroll hint */}
          <View>
            <Animated.View style={{ opacity: cardOpacity, transform: [{ translateY: cardY }] }}>
              <BlurView intensity={55} tint="dark" style={styles.glassCard}>
                <Text style={styles.instruction}>{t('welcome_tap')}</Text>
                <Animated.View style={{ transform: [{ scale: guestScale }] }}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    activeOpacity={1}
                    onPressIn={() => pressIn(guestScale)}
                    onPressOut={() => pressOut(guestScale)}
                    onPress={() => router.push('/guest')}
                  >
                    <Text style={styles.buttonTitle}>🏖️  {t('guest_experience')}</Text>
                    <Text style={styles.buttonSubtitle}>{t('guest_sub')}</Text>
                  </TouchableOpacity>
                </Animated.View>
              </BlurView>
              <Animated.View style={{ transform: [{ scale: staffScale }] }}>
                <TouchableOpacity
                  style={styles.staffPill}
                  activeOpacity={1}
                  onPressIn={() => pressIn(staffScale)}
                  onPressOut={() => pressOut(staffScale)}
                  onPress={() => router.push('/auth')}
                >
                  <Text style={styles.staffPillIcon}>🔐</Text>
                  <View>
                    <Text style={styles.staffPillTitle}>{t('staff_portal')}</Text>
                    <Text style={styles.staffPillSub}>{t('staff_sub')}</Text>
                  </View>
                  <Text style={styles.staffPillChevron}>›</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
            {/* Scroll hint */}
            <Animated.View style={{ alignItems: 'center', marginTop: 14, transform: [{ translateY: scrollHintY }] }}>
              <Text style={styles.scrollHint}>↓  {t('scroll_to_explore')}</Text>
            </Animated.View>
          </View>
        </View>

        {/* ── PORTFOLIO SECTION ── */}
        <View style={styles.portfolioSection}>

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
              <View key={i} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Gallery */}
          <Text style={styles.portfolioSectionTitle}>GALLERY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
            {([
              { src: require('@/assets/images/resort_pool.webp')  as number,  caption: 'Entertainment Pool Complex' },
              { src: require('@/assets/images/resort_beach.webp') as number, caption: 'Private Beach · Abu Dabbab Bay' },
              { src: require('@/assets/images/resort_lobby.webp') as number, caption: 'Main Lobby & Reception' },
            ] as { src: number; caption: string }[]).map((photo, i) => (
              <View key={i} style={styles.galleryCard}>
                <ImageBackground source={photo.src} style={styles.galleryImage} resizeMode="cover" imageStyle={{ borderRadius: 16 }}>
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.72)']} style={styles.galleryGradient}>
                    <Text style={styles.galleryCaption}>{photo.caption}</Text>
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
              <BlurView key={i} intensity={12} tint="dark" style={styles.highlightCard}>
                <Text style={styles.highlightIcon}>{h.icon}</Text>
                <Text style={styles.highlightTitle}>{h.title}</Text>
                <Text style={styles.highlightSub}>{h.sub}</Text>
              </BlurView>
            ))}
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {(['All-Inclusive Available', 'Family Friendly', 'Adults Retreat', 'Private Beach'] as string[]).map((tag) => (
              <View key={tag} style={styles.portfolioTag}>
                <Text style={styles.portfolioTagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 56 }} />
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#000' },
  fullscreen: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  // Language bar
  langBar: {
    position: 'absolute',
    top: 52,
    right: 0,
    left: 0,
    zIndex: 20,
  },
  langScroll: {
    paddingHorizontal: 16,
    gap: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  langPillActive: {
    backgroundColor: 'rgba(0,74,173,0.60)',
    borderColor: Brand.turquoise,
  },
  langFlag: { fontSize: 14 },
  langCode: {
    fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.65)', letterSpacing: 0.5,
  },
  langCodeActive: { color: Brand.white },
  // Scroll + Hero
  mainScroll: { flex: 1 },
  heroPage: {
    minHeight: height,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxWidth: 540,
    width: '100%',
    alignSelf: 'center',
  },
  scrollHint: {
    color: 'rgba(255,255,255,0.50)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // ── Portfolio section ──────────────────────────────────────────────────────
  portfolioSection: {
    backgroundColor: '#070D1B',
  },
  portfolioHeader: {
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 28,
  },
  portfolioStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  portfolioStarText: {
    color: '#C9A84C',
    fontSize: 15,
    letterSpacing: 4,
  },
  portfolioStarBadge: {
    borderWidth: 1,
    borderColor: '#C9A84C',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  portfolioStarBadgeText: {
    color: '#C9A84C',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  portfolioTitle: {
    color: Brand.white,
    fontSize: 30,
    fontWeight: '300',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  portfolioTitleDivider: {
    width: 40,
    height: 2,
    backgroundColor: Brand.turquoise,
    marginBottom: 16,
  },
  portfolioAddressText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 14,
  },
  portfolioDesc: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '300',
  },
  // Stats strip
  statsStrip: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 22,
    paddingHorizontal: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: Brand.turquoise,
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 1,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  // Gallery
  portfolioSectionTitle: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 16,
  },
  galleryRow: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 4,
  },
  galleryCard: {
    width: width * 0.70,
    height: 200,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  galleryGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'flex-end',
    padding: 14,
  },
  galleryCaption: {
    color: Brand.white,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  // Highlights
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 8,
  },
  highlightCard: {
    width: (width - 52) / 3,
    borderRadius: 18,
    padding: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    gap: 6,
  },
  highlightIcon: { fontSize: 26 },
  highlightTitle: {
    color: Brand.white,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 15,
  },
  highlightSub: {
    color: 'rgba(255,255,255,0.40)',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
    paddingTop: 28,
    paddingBottom: 16,
  },
  portfolioTag: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,180,216,0.35)',
    backgroundColor: 'rgba(0,180,216,0.07)',
  },
  portfolioTagText: {
    color: Brand.turquoise,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  headerContainer: { alignItems: 'center' },
  logoWrap: { marginBottom: 12, marginHorizontal: -20 },
  logo: { width, height: 140 },
  title: {
    fontSize: 54, fontWeight: '300', letterSpacing: 14, color: Brand.white, marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.85)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14, fontWeight: '700', letterSpacing: 4, color: Brand.white,
    textAlign: 'center', textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.80)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 8,
  },
  divider: {
    width: 60, height: 2, backgroundColor: Brand.turquoise, marginVertical: 18,
    shadowColor: Brand.turquoise, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10, elevation: 6,
  },
  tagline: {
    fontSize: 12, color: 'rgba(255,255,255,0.95)', letterSpacing: 3.5,
    fontWeight: '600', textTransform: 'uppercase', marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6,
  },
  location: {
    fontSize: 13, color: 'rgba(255,255,255,0.90)', letterSpacing: 1, fontWeight: '500', marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.75)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6,
  },
  // Glass card
  glassCard: {
    width: '100%', maxWidth: 460, alignSelf: 'center',
    borderRadius: 32, padding: 30, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  instruction: {
    fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 24,
    fontWeight: '500', textAlign: 'center', letterSpacing: 0.5, fontStyle: 'italic',
  },
  primaryButton: {
    backgroundColor: Brand.navy, borderRadius: 16, paddingVertical: 18,
    paddingHorizontal: 20, alignItems: 'center',
    shadowColor: Brand.navy, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45, shadowRadius: 16, elevation: 10,
  },
  buttonTitle:    { fontSize: 17, fontWeight: '700', color: Brand.white, marginBottom: 4, letterSpacing: 0.5 },
  buttonSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.72)', fontWeight: '400', letterSpacing: 0.3 },
  // Staff pill
  staffPill: {
    flexDirection: 'row', alignItems: 'center', marginTop: 14, marginHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 20,
    paddingVertical: 14, paddingHorizontal: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', gap: 14,
  },
  staffPillIcon:    { fontSize: 22 },
  staffPillTitle:   { fontSize: 15, fontWeight: '700', color: Brand.white, letterSpacing: 0.3 },
  staffPillSub:     { fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: '400', marginTop: 1 },
  staffPillChevron: { marginLeft: 'auto' as any, fontSize: 22, color: 'rgba(255,255,255,0.40)', fontWeight: '300' },
});
