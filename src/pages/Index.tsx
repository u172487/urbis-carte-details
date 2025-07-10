
import React, { useState } from 'react';
import MapView from '../components/MapView';
import SidePanel from '../components/SidePanel';

export interface ClickData {
  lat: number;
  lon: number;
  addressData?: any;
  zoningData?: any;
  plusData?: any;
}

const Index = () => {
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [clickData, setClickData] = useState<ClickData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMapClick = async (lat: number, lon: number) => {
    setLoading(true);
    setSidePanelOpen(true);
    
    const newClickData: ClickData = { lat, lon };
    setClickData(newClickData);

    try {
      // Requête 1: Adresse (API BAN)
      const addressResponse = await fetch(
        `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`
      );
      const addressData = await addressResponse.json();
      
      // Requête 2: Zonage (API Carto IGN)
      const zoningResponse = await fetch(
        `https://apicarto.ign.fr/api/gpu/zone-urba?geom={"type":"Point","coordinates":[${lon},${lat}]}`
      );
      const zoningData = await zoningResponse.json();

      setClickData(prev => ({
        ...prev!,
        addressData: addressData.features?.[0]?.properties,
        zoningData: zoningData.features?.[0]?.properties
      }));
    } catch (error) {
      console.error('Erreur lors des requêtes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSidePanel = () => {
    setSidePanelOpen(false);
    setClickData(null);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-4 shadow-lg z-30 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Urbanisme Interactive</h1>
            <p className="text-slate-300 text-sm">Informations urbanistiques en un clic</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex relative">
        {/* Map container with dynamic width */}
        <div className={`transition-all duration-300 ${sidePanelOpen ? 'w-[calc(100%-24rem)]' : 'w-full'}`}>
          <MapView onMapClick={handleMapClick} />
        </div>
        
        {/* Side panel with fixed positioning */}
        <SidePanel
          isOpen={sidePanelOpen}
          onClose={handleCloseSidePanel}
          clickData={clickData}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Index;
