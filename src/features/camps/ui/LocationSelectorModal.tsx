"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { BiSearch } from "react-icons/bi";

// Dynamically import Leaflet components (client-side only)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const LocationMarker = dynamic(
  () => import("./MapComponents").then((mod) => mod.LocationMarker),
  { ssr: false }
);

export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Coordinates) => void;
  initialLocation?: Coordinates;
}

export default function LocationSelectorModal({
  isOpen,
  onClose,
  onConfirm,
  initialLocation,
}: LocationSelectorModalProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLocation
      ? [initialLocation.latitude, initialLocation.longitude]
      : null
  );
  const [isClient, setIsClient] = useState(false);

  // Default center (Kathmandu, Nepal)
  const defaultCenter: [number, number] = [27.7172, 85.324];

  useEffect(() => {
    setIsClient(true);

    // Fix for default marker icon issue in Next.js
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });
    }
  }, []);

  // Update position if initialLocation changes
  useEffect(() => {
    if (initialLocation) {
      setPosition([initialLocation.latitude, initialLocation.longitude]);
    }
  }, [initialLocation]);

  const handleConfirm = () => {
    if (position) {
      onConfirm({
        latitude: position[0],
        longitude: position[1],
      });
      onClose();
    }
  };

  const handleSearchLocation = async (query: string) => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error("Failed to search location:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Select Coordinates
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Click on the map to set Latitude and Longitude
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Search Box */}
            <div className="p-6 border-b border-gray-200 bg-gray-50 shrink-0">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for a place to center map..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchLocation(e.currentTarget.value);
                      }
                    }}
                  />
                </div>
                <button
                  onClick={(e) => {
                    const input =
                      e.currentTarget.previousElementSibling?.querySelector(
                        "input"
                      ) as HTMLInputElement;
                    if (input) handleSearchLocation(input.value);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Find
                </button>
              </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative min-h-[400px] bg-gray-100">
              {isClient && (
                <MapContainer
                  center={position || defaultCenter}
                  zoom={13}
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                  }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker
                    position={position}
                    setPosition={setPosition}
                  />
                </MapContainer>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-white shrink-0">
              <div className="text-sm text-gray-600">
                {position ? (
                  <div className="flex gap-4">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                      Lat: {position[0].toFixed(6)}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                      Lng: {position[1].toFixed(6)}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">
                    No location selected
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!position}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    position
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Confirm Coordinates
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
