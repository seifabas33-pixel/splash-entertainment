import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width } = Dimensions.get('window');

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

      {locations.length === 0 ? (
        <BlurView intensity={80} tint="light" style={{
          borderRadius: 16, padding: 32, alignItems: 'center',
          justifyContent: 'center', marginBottom: 12,
          overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
        }}>
          <Text style={{ fontSize: 13, color: '#888', fontWeight: '500', textAlign: 'center' }}>
            {noEmployeesText}
          </Text>
        </BlurView>
      ) : (
        <MapView
          style={{ height: width * 0.7, borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{ latitude: 25.133, longitude: 34.661, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
          showsUserLocation
        >
          {locations.map((loc, i) => (
            <Marker
              key={i}
              coordinate={{ latitude: loc.lat, longitude: loc.lng }}
              title={loc.name}
              description={loc.role.toUpperCase()}
              pinColor={roleColors[loc.role] ?? '#004AAD'}
            />
          ))}
        </MapView>
      )}

      {locations.map((loc, i) => (
        <BlurView key={i} intensity={80} tint="light" style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          borderRadius: 12, padding: 12, marginBottom: 8,
          overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
        }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: roleColors[loc.role] ?? '#004AAD' }} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A1A1A', flex: 1 }}>{loc.name}</Text>
          <View style={{ backgroundColor: `${roleColors[loc.role] ?? '#004AAD'}22`, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: roleColors[loc.role] ?? '#004AAD', letterSpacing: 0.5 }}>
              {loc.role.toUpperCase()}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: '#00C48C', fontWeight: '600', letterSpacing: 0.3 }}>
            {locationSharingText}
          </Text>
        </BlurView>
      ))}
    </View>
  );
}
