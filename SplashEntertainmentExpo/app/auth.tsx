import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
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
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Brand } from '@/constants/theme';

const BG_IMAGE = require('@/assets/images/resort_pool.webp');
const CARD_MAX  = 420;

export default function AuthScreen() {
  const router = useRouter();
  const { login, register, isAuthenticated, isPending, loading: authLoading } = useAuth();

  const [mode,         setMode]         = useState<'signin' | 'signup'>('signin');
  const [name,         setName]         = useState('');
  const [email,        setEmail]        = useState('');
  const [whatsapp,     setWhatsapp]     = useState('');
  const [password,     setPassword]     = useState('');
  const [showPass,     setShowPass]     = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [idPhoto,      setIdPhoto]      = useState<string>('');
  const [error,        setError]        = useState<string | null>(null);
  const [busy,         setBusy]         = useState(false);

  // Entrance animation
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 480, useNativeDriver: true }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate once authenticated or pending
  useEffect(() => {
    if (!authLoading && (isAuthenticated || isPending)) router.replace('/entertainer');
  }, [isAuthenticated, isPending, authLoading]);

  const switchMode = (next: 'signin' | 'signup') => {
    setMode(next);
    setError(null);
  };

  const pickPhoto = useCallback(async (type: 'profile' | 'id') => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      setError('Please allow access to your photos in Settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'profile' ? [1, 1] : [4, 3],
      quality: 0.35,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      const b64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      if (type === 'profile') setProfilePhoto(b64);
      else setIdPhoto(b64);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    setError(null);
    const em = email.trim().toLowerCase();
    if (!em)            { setError('Please enter your email.');    return; }
    if (!password)      { setError('Please enter your password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    if (mode === 'signup') {
      if (!name.trim())    { setError('Please enter your full name.'); return; }
      if (!whatsapp.trim()) { setError('Please enter your WhatsApp number.'); return; }
      if (!profilePhoto)   { setError('Please upload your profile photo.'); return; }
      if (!idPhoto)        { setError('Please upload your ID or Passport photo.'); return; }
    }

    setBusy(true);
    try {
      if (mode === 'signin') {
        const res = await login(em, password);
        if (!res.success) {
          setError(res.error === 'invalid_credentials'
            ? 'Incorrect email or password.'
            : 'Connection error — please try again.');
          setBusy(false);
        }
        // On success: keep spinner — navigation effect will fire when isAuthenticated becomes true
      } else {
        const res = await register(name.trim(), em, password, whatsapp.trim(), profilePhoto, idPhoto);
        if (!res.success) {
          if (res.error === 'email_taken')        setError('This email is already registered. Sign in instead.');
          else if (res.error === 'weak_password') setError('Password too weak — use at least 6 characters.');
          else setError('Connection error — please try again.');
          setBusy(false);
        }
        // On success: keep spinner — navigation effect will fire when isPending becomes true
      }
    } catch {
      setError('Connection error — please try again.');
      setBusy(false);
    }
  }, [mode, name, email, whatsapp, password, profilePhoto, idPhoto, login, register]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      <ImageBackground source={BG_IMAGE} style={styles.bg} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0.50)', 'rgba(0,10,40,0.88)']}
        style={styles.bg}
      />

      <Animated.ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ opacity: fade, transform: [{ translateY: slide }] }}
      >
        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoMark}>🌊</Text>
          <Text style={styles.title}>STAFF PORTAL</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </Text>
        </View>

        {/* Card */}
        <BlurView intensity={28} tint="dark" style={styles.card}>

          {/* SIGN IN / SIGN UP toggle */}
          <View style={styles.modeRow}>
            {(['signin', 'signup'] as const).map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
                onPress={() => switchMode(m)}
                activeOpacity={0.75}
              >
                <Text style={[styles.modeTxt, mode === m && styles.modeTxtActive]}>
                  {m === 'signin' ? 'SIGN IN' : 'SIGN UP'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── SIGNUP-ONLY FIELDS ── */}
          {mode === 'signup' && (
            <>
              <Field label="FULL NAME" value={name} onChangeText={setName}
                placeholder="Your full name" autoCapitalize="words" returnKeyType="next" />

              <Field label="WHATSAPP NUMBER" value={whatsapp} onChangeText={setWhatsapp}
                placeholder="+20 100 000 0000" keyboardType="phone-pad" returnKeyType="next" />

              {/* Profile Photo */}
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>PROFILE PHOTO</Text>
                <TouchableOpacity style={styles.photoBtn} onPress={() => pickPhoto('profile')} activeOpacity={0.8}>
                  {profilePhoto
                    ? <Image source={{ uri: profilePhoto }} style={styles.photoThumb} />
                    : <Text style={styles.photoBtnTxt}>📷  Tap to upload photo</Text>
                  }
                </TouchableOpacity>
              </View>

              {/* ID / Passport Photo */}
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>ID / PASSPORT PHOTO</Text>
                <TouchableOpacity style={[styles.photoBtn, styles.photoBtnId]} onPress={() => pickPhoto('id')} activeOpacity={0.8}>
                  {idPhoto
                    ? <Image source={{ uri: idPhoto }} style={styles.photoThumbId} />
                    : <Text style={styles.photoBtnTxt}>🪪  Tap to upload ID / Passport</Text>
                  }
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Email */}
          <Field label="EMAIL" value={email} onChangeText={setEmail}
            placeholder="you@gmail.com" keyboardType="email-address"
            autoCapitalize="none" autoCorrect={false} returnKeyType="next" />

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.passRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••'}
                placeholderTextColor="rgba(255,255,255,0.3)"
                secureTextEntry={!showPass}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass((v) => !v)} activeOpacity={0.7}>
                <Text style={styles.eyeTxt}>{showPass ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Error message */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorTxt}>{error}</Text>
            </View>
          )}

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.submitBtn, busy && { opacity: 0.65 }]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={busy}
          >
            {busy
              ? (
                <View style={{ alignItems: 'center', gap: 6 }}>
                  <ActivityIndicator color={Brand.white} />
                  <Text style={styles.busyTxt}>
                    {mode === 'signup' ? 'Uploading photos…' : 'Signing in…'}
                  </Text>
                </View>
              )
              : <Text style={styles.submitTxt}>
                  {mode === 'signin' ? 'SIGN IN' : 'SUBMIT REQUEST'}
                </Text>
            }
          </TouchableOpacity>

          {mode === 'signup' && (
            <View style={styles.noteBox}>
              <Text style={styles.noteTxt}>
                Your account will be reviewed by an admin before you can access the app.
              </Text>
            </View>
          )}

          {/* Switch mode hint */}
          <View style={styles.switchRow}>
            <Text style={styles.switchHint}>
              {mode === 'signin' ? "Don't have an account? " : 'Already registered? '}
            </Text>
            <TouchableOpacity onPress={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}>
              <Text style={styles.switchLink}>
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </Text>
            </TouchableOpacity>
          </View>

        </BlurView>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Field helper ─────────────────────────────────────────────────────────────

function Field({
  label, value, onChangeText, placeholder,
  keyboardType, autoCapitalize, autoCorrect, returnKeyType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'words' | 'sentences';
  autoCorrect?: boolean;
  returnKeyType?: 'next' | 'done';
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.3)"
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        autoCorrect={autoCorrect ?? true}
        returnKeyType={returnKeyType ?? 'done'}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg:   { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 48,
  },
  backBtn: { position: 'absolute', top: 60, left: 24, zIndex: 10, paddingVertical: 4 },
  backText: { fontSize: 13, color: Brand.white, fontWeight: '700', letterSpacing: 2 },
  header: { alignItems: 'center', marginBottom: 36 },
  logoMark: { fontSize: 40, marginBottom: 14 },
  title: { fontSize: 30, fontWeight: '200', color: Brand.white, letterSpacing: 9 },
  divider: { width: 48, height: 2, backgroundColor: Brand.turquoise, marginVertical: 14, borderRadius: 1 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: '500', letterSpacing: 0.5 },
  card: {
    borderRadius: 28, paddingVertical: 30, paddingHorizontal: 26,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)',
    maxWidth: CARD_MAX, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 24, elevation: 10,
  },
  modeRow: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14, padding: 4, marginBottom: 26,
  },
  modeBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },
  modeBtnActive: { backgroundColor: Brand.navy, shadowColor: Brand.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 },
  modeTxt: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 1.5 },
  modeTxtActive: { color: Brand.white },
  fieldWrap: { marginBottom: 18 },
  label: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5, marginBottom: 8 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.09)', borderRadius: 13,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: Brand.white,
  },
  passRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { width: 44, height: 50, alignItems: 'center', justifyContent: 'center' },
  eyeTxt: { fontSize: 18 },
  // Photo buttons
  photoBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 13,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)',
    height: 100, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  photoBtnId: { height: 86 },
  photoBtnTxt: { fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: '600', letterSpacing: 0.3 },
  photoThumb: { width: 92, height: 92, borderRadius: 12 },
  photoThumbId: { width: '100%', height: 84, borderRadius: 12 },
  // Error / note
  errorBox: {
    backgroundColor: 'rgba(255,80,80,0.13)', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(255,80,80,0.4)',
    paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16,
  },
  errorTxt: { fontSize: 13, color: '#FF7070', fontWeight: '600', textAlign: 'center', lineHeight: 20 },
  noteBox: {
    backgroundColor: 'rgba(255,200,0,0.08)', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(255,200,0,0.25)',
    paddingHorizontal: 16, paddingVertical: 12, marginTop: 14,
  },
  noteTxt: { fontSize: 13, color: 'rgba(255,220,80,0.9)', textAlign: 'center', lineHeight: 20 },
  submitBtn: {
    backgroundColor: Brand.navy, borderRadius: 16, paddingVertical: 17,
    alignItems: 'center', marginTop: 6,
    shadowColor: Brand.navy, shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
  submitTxt: { color: Brand.white, fontSize: 15, fontWeight: '800', letterSpacing: 2 },
  busyTxt:   { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '500' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 22 },
  switchHint: { fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: '500' },
  switchLink: { fontSize: 14, color: Brand.turquoise, fontWeight: '700', textDecorationLine: 'underline' },
});
