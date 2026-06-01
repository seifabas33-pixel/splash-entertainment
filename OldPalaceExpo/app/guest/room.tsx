import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Brand } from '@/constants/theme';
import {
  ServiceCategory,
  ServiceCategoryId,
  ServiceItem,
  SERVICE_CATEGORIES,
} from '@/data/roomService';
import { useLanguage } from '@/context/LanguageContext';

const BG_IMAGE = require('@/assets/images/resort_lobby.webp');

// ─── Types ────────────────────────────────────────────────────────────────────

interface ItemSelection {
  quantity: number;
  note: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RoomServiceScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<ServiceCategoryId | null>(null);
  const [selections, setSelections] = useState<Map<string, ItemSelection>>(
    new Map(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedCategory = SERVICE_CATEGORIES.find(
    (c) => c.id === selectedCategoryId,
  );

  const totalItems = Array.from(selections.values()).reduce(
    (sum, s) => sum + s.quantity,
    0,
  );

  const maxEstimate = selectedCategory
    ? Math.max(
        ...selectedCategory.items
          .filter((i) => (selections.get(i.id)?.quantity ?? 0) > 0)
          .map((i) => i.estimatedMinutes),
        0,
      )
    : 0;

  // ─── Item helpers ──────────────────────────────────────────────────────────

  const increment = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelections((prev) => {
      const next = new Map(prev);
      const cur = next.get(id) ?? { quantity: 0, note: '' };
      next.set(id, { ...cur, quantity: cur.quantity + 1 });
      return next;
    });
  };

  const decrement = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelections((prev) => {
      const next = new Map(prev);
      const cur = next.get(id);
      if (!cur || cur.quantity <= 1) next.delete(id);
      else next.set(id, { ...cur, quantity: cur.quantity - 1 });
      return next;
    });
  };

  const toggle = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelections((prev) => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else next.set(id, { quantity: 1, note: '' });
      return next;
    });
  };

  const updateNote = (id: string, note: string) => {
    setSelections((prev) => {
      const next = new Map(prev);
      const cur = next.get(id);
      if (cur) next.set(id, { ...cur, note });
      return next;
    });
  };

  const selectCategory = (id: ServiceCategoryId) => {
    setSelectedCategoryId(id);
    setSelections(new Map());
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelectedCategoryId(null);
    setSelections(new Map());
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      {submitted ? (
        <ConfirmationView
          category={selectedCategory!}
          maxEstimate={maxEstimate}
          onReset={handleReset}
          onBack={() => router.back()}
          t={t}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ─── Hero ─── */}
          <ImageBackground source={BG_IMAGE} style={styles.hero} resizeMode="cover">
            <View style={styles.heroOverlay}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Text style={styles.backText}>{t('back_guest')}</Text>
              </TouchableOpacity>
              <View style={styles.heroBottom}>
                <Text style={styles.heroLabel}>HILTON MARSA ALAM</Text>
                <Text style={styles.heroTitle}>{t('room_service')}</Text>
                <View style={styles.heroDivider} />
                <Text style={styles.heroSub}>🔑 Room 412</Text>
              </View>
            </View>
          </ImageBackground>

          <View style={styles.content}>

            {/* ─── Category selector ─── */}
            <Text style={styles.sectionLabel}>{t('what_need')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {SERVICE_CATEGORIES.map((cat) => {
                const active = selectedCategoryId === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => selectCategory(cat.id)}
                    activeOpacity={0.75}
                  >
                    <BlurView
                      intensity={active ? 90 : 65}
                      tint="light"
                      style={[styles.categoryCard, active && styles.categoryCardActive]}
                    >
                      <Text style={styles.categoryCardIcon}>{cat.icon}</Text>
                      <Text
                        style={[
                          styles.categoryCardLabel,
                          active && styles.categoryCardLabelActive,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </BlurView>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* ─── Items ─── */}
            {selectedCategory ? (
              <>
                <Text style={styles.categoryDesc}>{selectedCategory.description}</Text>

                {selectedCategory.items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    selection={selections.get(item.id) ?? null}
                    onIncrement={() => increment(item.id)}
                    onDecrement={() => decrement(item.id)}
                    onToggle={() => toggle(item.id)}
                    onNoteChange={(note) => updateNote(item.id, note)}
                    t={t}
                  />
                ))}

                {totalItems > 0 && (
                  <TouchableOpacity
                    style={[styles.submitBtn, submitting && styles.submitBtnLoading]}
                    onPress={handleSubmit}
                    disabled={submitting}
                    activeOpacity={0.85}
                  >
                    {submitting ? (
                      <ActivityIndicator color={Brand.white} />
                    ) : (
                      <Text style={styles.submitBtnText}>
                        {t(totalItems !== 1 ? 'send_request_plural' : 'send_request', { n: String(totalItems) })}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <BlurView intensity={70} tint="light" style={styles.placeholderCard}>
                <Text style={styles.placeholderText}>{t('select_category')}</Text>
              </BlurView>
            )}
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

// ─── Item card ────────────────────────────────────────────────────────────────

function ItemCard({
  item,
  selection,
  onIncrement,
  onDecrement,
  onToggle,
  onNoteChange,
  t,
}: {
  item: ServiceItem;
  selection: ItemSelection | null;
  onIncrement: () => void;
  onDecrement: () => void;
  onToggle: () => void;
  onNoteChange: (note: string) => void;
  t: (k: string, p?: Record<string, string>) => string;
}) {
  const quantity = selection?.quantity ?? 0;
  const added = quantity > 0;

  return (
    <BlurView intensity={75} tint="light" style={styles.itemCard}>
      <View style={styles.itemRow}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemLabel}>{item.label}</Text>
          {item.description && (
            <Text style={styles.itemDesc}>{item.description}</Text>
          )}
          <Text style={styles.itemEstimate}>{t('min_wait', { n: String(item.estimatedMinutes) })}</Text>
        </View>

        {item.requiresQuantity ? (
          <View style={styles.qtySelector}>
            <TouchableOpacity
              style={[styles.qtyBtn, !added && styles.qtyBtnDisabled]}
              onPress={onDecrement}
              disabled={!added}
              activeOpacity={0.7}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={onIncrement}
              activeOpacity={0.7}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.toggleBtn, added && styles.toggleBtnActive]}
            onPress={onToggle}
            activeOpacity={0.75}
          >
            <Text style={[styles.toggleBtnText, added && styles.toggleBtnTextActive]}>
              {added ? t('item_added') : t('item_add')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {item.requiresNote && added && (
        <TextInput
          style={styles.noteInput}
          placeholder={t('note_placeholder')}
          placeholderTextColor="#AAA"
          value={selection?.note ?? ''}
          onChangeText={onNoteChange}
          multiline
          maxLength={120}
        />
      )}
    </BlurView>
  );
}

// ─── Confirmation view ────────────────────────────────────────────────────────

function ConfirmationView({
  category,
  maxEstimate,
  onReset,
  onBack,
  t,
}: {
  category: ServiceCategory;
  maxEstimate: number;
  onReset: () => void;
  onBack: () => void;
  t: (k: string, p?: Record<string, string>) => string;
}) {
  return (
    <ImageBackground source={BG_IMAGE} style={styles.confirmBg} resizeMode="cover">
      <View style={styles.confirmOverlay}>
        <BlurView intensity={90} tint="light" style={styles.confirmCard}>
          <Text style={styles.confirmIcon}>✅</Text>
          <Text style={styles.confirmTitle}>{t('request_sent')}</Text>
          <Text style={styles.confirmDesc}>
            {t('request_received', { category: category.label })}
          </Text>

          {maxEstimate > 0 && (
            <View style={styles.estimateBanner}>
              <Text style={styles.estimateText}>
                {t('estimated_response', { n: String(maxEstimate) })}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.newRequestBtn}
            onPress={onReset}
            activeOpacity={0.8}
          >
            <Text style={styles.newRequestText}>{t('another_request')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backLinkText}>{t('back_dashboard')}</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </ImageBackground>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    height: 200,
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
    fontSize: 28,
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
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 20,
    marginTop: -16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Brand.navy,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  // Category scroll
  categoryScroll: {
    marginBottom: 20,
  },
  categoryScrollContent: {
    gap: 10,
    paddingRight: 4,
    flexDirection: 'row',
  },
  categoryCard: {
    width: 100,
    borderRadius: 16,
    padding: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
  },
  categoryCardActive: {
    borderWidth: 2,
    borderColor: Brand.navy,
  },
  categoryCardIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  categoryCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
  },
  categoryCardLabelActive: {
    color: Brand.navy,
  },
  categoryDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    fontWeight: '500',
  },
  // Item card
  itemCard: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  itemDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemEstimate: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  // Quantity selector
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Brand.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnDisabled: {
    backgroundColor: 'rgba(0,74,173,0.25)',
  },
  qtyBtnText: {
    fontSize: 18,
    color: Brand.white,
    fontWeight: '600',
    lineHeight: 22,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    minWidth: 20,
    textAlign: 'center',
  },
  // Toggle button
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Brand.navy,
    backgroundColor: 'transparent',
  },
  toggleBtnActive: {
    backgroundColor: Brand.navy,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.navy,
  },
  toggleBtnTextActive: {
    color: Brand.white,
  },
  // Note input
  noteInput: {
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    padding: 10,
    fontSize: 13,
    color: '#333',
    minHeight: 44,
  },
  // Submit
  submitBtn: {
    backgroundColor: Brand.navy,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Brand.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnLoading: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: Brand.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Placeholder
  placeholderCard: {
    borderRadius: 16,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Confirmation
  confirmBg: {
    flex: 1,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: Brand.overlayDark,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  confirmCard: {
    borderRadius: 28,
    padding: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
  },
  confirmIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  confirmDesc: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  estimateBanner: {
    backgroundColor: Brand.statusComplete.bg,
    borderWidth: 1,
    borderColor: Brand.statusComplete.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 24,
  },
  estimateText: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.statusComplete.text,
  },
  newRequestBtn: {
    backgroundColor: Brand.navy,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  newRequestText: {
    color: Brand.white,
    fontSize: 15,
    fontWeight: '700',
  },
  backLinkText: {
    fontSize: 14,
    color: Brand.navy,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
