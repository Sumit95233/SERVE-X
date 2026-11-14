import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Search,
  ShieldCheck,
  Building2,
  Navigation,
  ArrowRight,
  X,
  Compass,
  Filter,
  CheckCircle2,
  Globe,
  Tag,
  Heart,
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { DirectDonationModal } from '../../components/common/DirectDonationModal';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import { useAuth } from '../../context/AuthContext';

// All 36 Indian States & Union Territories with center coordinates and optimal map zoom
const INDIAN_STATES_DATA = [
  { name: 'All States & UTs', center: [22.5937, 82.9629], zoom: 5 },
  { name: 'Andaman and Nicobar Islands', center: [11.6234, 92.7265], zoom: 8 },
  { name: 'Andhra Pradesh', center: [15.9129, 79.7400], zoom: 7 },
  { name: 'Arunachal Pradesh', center: [28.2180, 94.7278], zoom: 7 },
  { name: 'Assam', center: [26.2006, 92.9376], zoom: 7 },
  { name: 'Bihar', center: [25.0961, 85.3131], zoom: 7 },
  { name: 'Chandigarh', center: [30.7326, 76.7794], zoom: 12 },
  { name: 'Chhattisgarh', center: [21.2787, 81.8661], zoom: 7 },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', center: [20.3167, 72.9667], zoom: 10 },
  { name: 'Delhi', center: [28.6139, 77.2090], zoom: 11 },
  { name: 'Goa', center: [15.2993, 74.1240], zoom: 10 },
  { name: 'Gujarat', center: [22.2587, 71.1924], zoom: 7 },
  { name: 'Haryana', center: [29.0588, 76.0856], zoom: 8 },
  { name: 'Himachal Pradesh', center: [31.1048, 77.1734], zoom: 8 },
  { name: 'Jammu and Kashmir', center: [33.7782, 74.7973], zoom: 7 },
  { name: 'Jharkhand', center: [23.6102, 85.2799], zoom: 7 },
  { name: 'Karnataka', center: [15.3173, 75.7139], zoom: 7 },
  { name: 'Kerala', center: [10.8505, 76.2711], zoom: 7 },
  { name: 'Ladakh', center: [34.1526, 77.5771], zoom: 7 },
  { name: 'Lakshadweep', center: [10.5669, 72.6420], zoom: 9 },
  { name: 'Madhya Pradesh', center: [22.9734, 78.6569], zoom: 7 },
  { name: 'Maharashtra', center: [19.7515, 75.7139], zoom: 7 },
  { name: 'Manipur', center: [24.6637, 93.9063], zoom: 8 },
  { name: 'Meghalaya', center: [25.4670, 91.3662], zoom: 8 },
  { name: 'Mizoram', center: [23.1645, 92.9376], zoom: 8 },
  { name: 'Nagaland', center: [26.1584, 94.5624], zoom: 8 },
  { name: 'Odisha', center: [20.9517, 85.0985], zoom: 7 },
  { name: 'Puducherry', center: [11.9416, 79.8083], zoom: 11 },
  { name: 'Punjab', center: [31.1471, 75.3412], zoom: 8 },
  { name: 'Rajasthan', center: [27.0238, 74.2179], zoom: 7 },
  { name: 'Sikkim', center: [27.5330, 88.5122], zoom: 9 },
  { name: 'Tamil Nadu', center: [11.1271, 78.6569], zoom: 7 },
  { name: 'Telangana', center: [18.1124, 79.0193], zoom: 7 },
  { name: 'Tripura', center: [23.9408, 91.9882], zoom: 8 },
  { name: 'Uttar Pradesh', center: [26.8467, 80.9462], zoom: 7 },
  { name: 'Uttarakhand', center: [30.0668, 79.0193], zoom: 8 },
  { name: 'West Bengal', center: [22.9868, 87.8550], zoom: 7 },
];

const CAUSE_FILTERS = [
  'All Causes',
  'Education',
  'Healthcare',
  'Women Empowerment',
  'Child Welfare',
  'Food Security',
  'Environment',
  'Rural Development',
  'Disability Inclusion',
  'Elderly Care',
  'Animal Welfare',
];

const QUICK_REGIONS = [
  { label: 'All India', state: 'All States & UTs' },
  { label: 'Delhi', state: 'Delhi' },
  { label: 'Maharashtra', state: 'Maharashtra' },
  { label: 'Karnataka', state: 'Karnataka' },
  { label: 'West Bengal', state: 'West Bengal' },
  { label: 'Tamil Nadu', state: 'Tamil Nadu' },
  { label: 'Uttar Pradesh', state: 'Uttar Pradesh' },
  { label: 'Assam', state: 'Assam' },
  { label: 'Gujarat', state: 'Gujarat' },
  { label: 'Rajasthan', state: 'Rajasthan' },
  { label: 'Bihar', state: 'Bihar' },
  { label: 'Kerala', state: 'Kerala' },
  { label: 'Jammu & Kashmir', state: 'Jammu and Kashmir' },
];

// Helper component to center map smoothly on state changes
const RecenterMap = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom || 6, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);
  return null;
};

export const NgoLocatorPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNgo = user?.role === 'ngo';
  const [allNgos, setAllNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('All States & UTs');
  const [selectedCause, setSelectedCause] = useState('All Causes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [mapCenter, setMapCenter] = useState([22.5937, 82.9629]); // India center
  const [mapZoom, setMapZoom] = useState(5);

  const markerRefs = useRef({});

  // Direct Donation & Receipt Modal States
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donationTargetNgo, setDonationTargetNgo] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Fetch all verified NGOs across India on mount
  useEffect(() => {
    fetchAllNgos();
  }, []);

  const fetchAllNgos = async () => {
    setLoading(true);
    try {
      // Query up to 1000 to cover all 365+ NGOs across all states
      const res = await api.get('/ngos?limit=1000');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setAllNgos(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load NGOs for map', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered NGOs based on state, cause, and search text
  const filteredNgos = useMemo(() => {
    return allNgos.filter((ngo) => {
      // State Filter
      if (selectedState !== 'All States & UTs') {
        const stateMatch =
          ngo.state && ngo.state.toLowerCase() === selectedState.toLowerCase();
        if (!stateMatch) return false;
      }

      // Cause Filter
      if (selectedCause !== 'All Causes') {
        const causeMatch = ngo.causeCategories?.some((cat) =>
          cat.toLowerCase().includes(selectedCause.toLowerCase())
        );
        if (!causeMatch) return false;
      }

      // Search Query (matches name, city, state, or description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = ngo.organizationName?.toLowerCase().includes(q);
        const inCity = ngo.city?.toLowerCase().includes(q);
        const inState = ngo.state?.toLowerCase().includes(q);
        const inDesc = ngo.description?.toLowerCase().includes(q);
        if (!inName && !inCity && !inState && !inDesc) return false;
      }

      return true;
    });
  }, [allNgos, selectedState, selectedCause, searchQuery]);

  // Handle state change (dropdown or quick pill)
  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    setSelectedNgo(null);

    const foundState = INDIAN_STATES_DATA.find(
      (s) => s.name.toLowerCase() === stateName.toLowerCase()
    );
    if (foundState) {
      setMapCenter(foundState.center);
      setMapZoom(foundState.zoom);
    }
  };

  // Handle selecting an NGO from list
  const handleSelectNgo = (ngo) => {
    setSelectedNgo(ngo);
    const coords = ngo.locationCoordinates?.coordinates;
    if (coords && coords.length >= 2) {
      const latLng = [coords[1], coords[0]];
      setMapCenter(latLng);
      setMapZoom(13);

      // Open popup on map
      if (markerRefs.current[ngo._id]) {
        markerRefs.current[ngo._id].openPopup();
      }
    }
  };

  // Handle "Near Me" GPS location
  const handleFindNearby = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setMapZoom(12);
          try {
            const res = await api.get(
              `/ngos/nearby?lat=${latitude}&lng=${longitude}&maxDistance=100000`
            );
            if (res.data?.success && res.data.data.length > 0) {
              setAllNgos(res.data.data);
              setSelectedState('All States & UTs');
              setSelectedCause('All Causes');
            }
          } catch (err) {
            console.error('Nearby error', err);
          }
        },
        () => {
          alert('Location permission not granted. Please pick a state from the dropdown.');
        }
      );
    }
  };

  // Reset all active filters
  const handleResetFilters = () => {
    setSelectedState('All States & UTs');
    setSelectedCause('All Causes');
    setSearchQuery('');
    setSelectedNgo(null);
    setMapCenter([22.5937, 82.9629]);
    setMapZoom(5);
    fetchAllNgos();
  };

  // Custom modern HTML Map pin marker with clean proportions & rock-solid hover stability
  const createCustomIcon = (isSelected) => {
    if (isSelected) {
      return L.divIcon({
        className: 'custom-leaflet-marker selected',
        html: `
          <div class="marker-pin-wrapper" style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="
              position: absolute;
              inset: -4px;
              border-radius: 50%;
              background: rgba(7, 84, 154, 0.28);
              animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div class="marker-pin-inner" style="
              background: #07549A;
              color: white;
              width: 30px;
              height: 30px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 8px 18px rgba(7, 84, 154, 0.45);
              border: 2.5px solid #ffffff;
              transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
            ">
              <svg style="transform: rotate(45deg); width: 14px; height: 14px;" viewBox="0 0 24 24" fill="white">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34],
      });
    }

    // Refined, high-precision pin for all 366 unselected NGOs:
    // 20px teardrop with clean emerald gradient, crisp white heart icon, and shadow.
    // Zero-jitter, 100% stable in place on cursor hover.
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="marker-pin-wrapper" style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div class="marker-pin-inner" style="
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            width: 20px;
            height: 20px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 8px rgba(5, 150, 105, 0.4);
            border: 2px solid #ffffff;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
          ">
            <svg style="transform: rotate(45deg); width: 9px; height: 9px;" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 22],
      popupAnchor: [0, -22],
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] w-full max-w-full overflow-x-hidden">
      {/* Top Banner & Control Deck */}
      <div className="bg-white border-b border-[#E5EAF0] py-6 px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#00B98B] bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-emerald-200">
                  <Globe className="w-3.5 h-3.5" /> All-India Network
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  36 States & UTs • Real Geospatial Coordinates
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
                India NGO Locator Map
              </h1>
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative min-w-[200px] flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search NGO, city or keyword..."
                  className="w-full pl-9 pr-8 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#07549A] transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* State / UT Selector */}
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm font-semibold text-[#101828] focus:outline-hidden focus:ring-2 focus:ring-[#07549A] transition cursor-pointer"
                >
                  {INDIAN_STATES_DATA.map((st) => (
                    <option key={st.name} value={st.name}>
                      {st.name === 'All States & UTs'
                        ? 'All States & UTs (36)'
                        : st.name}
                    </option>
                  ))}
                </select>
                <Compass className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Cause Category Selector */}
              <div className="relative">
                <select
                  value={selectedCause}
                  onChange={(e) => setSelectedCause(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm font-semibold text-[#101828] focus:outline-hidden focus:ring-2 focus:ring-[#07549A] transition cursor-pointer"
                >
                  {CAUSE_FILTERS.map((cause) => (
                    <option key={cause} value={cause}>
                      {cause}
                    </option>
                  ))}
                </select>
                <Filter className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Near Me GPS button */}
              <button
                onClick={handleFindNearby}
                className="px-3.5 py-2.5 bg-[#EBF3FB] text-[#07549A] hover:bg-[#07549A] hover:text-white rounded-xl transition text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Find NGOs Near My Current Location"
              >
                <Navigation className="w-4 h-4" />
                <span className="hidden sm:inline">Near Me</span>
              </button>
            </div>
          </div>

          {/* Quick Region Pills - Wrapped gracefully so nothing is cut off */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              Quick Focus:
            </span>
            {QUICK_REGIONS.map((region) => {
              const isSelected = selectedState === region.state;
              return (
                <button
                  key={region.label}
                  type="button"
                  onClick={() => handleStateChange(region.state)}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#07549A] text-white shadow-xs font-bold'
                      : 'bg-[#F1F5F9] text-gray-700 hover:bg-[#E2E8F0]'
                  }`}
                >
                  {region.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Map & Side List Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full max-w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[650px] xl:h-[700px] w-full max-w-full">
          {/* Leaflet Map Section - z-0 and isolate ensure no overlap bleed */}
          <div className="lg:col-span-8 bg-white rounded-3xl overflow-hidden border border-[#E5EAF0] shadow-sm relative h-full isolate z-0">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap center={mapCenter} zoom={mapZoom} />

              {filteredNgos.map((ngo) => {
                const coords = ngo.locationCoordinates?.coordinates;
                if (!coords || coords.length < 2) return null;
                const position = [coords[1], coords[0]]; // Leaflet uses [lat, lng]
                const isSelected = selectedNgo?._id === ngo._id;

                return (
                  <Marker
                    key={ngo._id}
                    position={position}
                    icon={createCustomIcon(isSelected)}
                    ref={(ref) => {
                      if (ref) markerRefs.current[ngo._id] = ref;
                    }}
                    eventHandlers={{
                      click: () => {
                        setSelectedNgo(ngo);
                        const cardEl = document.getElementById(`ngo-card-${ngo._id}`);
                        if (cardEl) {
                          cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                      },
                    }}
                  >
                    <Popup className="servex-map-popup">
                      <div className="p-1 min-w-[210px] max-w-[250px]">
                        <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-emerald-600 mb-1.5">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified NGO
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                            {ngo.state}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[#101828] leading-tight mb-1">
                          {ngo.organizationName}
                        </h4>
                        <p className="text-[11px] text-gray-500 mb-2 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>{ngo.city}, {ngo.state}</span>
                        </p>
                        {ngo.causeCategories?.[0] && (
                          <div className="mb-2.5">
                            <span className="inline-block text-[10px] font-semibold text-[#07549A] bg-[#EBF3FB] px-2 py-0.5 rounded-full">
                              {ngo.causeCategories[0]}
                            </span>
                          </div>
                        )}
                        {/* Action Buttons: If NGO user, strictly View Profile (NO Donate button) */}
                        <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                          {isNgo ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/ngos/${ngo._id}`);
                              }}
                              className="w-full h-8.5 px-3 bg-[#07549A] hover:bg-[#06457E] !text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
                              style={{ color: '#ffffff', backgroundColor: '#07549A' }}
                            >
                              <span>View Organization Profile</span>
                              <ArrowRight className="w-3.5 h-3.5 text-white shrink-0" />
                            </button>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDonationTargetNgo(ngo);
                                  setIsDonationModalOpen(true);
                                }}
                                className="h-8.5 px-2 bg-[#059669] hover:bg-[#047857] !text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
                                style={{ color: '#ffffff', backgroundColor: '#059669' }}
                              >
                                <Heart className="w-3.5 h-3.5 fill-white shrink-0" />
                                <span>Donate ₹</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigate(`/ngos/${ngo._id}`);
                                }}
                                className="h-8.5 px-2 bg-[#07549A] hover:bg-[#06457E] !text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
                                style={{ color: '#ffffff', backgroundColor: '#07549A' }}
                              >
                                <span>View Profile</span>
                                <ArrowRight className="w-3.5 h-3.5 text-white shrink-0" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Floating Quick Count Badge on Map */}
            <div className="absolute top-4 right-4 z-[1000] pointer-events-none">
              <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-md border border-[#E5EAF0] text-xs font-bold text-[#101828] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{filteredNgos.length} NGOs Mapped</span>
              </div>
            </div>
          </div>

          {/* Side List Panel */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E5EAF0] shadow-sm p-5 flex flex-col h-full overflow-hidden">
            {/* List Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div>
                <h3 className="font-bold text-sm text-[#101828] flex items-center gap-1.5">
                  <span>Organizations Found</span>
                  <span className="px-2 py-0.5 bg-[#EBF3FB] text-[#07549A] rounded-full text-xs font-bold">
                    {filteredNgos.length}
                  </span>
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {selectedState !== 'All States & UTs'
                    ? `Showing non-profits in ${selectedState}`
                    : 'Displaying across all 36 States & UTs'}
                </p>
              </div>

              {(selectedState !== 'All States & UTs' ||
                selectedCause !== 'All Causes' ||
                searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-[#07549A] hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loading ? (
                <div className="py-16">
                  <LoadingSpinner message="Loading all-India NGO coordinates..." />
                </div>
              ) : filteredNgos.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#101828] mb-1">
                    No Organizations Found
                  </h4>
                  <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">
                    We couldn't find NGOs matching your selected filters. Try choosing another state or clearing search filters.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-[#07549A] text-white text-xs font-bold rounded-xl hover:bg-[#06457E] transition cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredNgos.map((ngo) => {
                  const isSelected = selectedNgo?._id === ngo._id;
                  const primaryCause =
                    ngo.causeCategories?.[0] || 'Community Development';

                  return (
                    <div
                      key={ngo._id}
                      id={`ngo-card-${ngo._id}`}
                      onClick={() => handleSelectNgo(ngo)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-[#07549A] bg-[#EBF3FB]/75 shadow-sm ring-1 ring-[#07549A]/30'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EAF3FF] to-[#D5E7FF] text-[#07549A] flex items-center justify-center font-bold text-xs shrink-0 border border-[#BFDBFE]">
                          {ngo.logo ? (
                            <img
                              src={ngo.logo}
                              alt=""
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <Building2 className="w-5 h-5 text-[#07549A]" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <h4 className="font-bold text-sm text-[#101828] truncate">
                              {ngo.organizationName}
                            </h4>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">
                              {ngo.city}
                              {ngo.state ? `, ${ngo.state}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cause Category Tag */}
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#07549A] bg-[#EBF3FB] px-2 py-0.5 rounded-md">
                          <Tag className="w-2.5 h-2.5" />
                          {primaryCause}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                        {ngo.description}
                      </p>

                      <div className="pt-2.5 border-t border-gray-100 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-gray-500">
                          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Verified Partner
                          </span>
                          <span>
                            <strong className="text-[#101828] font-bold">
                              {ngo.activeCampaignsCount || 0}
                            </strong>{' '}
                            Active Campaigns
                          </span>
                        </div>

                        {/* Action Buttons: If NGO user, strictly View Profile (NO Donate button) */}
                        {isNgo ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/ngos/${ngo._id}`);
                            }}
                            className="w-full h-8.5 px-3 rounded-xl bg-[#EAF3FF] hover:bg-[#07549A] text-[#07549A] hover:text-white border border-[#BFDBFE] hover:border-[#07549A] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                          >
                            <span>View Organization Profile</span>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDonationTargetNgo(ngo);
                                setIsDonationModalOpen(true);
                              }}
                              className="h-8.5 px-2.5 rounded-xl bg-[#ECFDF5] hover:bg-[#059669] text-[#065F46] hover:text-white border border-[#A7F3D0] hover:border-[#059669] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                            >
                              <Heart className="w-3.5 h-3.5 fill-current shrink-0" />
                              <span>Donate ₹</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/ngos/${ngo._id}`);
                              }}
                              className="h-8.5 px-2.5 rounded-xl bg-[#EAF3FF] hover:bg-[#07549A] text-[#07549A] hover:text-white border border-[#BFDBFE] hover:border-[#07549A] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                            >
                              <span>View Profile</span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Direct Donation Modal */}
      <DirectDonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        ngo={donationTargetNgo}
        onDonationSuccess={(receipt) => {
          setActiveReceipt(receipt);
          setIsReceiptOpen(true);
          fetchAllNgos();
        }}
      />

      {/* Official 80G Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={activeReceipt}
      />
    </div>
  );
};
