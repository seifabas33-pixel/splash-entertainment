import React from 'react';
import { Text, View } from 'react-native';
import { BlurView } from 'expo-blur';

export interface LiveLocation {
  lat: number;
  lng: number;
  name: string;
  role: string;
  updatedAt: number;
}

interface Props {
  locations: LiveLocation[];
  roleColors: Record<string, string>;
  noEmployeesText: string;
  locationSharingText: string;
  liveRosterLabel: string;
}

export default function StaffMap({ locations, roleColors, noEmployeesText, locationSharingText, liveRosterLabel }: Props) {
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 2, marginBottom: 4 }}>
        {liveRosterLabel}
      </Text>
      <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 12 }} />

      <BlurView intensity={80} tint="light" style={{
        borderRadius: 16, padding: 32, alignItems: 'center',
        justifyContent: 'center', marginBottom: 12,
        overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
      }}>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>📱</Text>
        <Text style={{ fontSize: 13, color: '#555', fontWeight: '600', textAlign: 'center' }}>
          Live map is available on the mobile app only
        </Text>
      </BlurView>

      {locations.length > 0 && locations.map((loc, i) => (
        <BlurView key={i} intensity={80} tint="light" style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          borderRadius: 12, padding: 12, marginBottom: 8,
          overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
        }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: roleColors[loc.role] ?? '#004AAD' }} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A1A1A', flex: 1 }}>{loc.name}</Text>
          <Text style={{ fontSize: 11, color: '#00C48C', fontWeight: '600' }}>{locationSharingText}</Text>
        </BlurView>
      ))}
    </View>
  );
}
