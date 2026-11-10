import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  MapPin,
  ZoomIn,
  ZoomOut,
  Layers,
  Crosshair,
  GraduationCap,
  Heart,
  Star,
  CheckCircle2,
  X,
  Navigation,
  Calendar,
  Building,
  Info,
} from 'lucide-react';
import { Property } from '../types';
import { NAGPUR_CAMPUSES, CampusLocation } from '../data/mockData';
import { calculateDistance, formatPriceINR } from '../utils/accommodationLogic';

interface MockLeafletMapProps {
  properties: Property[];
  shortlist: number[];
  onToggleShortlist: (id: number) => void;
  onViewDetails: (property: Property) => void;
  onInterestedClick: (property: Property) => void;
  selectedPropertyId?: number | null;
  onSelectProperty?: (id: number | null) => void;
}

type MapLayerType = 'streets' | 'satellite' | 'clean';

export const MockLeafletMap: React.FC<MockLeafletMapProps> = ({
  properties,
  shortlist,
  onToggleShortlist,
  onViewDetails,
  onInterestedClick,
  selectedPropertyId,
  onSelectProperty,
}) => {
  // Map viewport states
  const [zoom, setZoom] = useState(14); // 12 (wide city) to 16 (close street)
  // Center of Nagpur campus hub (VNIT / Ramdaspeth area)
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 21.135,
    lng: 79.065,
  });
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('streets');
  const [activePopupProperty, setActivePopupProperty] = useState<Property | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<CampusLocation | null>(null);
  const [showCampusRadius, setShowCampusRadius] = useState(true);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(null);

  // Dragging / panning states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const focusProperty = (prop: Property) => {
    setActivePopupProperty(prop);
    onSelectProperty?.(prop.id);
    if (prop.coordinates) {
      const latOffset = 0.006 * Math.pow(2, 14 - zoom);
      setCenter({ lat: prop.coordinates.lat + latOffset, lng: prop.coordinates.lng });
    }
  };

  // Auto-sync popup when selectedPropertyId prop changes
  useEffect(() => {
    if (selectedPropertyId) {
      const match = properties.find((p) => p.id === selectedPropertyId);
      if (match) {
        focusProperty(match);
      }
    }
  }, [selectedPropertyId, properties]);

  // Coordinate projection helper: maps GPS lat/lng to container pixel coordinates
  const projectCoordinates = (
    lat: number,
    lng: number,
    containerWidth: number,
    containerHeight: number
  ) => {
    // Zoom scale factors
    const scale = Math.pow(2, zoom - 12) * 900;
    const x = containerWidth / 2 + (lng - center.lng) * scale;
    const y = containerHeight / 2 - (lat - center.lat) * scale * 1.1; // Mercator aspect ratio compensation
    return { x, y };
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 1, 16));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 1, 12));

  // Recenter on Nagpur
  const handleRecenter = () => {
    setCenter({ lat: 21.135, lng: 79.065 });
    setZoom(14);
    setSelectedCampus(null);
  };

  // Focus on a specific campus
  const handleSelectCampus = (campus: CampusLocation) => {
    setSelectedCampus(campus);
    setCenter({ lat: campus.lat, lng: campus.lng });
    setZoom(15);
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.leaflet-interactive-control')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

    const scale = Math.pow(2, zoom - 12) * 900;
    setCenter((prev) => ({
      lat: prev.lat + (dy / (scale * 1.1)),
      lng: prev.lng - (dx / scale),
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.leaflet-interactive-control')) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });

    const scale = Math.pow(2, zoom - 12) * 900;
    setCenter((prev) => ({
      lat: prev.lat + (dy / (scale * 1.1)),
      lng: prev.lng - (dx / scale),
    }));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Dimensions of map container for projections
  const [mapSize, setMapSize] = useState({ width: 800, height: 600 });
  useEffect(() => {
    const updateSize = () => {
      if (mapContainerRef.current) {
        setMapSize({
          width: mapContainerRef.current.clientWidth || 800,
          height: mapContainerRef.current.clientHeight || 600,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Filter properties that have coordinates
  const mappedProperties = useMemo(() => {
    return properties.filter((p) => p.coordinates?.lat && p.coordinates?.lng);
  }, [properties]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg flex flex-col lg:flex-row h-[720px] relative">
      {/* SIDEBAR: Compact Property List (Synchronized with Map) */}
      <div className="w-full lg:w-96 flex-shrink-0 bg-slate-50 border-r border-slate-200 flex flex-col h-72 lg:h-full z-10">
        <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">
                {mappedProperties.length} Accommodations on Map
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Click pins to inspect rooms, rents & college distances
            </p>
          </div>
          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-200">
            Nagpur Hub
          </span>
        </div>

        {/* Campus Quick Jump Chips */}
        <div className="px-3 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-semibold flex-shrink-0 text-[10px] uppercase tracking-wider pl-1">
            Campus:
          </span>
          {NAGPUR_CAMPUSES.slice(0, 4).map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCampus(c)}
              className={`px-2 py-0.5 rounded-md font-medium transition-all flex-shrink-0 ${
                selectedCampus?.id === c.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-purple-300'
              }`}
            >
              {c.shortName}
            </button>
          ))}
        </div>

        {/* Scrollable list of cards */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
          {mappedProperties.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              <Building className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold">No properties in current filter</p>
            </div>
          ) : (
            mappedProperties.map((prop) => {
              const isSelected = activePopupProperty?.id === prop.id;
              const isHovered = hoveredPropertyId === prop.id;
              const isShort = shortlist.includes(prop.id);

              return (
                <div
                  key={prop.id}
                  onClick={() => focusProperty(prop)}
                  onMouseEnter={() => setHoveredPropertyId(prop.id)}
                  onMouseLeave={() => setHoveredPropertyId(null)}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer border text-left ${
                    isSelected
                      ? 'bg-purple-50/90 border-purple-400 ring-2 ring-purple-400/20 shadow-sm'
                      : isHovered
                      ? 'bg-white border-purple-200 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    <img
                      src={prop.image}
                      alt={prop.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            prop.gender === 'Boys'
                              ? 'bg-blue-100 text-blue-700'
                              : prop.gender === 'Girls'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {prop.gender}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[11px] font-bold text-slate-700">{prop.rating}</span>
                        </div>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 truncate mt-1">
                        {prop.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 truncate">{prop.location}, {prop.city}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-extrabold text-slate-900">
                          {formatPriceINR(prop.price)}
                          <span className="text-[10px] font-normal text-slate-400">/mo</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleShortlist(prop.id);
                          }}
                          className={`p-1 rounded-md transition-colors ${
                            isShort ? 'text-rose-500 fill-rose-500' : 'text-slate-400 hover:text-rose-500'
                          }`}
                          aria-label="Toggle Shortlist"
                        >
                          <Heart className="w-3.5 h-3.5" fill={isShort ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MAIN MAP CANVAS: Mock Leaflet Engine */}
      <div
        ref={mapContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 relative overflow-hidden select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${
          activeLayer === 'satellite'
            ? 'bg-slate-900'
            : activeLayer === 'clean'
            ? 'bg-slate-100'
            : 'bg-[#e5e3df]'
        }`}
      >
        {/* LEAFLET TILE BACKGROUND SIMULATION */}
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-300">
          {/* Street Map Grid & Waterways */}
          {activeLayer === 'streets' && (
            <svg className="w-full h-full opacity-60">
              <defs>
                <pattern id="map-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                  <path
                    d="M 120 0 L 0 0 0 120"
                    fill="none"
                    stroke="#d4cfc7"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 60 0 L 60 120 M 0 60 L 120 60"
                    fill="none"
                    stroke="#eae7e1"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                </pattern>
                {/* Ambazari / Futala lake water gradient */}
                <linearGradient id="lake-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a5c9eb" />
                  <stop offset="100%" stopColor="#8cb9e6" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#map-grid)" />

              {/* Geographic Features: Ambazari Lake (West Nagpur) */}
              <ellipse
                cx={mapSize.width * 0.28 + (79.05 - center.lng) * 800}
                cy={mapSize.height * 0.62 - (21.13 - center.lat) * 800}
                rx={110 * (zoom / 14)}
                ry={65 * (zoom / 14)}
                fill="url(#lake-grad)"
                opacity="0.85"
              />
              <text
                x={mapSize.width * 0.28 + (79.05 - center.lng) * 800}
                y={mapSize.height * 0.62 - (21.13 - center.lat) * 800}
                textAnchor="middle"
                className="text-[11px] font-bold fill-blue-700/60 tracking-wider pointer-events-none select-none"
              >
                Ambazari Lake
              </text>

              {/* Futala Lake (North-West Nagpur) */}
              <ellipse
                cx={mapSize.width * 0.25 + (79.04 - center.lng) * 800}
                cy={mapSize.height * 0.28 - (21.155 - center.lat) * 800}
                rx={75 * (zoom / 14)}
                ry={45 * (zoom / 14)}
                fill="url(#lake-grad)"
                opacity="0.8"
              />
              <text
                x={mapSize.width * 0.25 + (79.04 - center.lng) * 800}
                y={mapSize.height * 0.28 - (21.155 - center.lat) * 800}
                textAnchor="middle"
                className="text-[10px] font-bold fill-blue-700/60 tracking-wider pointer-events-none select-none"
              >
                Futala Lake
              </text>

              {/* Primary Arterial Road Lines */}
              <path
                d={`M -200 ${mapSize.height * 0.45} Q ${mapSize.width * 0.5} ${mapSize.height * 0.52} ${mapSize.width + 200} ${mapSize.height * 0.42}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="10"
              />
              <path
                d={`M -200 ${mapSize.height * 0.45} Q ${mapSize.width * 0.5} ${mapSize.height * 0.52} ${mapSize.width + 200} ${mapSize.height * 0.42}`}
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
                strokeOpacity="0.4"
              />
              {/* North-South WHC Road */}
              <path
                d={`M ${mapSize.width * 0.42} -100 L ${mapSize.width * 0.48} ${mapSize.height + 100}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="8"
              />
              <path
                d={`M ${mapSize.width * 0.42} -100 L ${mapSize.width * 0.48} ${mapSize.height + 100}`}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeOpacity="0.5"
              />

              {/* Area Labels */}
              <text x={mapSize.width * 0.45} y={mapSize.height * 0.48} className="text-xs font-extrabold fill-slate-400/80">
                Ramdaspeth
              </text>
              <text x={mapSize.width * 0.38} y={mapSize.height * 0.32} className="text-xs font-extrabold fill-slate-400/80">
                Dharampeth
              </text>
              <text x={mapSize.width * 0.62} y={mapSize.height * 0.22} className="text-xs font-extrabold fill-slate-400/80">
                Sadar / Civil Lines
              </text>
              <text x={mapSize.width * 0.18} y={mapSize.height * 0.75} className="text-xs font-extrabold fill-slate-400/80">
                Hingna MIDC
              </text>
              <text x={mapSize.width * 0.72} y={mapSize.height * 0.65} className="text-xs font-extrabold fill-slate-400/80">
                Nandanvan
              </text>
            </svg>
          )}

          {/* Satellite Layer Mock */}
          {activeLayer === 'satellite' && (
            <div className="w-full h-full bg-slate-950 opacity-90 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 via-transparent to-slate-900/60" />
            </div>
          )}

          {/* Clean Light Layer Mock */}
          {activeLayer === 'clean' && (
            <div className="w-full h-full bg-[#f8fafc] opacity-90 relative">
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-50" />
            </div>
          )}
        </div>

        {/* CAMPUS LANDMARK PINS & RADIUS RINGS */}
        {showCampusRadius &&
          NAGPUR_CAMPUSES.map((campus) => {
            const { x, y } = projectCoordinates(
              campus.lat,
              campus.lng,
              mapSize.width,
              mapSize.height
            );

            // Radius in pixels for 1.5 km walking circle
            const radiusPx = 80 * Math.pow(1.5, zoom - 14);

            return (
              <div key={campus.id} className="absolute pointer-events-none" style={{ left: x, top: y }}>
                {/* 1.5 km Walking Radius Ring */}
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-500/30 bg-amber-500/10 transition-all pointer-events-none"
                  style={{
                    width: radiusPx * 2,
                    height: radiusPx * 2,
                  }}
                />

                {/* Campus Center Pin */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCampus(campus);
                  }}
                  className="leaflet-interactive-control absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                >
                  <div className="p-1.5 rounded-full bg-amber-500 text-white shadow-lg border-2 border-white hover:scale-110 transition-transform flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap pointer-events-none z-20">
                    {campus.shortName}
                  </div>
                </div>
              </div>
            );
          })}

        {/* PROPERTY PRICE MARKERS (Leaflet Style Marker Cluster / Price Tags) */}
        {mappedProperties.map((prop) => {
          if (!prop.coordinates) return null;
          const { x, y } = projectCoordinates(
            prop.coordinates.lat,
            prop.coordinates.lng,
            mapSize.width,
            mapSize.height
          );

          // Don't render markers way out of screen
          if (x < -100 || x > mapSize.width + 100 || y < -100 || y > mapSize.height + 100) {
            return null;
          }

          const isSelected = activePopupProperty?.id === prop.id;
          const isHovered = hoveredPropertyId === prop.id;

          // Color themes based on Gender
          const badgeBg =
            prop.gender === 'Boys'
              ? 'bg-blue-600 hover:bg-blue-700'
              : prop.gender === 'Girls'
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-purple-600 hover:bg-purple-700';

          return (
            <div
              key={prop.id}
              style={{ left: x, top: y }}
              onClick={(e) => {
                e.stopPropagation();
                focusProperty(prop);
              }}
              onMouseEnter={() => setHoveredPropertyId(prop.id)}
              onMouseLeave={() => setHoveredPropertyId(null)}
              className="leaflet-interactive-control absolute -translate-x-1/2 -translate-y-full z-20 cursor-pointer transition-all duration-200"
            >
              {/* Marker Container */}
              <div
                className={`relative flex flex-col items-center group transition-transform ${
                  isSelected || isHovered ? 'scale-115 z-30' : 'hover:scale-105'
                }`}
              >
                {/* Price Pill Tag */}
                <div
                  className={`px-2.5 py-1 rounded-full text-white font-extrabold text-xs shadow-md border border-white flex items-center space-x-1 transition-all ${badgeBg} ${
                    isSelected ? 'ring-4 ring-purple-400/50 shadow-xl' : ''
                  }`}
                >
                  <span>{formatPriceINR(prop.price)}</span>
                  {prop.verified && (
                    <span className="text-[10px] text-emerald-200">✓</span>
                  )}
                </div>

                {/* Pin Stem Triangle */}
                <div
                  className={`w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-white -mt-0.5 ${
                    prop.gender === 'Boys'
                      ? 'border-t-blue-600'
                      : prop.gender === 'Girls'
                      ? 'border-t-rose-600'
                      : 'border-t-purple-600'
                  }`}
                />

                {/* Pin Shadow on Ground */}
                <div className="w-4 h-1.5 bg-black/25 rounded-full blur-[1px] mt-0.5" />
              </div>
            </div>
          );
        })}

        {/* LEAFLET POPUP CARD BALLOON */}
        {activePopupProperty && activePopupProperty.coordinates && (
          (() => {
            const { x, y } = projectCoordinates(
              activePopupProperty.coordinates.lat,
              activePopupProperty.coordinates.lng,
              mapSize.width,
              mapSize.height
            );

            // Responsive positioning: if y < 290, flip below the pin so it never clips top edge
            const showAbove = y >= 290;
            const clampedX = Math.max(160, Math.min(x, mapSize.width - 160));
            const topPos = showAbove ? y - 18 : y + 24;

            return (
              <div
                style={{
                  left: clampedX,
                  top: topPos,
                }}
                className={`leaflet-interactive-control absolute -translate-x-1/2 ${
                  showAbove ? '-translate-y-full' : 'translate-y-0'
                } z-40 w-72 sm:w-80 animate-in fade-in zoom-in-95 duration-150`}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative text-left">
                  {/* Close button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePopupProperty(null);
                    }}
                    className="absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
                    aria-label="Close popup"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Thumbnail Image */}
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                    <img
                      src={activePopupProperty.image}
                      alt={activePopupProperty.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
                          activePopupProperty.gender === 'Boys'
                            ? 'bg-blue-600'
                            : activePopupProperty.gender === 'Girls'
                            ? 'bg-rose-600'
                            : 'bg-purple-600'
                        }`}
                      >
                        {activePopupProperty.gender} PG
                      </span>
                      <div className="flex items-center space-x-1 bg-slate-900/80 px-1.5 py-0.5 rounded text-[11px] font-bold">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{activePopupProperty.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info Body */}
                  <div className="p-3.5 space-y-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {activePopupProperty.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {activePopupProperty.location}, {activePopupProperty.city}
                      </p>
                    </div>

                    {/* Nearest Campus Distance Badge */}
                    {activePopupProperty.nearestColleges?.[0] && (
                      <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                        <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {activePopupProperty.nearestColleges[0].name}:{' '}
                          {activePopupProperty.nearestColleges[0].distance} (
                          {activePopupProperty.nearestColleges[0].travelTime})
                        </span>
                      </div>
                    )}

                    {/* Price and Sharing Options */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-base font-extrabold text-slate-900 font-['Outfit']">
                          {formatPriceINR(activePopupProperty.price)}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal"> / month</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {activePopupProperty.roomTypes.join(' • ')}
                      </span>
                    </div>

                    {/* Interactive Action CTA Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInterestedClick(activePopupProperty);
                        }}
                        className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 flex items-center justify-center space-x-1 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Visit</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(activePopupProperty);
                        }}
                        className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-1"
                      >
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Balloon Pointer Arrow */}
                  {showAbove ? (
                    <div className="w-4 h-4 bg-white border-b border-r border-slate-200 transform rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2 shadow-xs" />
                  ) : (
                    <div className="w-4 h-4 bg-white border-t border-l border-slate-200 transform rotate-45 absolute -top-2 left-1/2 -translate-x-1/2 shadow-xs" />
                  )}
                </div>
              </div>
            );
          })()
        )}

        {/* LEAFLET CONTROLS CHROME OVERLAYS */}

        {/* 1. Zoom Controls (Top-Left) */}
        <div className="leaflet-interactive-control absolute top-4 left-4 z-30 flex flex-col bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden divide-y divide-slate-100">
          <button
            onClick={handleZoomIn}
            className="p-2.5 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Zoom in (+)"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Zoom out (-)"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleRecenter}
            className="p-2.5 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Recenter Map"
            aria-label="Recenter Map"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Map Layer Switcher (Top-Right) */}
        <div className="leaflet-interactive-control absolute top-4 right-4 z-30 flex items-center space-x-1.5 bg-white/95 backdrop-blur-sm p-1 rounded-xl shadow-lg border border-slate-200">
          <Layers className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {(['streets', 'satellite', 'clean'] as MapLayerType[]).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                activeLayer === layer
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

        {/* 3. Campus Radius Toggle (Bottom-Left) */}
        <div className="leaflet-interactive-control absolute bottom-8 left-4 z-30 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center space-x-2">
          <GraduationCap className="w-4 h-4 text-amber-500" />
          <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showCampusRadius}
              onChange={(e) => setShowCampusRadius(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
            />
            <span>Show Campus Walking Zones (1.5 km)</span>
          </label>
        </div>

        {/* 4. Leaflet Attribution & Scale Bar (Bottom-Right) */}
        <div className="absolute bottom-2 right-3 z-20 flex items-center space-x-3 text-[10px] text-slate-500 bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded border border-slate-200/60 pointer-events-none">
          <div className="flex items-center space-x-1">
            <span className="w-8 border-b-2 border-slate-600 inline-block" />
            <span className="font-mono">500 m</span>
          </div>
          <span className="text-slate-300">|</span>
          <span>Leaflet v1.9 • © OpenStreetMap contributors • StayMate GIS</span>
        </div>
      </div>
    </div>
  );
};
