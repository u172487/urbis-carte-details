
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
      <header className="bg-white text-slate-800 px-6 py-4 shadow-lg z-30 relative border-b border-slate-200">
        <div className="flex items-center gap-4">
          <img 
            src="https://www.setbysetec.com/wp-content/uploads/2022/10/SET_LOGO_setbysetec_Q_bicoul-150x150.png" 
            alt="SET Logo" 
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-primary">SetPLU</h1>
            <p className="text-slate-600 text-sm">Informations urbanistiques en un clic</p>
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
