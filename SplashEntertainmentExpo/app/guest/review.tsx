import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ref, push } from 'firebase/database';
import { db } from '@/constants/firebase';

const { width, height } = Dimensions.get('window');
const BG = require('@/assets/images/resort_pool.webp');

// ─── Aspect categories ────────────────────────────────────────────────────────

const ASPECTS = [
  { key: 'pool',          label: 'Pool & Beach',    icon: '🏊' },
  { key: 'food',          label: 'Food & Dining',   icon: '🍽️' },
  { key: 'entertainment', label: 'Entertainment',   icon: '🎭' },
  { key: 'staff',         label: 'Staff & Service', icon: '🤝' },
  { key: 'room',          label: 'Room & Comfort',  icon: '🛏️' },
  { key: 'cleanliness',   label: 'Cleanliness',     icon: '✨' },
] as const;

type AspectKey = typeof ASPECTS[number]['key'];

const OVERALL_LABELS = ['Terrible', 'Poor', 'Good', 'Great', 'Excellent'];
const OVERALL_COLORS = ['#FF4D4D', '#FF8C00', '#FFD700', '#7BC67E', '#00C853'];

// ─── Star row ─────────────────────────────────────────────────────────────────

function Stars({ value, onChange, size = 28 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          onPress={() => onChange?.(n)}
          activeOpacity={onChange ? 0.7 : 1}
          disabled={!onChange}
          hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
        >
          <Text style={{ fontSize: size, color: n <= value ? '#FFB800' : 'rgba(255,255,255,0.2)', lineHeight: size + 4 }}>
            {n <= value ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ReviewScreen() {
  const router = useRouter();

  const [overall,     setOverall]     = useState(0);
  const [aspects,     setAspects]     = useState<Record<AspectKey, number>>({
    pool: 0, food: 0, entertainment: 0, staff: 0, room: 0, cleanliness: 0,
  });
  const [comment,     setComment]     = useState('');
  const [guestName,   setGuestName]   = useState('');
  const [nationality, setNationality] = useState('');
  const [busy,        setBusy]        = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  const setAspect = (key: AspectKey, val: number) =>
    setAspects((prev) => ({ ...prev, [key]: val }));

  const canSubmit = overall > 0 && !busy;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    try {
      await push(ref(db, 'reviews'), {
        overall,
        aspects,
        comment:     comment.trim(),
        guestName:   guestName.trim() || 'Anonymous',
        nationality: nationality.trim(),
        submittedAt: new Date().toISOString(),
      });
    } finally {
      setBusy(false);
      setSubmitted(true);
    }
  };

  // ── Thank-you screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <ImageBackground source={BG} style={styles.fullBg} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.97)']}
          style={styles.fullBg}
        />
        <View style={styles.thankYouContainer}>
          <Text style={styles.thankYouEmoji}>🎉</Text>
          <Text style={styles.thankYouTitle}>Thank You!</Text>
          <Text style={styles.thankYouSub}>
            Your review helps us make every stay even better.
          </Text>
          {overall > 0 && (
            <View style={styles.overallDisplay}>
              <Stars value={overall} size={36} />
              <Text style={[styles.overallLabelLarge, { color: OVERALL_COLORS[overall - 1] }]}>
                {OVERALL_LABELS[overall - 1]}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()} activeOpacity={0.85}>
            <Text style={styles.doneBtnText}>← Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Review form ─────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      {/* Full-screen background */}
      <ImageBackground source={BG} style={styles.fullBg} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.96)']}
        style={styles.fullBg}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>

          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerBlock}>
            <Text style={styles.eyebrow}>HILTON MARSA ALAM</Text>
            <Text style={styles.title}>Rate Your Stay</Text>
            <View style={styles.rule} />
            <Text style={styles.subtitle}>Your feedback helps us improve for every guest</Text>
          </View>

          {/* ── Overall rating ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Overall Experience</Text>
            <View style={styles.overallStars}>
              <Stars value={overall} onChange={setOverall} size={36} />
            </View>
            {overall > 0 && (
              <Text style={[styles.overallLabel, { color: OVERALL_COLORS[overall - 1] }]}>
                {OVERALL_LABELS[overall - 1]}
              </Text>
            )}
          </View>

          {/* ── Aspect ratings ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Rate by Category</Text>
            {ASPECTS.map((a) => (
              <View key={a.key} style={styles.aspectRow}>
                <Text style={styles.aspectIcon}>{a.icon}</Text>
                <Text style={styles.aspectLabel}>{a.label}</Text>
                <Stars value={aspects[a.key]} onChange={(v) => setAspect(a.key, v)} size={26} />
              </View>
            ))}
          </View>

          {/* ── Comment ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Tell Us More{'  '}
              <Text style={styles.optional}>(optional)</Text>
            </Text>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="What did you love? What could be better?"
              placeholderTextColor="rgba(255,255,255,0.28)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* ── Guest info ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              About You{'  '}
              <Text style={styles.optional}>(optional)</Text>
            </Text>
            <TextInput
              style={styles.nameInput}
              value={guestName}
              onChangeText={setGuestName}
              placeholder="Your name (leave blank for anonymous)"
              placeholderTextColor="rgba(255,255,255,0.28)"
              autoCapitalize="words"
            />
            <TextInput
              style={[styles.nameInput, { marginTop: 12 }]}
              value={nationality}
              onChangeText={setNationality}
              placeholder="Your country  (e.g. Germany)"
              placeholderTextColor="rgba(255,255,255,0.28)"
              autoCapitalize="words"
            />
          </View>

          {/* ── Submit ── */}
          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && { opacity: 0.5 }]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={!canSubmit}
          >
            <LinearGradient
              colors={overall > 0 ? ['#FF6B35', '#E63946'] : ['#2a2a2a', '#3a3a3a']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.submitGrad}
            >
              {busy
                ? <ActivityIndicator color="#fff" size="large" />
                : <>
                    <Text style={styles.submitText}>SUBMIT REVIEW</Text>
                    {overall === 0 && (
                      <Text style={styles.submitHint}>Select an overall star rating first</Text>
                    )}
                  </>
              }
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.privacyNote}>
            Reviews may be shared with the hotel team to improve guest experience.
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  // Background covers the FULL screen behind everything
  fullBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  scroll: {
    flexGrow: 1,
  },

  // Centered content column (works on tablet/web too)
  inner: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 60,
  },

  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 32,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  backText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    letterSpacing: 2,
  },

  // Header
  headerBlock: {
    marginBottom: 32,
  },
  eyebrow: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 4,
    fontWeight: '700',
    marginBottom: 10,
  },
  title: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '200',
    letterSpacing: 0.5,
    lineHeight: 54,
  },
  rule: {
    width: 44,
    height: 3,
    backgroundColor: '#FF6B35',
    marginVertical: 18,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
    lineHeight: 24,
  },

  // Cards
  card: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 24,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3,
    marginBottom: 20,
  },
  optional: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '400',
  },

  // Overall stars
  overallStars: {
    alignItems: 'center',
    marginBottom: 16,
  },
  overallLabel: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Aspect rows
  aspectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 14,
  },
  aspectIcon: {
    fontSize: 22,
    width: 30,
    textAlign: 'center',
  },
  aspectLabel: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },

  // Text inputs
  commentInput: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    minHeight: 110,
  },
  nameInput: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#fff',
  },

  // Submit
  submitBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 20,
  },
  submitGrad: {
    paddingVertical: 22,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2.5,
  },
  submitHint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 6,
  },
  privacyNote: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Thank you screen
  thankYouContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 18,
  },
  thankYouEmoji: {
    fontSize: 80,
  },
  thankYouTitle: {
    fontSize: 52,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: 2,
  },
  thankYouSub: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
    maxWidth: 340,
  },
  overallDisplay: {
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  overallLabelLarge: {
    fontSize: 26,
    fontWeight: '700',
  },
  doneBtn: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  doneBtnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1,
  },
});
