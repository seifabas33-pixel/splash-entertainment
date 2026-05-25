import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  Linking,
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
import { Brand } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';
import {
  Facility,
  FACILITIES,
  getFacilitiesForZone,
  getPoolsForZone,
  POOLS,
  ResortZone,
  RESORT_ZONES,
} from '@/data/resort';
import { BARS, RESTAURANTS } from '@/data/dining';

// ─── Local image resolver ─────────────────────────────────────────────────────
const LOCAL_IMAGES: Record<string, ReturnType<typeof require>> = {
  resort_beach: require('@/assets/images/resort_beach.webp'),
  resort_lobby: require('@/assets/images/resort_lobby.webp'),
  resort_pool:  require('@/assets/images/resort_pool.webp'),
};

function resolveImage(key: string): ImageSourcePropType {
  return (LOCAL_IMAGES[key] ?? LOCAL_IMAGES['resort_pool']) as ImageSourcePropType;
}

const MAPS_URL = 'https://maps.google.com/?q=Hilton+Marsa+Alam+Nubian+Resort,Abu+Dabbab+Bay,Marsa+Alam,Egypt';

// ─── Search & locate ─────────────────────────────────────────────────────────

type TabId = 'All' | 'Pools' | 'Dining' | 'Bars' | 'Facilities';

type SearchItem = {
  id:       string;
  name:     string;
  icon:     string;
  category: Exclude<TabId, 'All'>;
  location: string;
  hours:    string | null;
};

const POOL_LOCATIONS: Record<string, string> = {
  'pool-01': 'Pool Complex · Main entertainment area',
  'pool-02': 'Pool Complex · East side, adults-only',
  'pool-03': 'Pool Complex · Family area',
  'pool-04': 'Pool Complex · Family area',
  'pool-05': 'Kids Zone · Beside Kids Club',
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Pools:      { bg: 'rgba(0,180,216,0.13)',  text: '#006B87' },
  Dining:     { bg: 'rgba(245,158,11,0.15)', text: '#92400E' },
  Bars:       { bg: 'rgba(139,92,246,0.13)', text: '#4C1D95' },
  Facilities: { bg: 'rgba(0,74,173,0.11)',   text: Brand.navy },
};

const TABS: { id: TabId; labelKey: string }[] = [
  { id: 'All',        labelKey: 'tab_all' },
  { id: 'Pools',      labelKey: 'tab_pools' },
  { id: 'Dining',     labelKey: 'tab_dining' },
  { id: 'Bars',       labelKey: 'tab_bars' },
  { id: 'Facilities', labelKey: 'tab_facilities' },
];

const ALL_ITEMS: SearchItem[] = [
  ...POOLS.map((p) => ({
    id: p.id, name: p.name, icon: '🏊', category: 'Pools' as const,
    location: POOL_LOCATIONS[p.id] ?? 'Pool Complex',
    hours: null,
  })),
  ...RESTAURANTS.map((r) => ({
    id: r.id, name: r.name, icon: r.icon, category: 'Dining' as const,
    location: r.location,
    hours: r.periods.map((p) => p.label.charAt(0)).join('/'),
  })),
  ...BARS.map((b) => ({
    id: b.id, name: b.name, icon: b.icon, category: 'Bars' as const,
    location: b.location,
    hours: `${b.openTime} – ${b.closeTime}`,
  })),
  ...FACILITIES.map((f) => ({
    id: f.id, name: f.name, icon: f.icon, category: 'Facilities' as const,
    location: f.location,
    hours: f.openHours,
  })),
];

const AGE_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  All:    { bg: 'rgba(0,74,173,0.12)',    text: Brand.navy },
  Adults: { bg: 'rgba(103,58,183,0.14)',  text: '#512DA8' },
  Family: { bg: 'rgba(0,180,216,0.14)',   text: Brand.turquoiseDark },
  Kids:   { bg: 'rgba(255,165,0,0.16)',   text: '#B8660A' },
};

export default function MapScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState<ResortZone | null>(null);
  const [expandedFacilityId, setExpandedFacilityId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('All');

  const isSearching = searchQuery.trim().length > 0 || activeTab !== 'All';

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_ITEMS.filter((item) => {
      const matchesTab = activeTab === 'All' || item.category === activeTab;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [searchQuery, activeTab]);

  const toggleFacility = (id: string) =>
    setExpandedFacilityId((prev) => (prev === id ? null : id));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Hero ─── */}
        <ImageBackground
          source={resolveImage('resort_beach')}
          style={styles.hero}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <TouchableOpacity
              onPress={selectedZone ? () => { setSelectedZone(null); setExpandedFacilityId(null); } : () => router.back()}
              style={styles.backBtn}
            >
              <Text style={styles.backText}>
                {selectedZone ? t('back_zones') : t('back_guest')}
              </Text>
            </TouchableOpacity>
            <View style={styles.heroBottom}>
              <Text style={styles.heroLabel}>{t('resort_facilities')}</Text>
              <Text style={styles.heroTitle}>
                {selectedZone ? selectedZone.name : t('resort_map')}
              </Text>
              <View style={styles.heroDivider} />
              <Text style={styles.heroSub}>📍 Abu Dabbab Bay · Marsa Alam, Egypt</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.content}>

          {!selectedZone ? (
            // ─── OVERVIEW ───────────────────────────────────────────────────
            <>
              {/* ─── Search bar ─── */}
              <View style={styles.searchBar}>
                <Text style={styles.searchIconText}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder={t('search_placeholder')}
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                    <Text style={styles.clearBtnText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Category tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsRow}
              >
                {TABS.map((tab) => (
                  <TouchableOpacity
                    key={tab.id}
                    style={[styles.tabPill, activeTab === tab.id && styles.tabPillActive]}
                    onPress={() => setActiveTab(tab.id)}
                  >
                    <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                      {t(tab.labelKey)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {isSearching ? (
                // ─── SEARCH RESULTS ───────────────────────────────────────
                filtered.length > 0 ? (
                  filtered.map((item) => <SearchResultCard key={item.id} item={item} />)
                ) : (
                  <BlurView intensity={70} tint="light" style={styles.emptyCard}>
                    <Text style={styles.emptyText}>
                      {t('no_results', {
                        q: searchQuery.trim() ||
                          t(TABS.find((tb) => tb.id === activeTab)?.labelKey ?? 'tab_all'),
                      })}
                    </Text>
                  </BlurView>
                )
              ) : (
              // ─── DEFAULT OVERVIEW ─────────────────────────────────────
              <>
              {/* Find Us card */}
              <BlurView intensity={85} tint="light" style={styles.findUsCard}>
                {/* Navy coordinates section */}
                <View style={styles.coordsSection}>
                  <View style={[styles.dot, { top: 14, left: 18 }]} />
                  <View style={[styles.dot, { top: 14, right: 18 }]} />
                  <View style={[styles.dot, { bottom: 14, left: 18 }]} />
                  <View style={[styles.dot, { bottom: 14, right: 18 }]} />
                  <View style={[styles.dot, { top: 14, left: '33%' }]} />
                  <View style={[styles.dot, { top: 14, right: '33%' }]} />
                  <View style={[styles.dot, { bottom: 14, left: '33%' }]} />
                  <View style={[styles.dot, { bottom: 14, right: '33%' }]} />
                  <Text style={styles.coordCompass}>🧭</Text>
                  <Text style={styles.coordText}>24° 35′ N  ·  34° 55′ E</Text>
                  <View style={styles.coordDivider} />
                  <Text style={styles.coordLocation}>MARSA ALAM  ·  RED SEA  ·  EGYPT</Text>
                </View>
                {/* Hotel name + directions button */}
                <View style={styles.findUsBottom}>
                  <View style={styles.findUsInfo}>
                    <Text style={styles.findUsLabel}>{t('find_us').toUpperCase()}</Text>
                    <Text style={styles.findUsHotelLine}>Hilton Marsa Alam Nubian Resort</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.directionsBtn}
                    onPress={() => Linking.openURL(MAPS_URL)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.directionsBtnText}>{t('get_directions')} →</Text>
                  </TouchableOpacity>
                </View>
              </BlurView>

              {/* Info banner */}
              <BlurView intensity={80} tint="light" style={styles.infoBanner}>
                <Text style={styles.infoText}>{t('resort_info')}</Text>
                <Text style={styles.infoSub}>{t('tap_zone')}</Text>
              </BlurView>

              {/* Zone grid */}
              <View style={styles.zoneGrid}>
                {RESORT_ZONES.map((zone) => (
                  <TouchableOpacity
                    key={zone.id}
                    style={styles.zoneCardWrapper}
                    onPress={() => { setSelectedZone(zone); setExpandedFacilityId(null); }}
                    activeOpacity={0.75}
                  >
                    <BlurView intensity={70} tint="light" style={styles.zoneCard}>
                      <View
                        style={[styles.zoneAccentBar, { backgroundColor: zone.accentColor }]}
                      />
                      <Text style={styles.zoneIcon}>{zone.icon}</Text>
                      <Text style={styles.zoneName}>{zone.name}</Text>
                      <Text style={styles.zoneDesc} numberOfLines={3}>
                        {zone.description}
                      </Text>
                      <Text style={styles.zoneChevron}>→</Text>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Pool summary */}
              <Text style={styles.sectionLabel}>{t('pools_glance')}</Text>
              <BlurView intensity={75} tint="light" style={styles.poolSummaryCard}>
                {POOLS.map((pool, idx) => {
                  const ag = AGE_BADGE_COLORS[pool.ageGroup];
                  return (
                    <View
                      key={pool.id}
                      style={[styles.poolRow, idx < POOLS.length - 1 && styles.poolRowBorder]}
                    >
                      <Text style={styles.poolName}>{pool.name}</Text>
                      <View
                        style={[styles.ageBadge, { backgroundColor: ag.bg }]}
                      >
                        <Text style={[styles.ageBadgeText, { color: ag.text }]}>
                          {pool.ageGroup}
                        </Text>
                      </View>
                      <Text style={styles.poolArea}>{pool.areaM2} m²</Text>
                    </View>
                  );
                })}
              </BlurView>
              </>)}
            </>
          ) : (
            // ─── ZONE DETAIL ─────────────────────────────────────────────────
            <>
              {/* Zone hero card */}
              <BlurView intensity={85} tint="light" style={styles.zoneHeroCard}>
                <Text style={styles.zoneHeroIcon}>{selectedZone.icon}</Text>
                <View style={styles.zoneHeroText}>
                  <Text style={styles.zoneHeroName}>{selectedZone.name}</Text>
                  <Text style={styles.zoneHeroDesc}>{selectedZone.description}</Text>
                </View>
                <View
                  style={[
                    styles.zoneAccentDot,
                    { backgroundColor: selectedZone.accentColor },
                  ]}
                />
              </BlurView>

              {/* Pools in this zone */}
              {getPoolsForZone(selectedZone).length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>{t('pools_section')}</Text>
                  {getPoolsForZone(selectedZone).map((pool) => {
                    const ag = AGE_BADGE_COLORS[pool.ageGroup];
                    return (
                      <BlurView key={pool.id} intensity={70} tint="light" style={styles.poolDetailCard}>
                        <View style={styles.poolDetailHeader}>
                          <Text style={styles.poolDetailName}>{pool.name}</Text>
                          <View style={[styles.ageBadge, { backgroundColor: ag.bg }]}>
                            <Text style={[styles.ageBadgeText, { color: ag.text }]}>
                              {pool.ageGroup}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.poolDetailDesc}>{pool.description}</Text>
                        <View style={styles.poolFeatures}>
                          {pool.features.map((f) => (
                            <View key={f} style={styles.featureChip}>
                              <Text style={styles.featureText}>{f}</Text>
                            </View>
                          ))}
                        </View>
                        {pool.depthNote && (
                          <Text style={styles.depthNote}>💧 {pool.depthNote}</Text>
                        )}
                        <Text style={styles.poolAreaDetail}>📐 {pool.areaM2} m²</Text>
                      </BlurView>
                    );
                  })}
                </>
              )}

              {/* Facilities in this zone */}
              {getFacilitiesForZone(selectedZone).length > 0 && (
                <>
                  <Text style={styles.sectionLabel}>{t('facilities_section')}</Text>
                  {getFacilitiesForZone(selectedZone).map((facility) => (
                    <FacilityAccordion
                      key={facility.id}
                      facility={facility}
                      expanded={expandedFacilityId === facility.id}
                      onToggle={() => toggleFacility(facility.id)}
                    />
                  ))}
                </>
              )}

              {getFacilitiesForZone(selectedZone).length === 0 &&
                getPoolsForZone(selectedZone).length === 0 && (
                  <BlurView intensity={70} tint="light" style={styles.emptyCard}>
                    <Text style={styles.emptyText}>{t('see_dining')}</Text>
                  </BlurView>
                )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Facility accordion row ───────────────────────────────────────────────────

function FacilityAccordion({
  facility,
  expanded,
  onToggle,
}: {
  facility: Facility;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
      <BlurView intensity={70} tint="light" style={styles.facilityCard}>
        <View style={styles.facilityHeader}>
          <Text style={styles.facilityIcon}>{facility.icon}</Text>
          <Text style={styles.facilityName}>{facility.name}</Text>
          <Text style={styles.facilityChevron}>{expanded ? '▲' : '▼'}</Text>
        </View>

        {expanded && (
          <View style={styles.facilityDetail}>
            <Text style={styles.facilityDesc}>{facility.description}</Text>
            <View style={styles.facilityMeta}>
              <Text style={styles.facilityMetaRow}>🕐  {facility.openHours}</Text>
              {facility.priceNote && (
                <Text style={styles.facilityMetaRow}>💰  {facility.priceNote}</Text>
              )}
              <Text style={styles.facilityMetaRow}>📍  {facility.location}</Text>
            </View>
          </View>
        )}
      </BlurView>
    </TouchableOpacity>
  );
}

// ─── Search result card ───────────────────────────────────────────────────────

function SearchResultCard({ item }: { item: SearchItem }) {
  const { t } = useLanguage();
  const col = CATEGORY_COLORS[item.category] ?? { bg: 'rgba(0,0,0,0.06)', text: '#555' };
  const categoryLabel = t(`tab_${item.category.toLowerCase()}`);
  return (
    <BlurView intensity={70} tint="light" style={styles.resultCard}>
      <Text style={styles.resultIcon}>{item.icon}</Text>
      <View style={styles.resultBody}>
        <View style={styles.resultHeaderRow}>
          <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
          <View style={[styles.resultBadge, { backgroundColor: col.bg }]}>
            <Text style={[styles.resultBadgeText, { color: col.text }]}>{categoryLabel}</Text>
          </View>
        </View>
        <Text style={styles.resultLocation}>📍  {item.location}</Text>
        {item.hours && <Text style={styles.resultHours}>🕐  {item.hours}</Text>}
      </View>
    </BlurView>
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
    height: 240,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: Brand.overlayDark,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
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
    marginTop: -18,
  },
  // Info banner
  infoBanner: {
    borderRadius: 18,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  infoSub: {
    fontSize: 12,
    color: '#777',
  },
  // Zone grid
  zoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  zoneCardWrapper: {
    width: '47%',
    marginBottom: 16,
  },
  zoneCard: {
    borderRadius: 20,
    padding: 18,
    minHeight: 170,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  zoneAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  zoneIcon: {
    fontSize: 28,
    marginTop: 10,
    marginBottom: 8,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  zoneDesc: {
    fontSize: 11,
    color: '#555',
    lineHeight: 16,
    flex: 1,
  },
  zoneChevron: {
    fontSize: 16,
    color: Brand.navy,
    fontWeight: '700',
    marginTop: 8,
  },
  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Brand.navy,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4,
  },
  // Pool summary
  poolSummaryCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  poolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  poolRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  poolName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  ageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ageBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  poolArea: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    minWidth: 56,
    textAlign: 'right',
  },
  // Zone hero card
  zoneHeroCard: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  zoneHeroIcon: {
    fontSize: 36,
  },
  zoneHeroText: {
    flex: 1,
  },
  zoneHeroName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  zoneHeroDesc: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  zoneAccentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  // Pool detail card
  poolDetailCard: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  poolDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  poolDetailName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
  },
  poolDetailDesc: {
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 18,
    marginBottom: 10,
  },
  poolFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  featureChip: {
    backgroundColor: 'rgba(0,180,216,0.10)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  featureText: {
    fontSize: 11,
    color: Brand.turquoiseDark,
    fontWeight: '600',
  },
  depthNote: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  poolAreaDetail: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  // Facility accordion
  facilityCard: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
  },
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  facilityIcon: {
    fontSize: 20,
  },
  facilityName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  facilityChevron: {
    fontSize: 12,
    color: Brand.navy,
    fontWeight: '700',
  },
  facilityDetail: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 12,
  },
  facilityDesc: {
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 19,
    marginBottom: 10,
  },
  facilityMeta: {
    gap: 6,
  },
  facilityMetaRow: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  // Empty state
  emptyCard: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 19,
  },
  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 8,
  },
  searchIconText: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  // Category tabs
  tabsRow: {
    paddingBottom: 16,
    gap: 8,
    flexDirection: 'row',
  },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  tabPillActive: {
    backgroundColor: Brand.navy,
    borderColor: Brand.navy,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  tabTextActive: {
    color: Brand.white,
  },
  // Search result card
  resultCard: {
    borderRadius: 16,
    padding: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  resultIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  resultBody: {
    flex: 1,
  },
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  resultName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  resultBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  resultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  resultLocation: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
    marginBottom: 2,
  },
  resultHours: {
    fontSize: 12,
    color: '#777',
  },
  // Find Us / Coordinates card
  findUsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  coordsSection: {
    backgroundColor: Brand.navy,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  dot: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  coordCompass: {
    fontSize: 38,
    marginBottom: 14,
  },
  coordText: {
    fontSize: 22,
    fontWeight: '300',
    color: Brand.white,
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  coordDivider: {
    width: 40,
    height: 2,
    backgroundColor: Brand.turquoise,
    marginBottom: 12,
  },
  coordLocation: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 2.5,
  },
  findUsBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  findUsInfo: {
    flex: 1,
  },
  findUsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Brand.navy,
    letterSpacing: 2,
    marginBottom: 4,
  },
  findUsHotelLine: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  directionsBtn: {
    backgroundColor: Brand.navy,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  directionsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.white,
    letterSpacing: 0.3,
  },
});
