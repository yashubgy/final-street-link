import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAppContext } from '../AppContext';
import { Vendor } from '../types';

// Fix leafet icon issue in react
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icon for vendor
const vendorIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png', // A simple cart icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const MapView = ({ vendors, onVendorClick }: { vendors: Vendor[], onVendorClick: (v: Vendor) => void }) => {
  const { userLocation } = useAppContext();

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm relative z-0 bg-zinc-50 dark:bg-zinc-950 map-bg">
      <MapContainer 
        center={[userLocation.lat, userLocation.lng]} 
        zoom={16} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* User Location */}
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Vendor Locations */}
        {vendors.map((vendor) => (
          <Marker 
            key={vendor.id} 
            position={[vendor.lat, vendor.lng]}
            icon={new L.DivIcon({
              className: 'bg-transparent border-none outline-none',
              html: `
                <div class="relative flex flex-col items-center group cursor-pointer mt-5">
                  <div class="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full border-2 border-white dark:border-zinc-950 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
                     <span class="text-[20px] leading-none">${vendor.category === 'vegetables' ? '🥦' : vendor.category === 'fruits' ? '🍎' : vendor.category === 'milk' ? '🥛' : vendor.category === 'chaat' ? '🌶️' : vendor.category === 'medicine' ? '💊' : vendor.category === 'snacks' ? '🍟' : '🥨'}</span>
                  </div>
                  
                  <div class="mt-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm pointer-events-none transform transition-all whitespace-nowrap opacity-0 group-hover:opacity-100">
                    <span class="text-[12px] font-medium text-zinc-900 dark:text-zinc-100 block text-center">${vendor.name}</span>
                    <span class="text-[10px] text-zinc-500 dark:text-zinc-400 block text-center">${vendor.distance.toFixed(1)} km</span>
                  </div>
                </div>
              `,
              iconSize: [60, 60],
              iconAnchor: [30, 40]
            })}
            eventHandlers={{
              click: () => onVendorClick(vendor),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};
