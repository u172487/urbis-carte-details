import React, { useState } from 'react';
import MapView from '../components/MapView';
import SidePanel from '../components/SidePanel';

export interface ClickData {
  lat: number;
  lon: number;
  addressData?: any;
  zoningData?: any;
  plusData?: any;
  prescriptionData?: any;
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
      // lon = 4.16013825380517
      // lat = 44.277322343512
      const addressResponse = await fetch(
        `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`
      );
      const addressData = await addressResponse.json();
      

      // Requête 2: Zonage (API Carto IGN)
      const zoningResponse = await fetch(
        `https://apicarto.ign.fr/api/gpu/zone-urba?geom={"type":"Point","coordinates":[${lon},${lat}]}`
      );
      const zoningData = await zoningResponse.json();

      // verifier si features contient des feture pour le geojson zoningData telecharge
      if (!zoningData.features || zoningData.features.length === 0) {
          const secteur_ccResponse = await fetch(
            `https://apicarto.ign.fr/api/gpu/secteur-cc?geom={"type":"Point","coordinates":[${lon},${lat}]}`
          );

          const secteur_ccData = await secteur_ccResponse.json();

          if(secteur_ccData.features && zoningData.features.length === 0){
            zoningData.features = secteur_ccData.features;
            secteur_ccData.features.forEach((feature: any) => {
              feature.properties.typezone = 'x'; // indice pour le CC
            });
          }

      } 
      // else if (zoningData.features.length > 1){ // verifier si dans zoningData.features il ya  2 ou plusiuers featuers 
      //   // si c'est la cas prendre uniquement la fetaure ou la vluer de la  cle partition contint le mot 'DU'
      //   const filteredFeatures = zoningData.features.filter((feature: any) => 
      //     feature.properties.partition && feature.properties.partition.includes('DU_')
      //   );
      //   if (filteredFeatures.length > 0) {
      //     zoningData.features = filteredFeatures;
      //   }
      //   console.log('filtré')

      // }
      // console.log(zoningData)

      // Requête 3: Prescriptions (via Flask backend)
      const prescriptionResponse = await fetch(
        `http://127.0.0.1:5000/api/prescriptions?lon=${lon}&lat=${lat}`
      );
      const prescriptionData = await prescriptionResponse.json();
      console.log("prescriptionData", prescriptionData);

      // Filter features that start with "info_", "prescription_", or "generateur_"
      const filteredFeatures = prescriptionData.features?.filter((feature: any) => {
        const id = feature.id || '';
        return id.startsWith('info_') || id.startsWith('prescription_') || id.startsWith('generateur_');
      }) || [];

      setClickData(prev => ({
        ...prev!,
        addressData: addressData.features?.[0]?.properties,
        zoningData: zoningData.features?.[0]?.properties,
        prescriptionData: { features: filteredFeatures }
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
            src="/set_logo.png"
            alt="SET Logo" 
            className="w-13 h-12 object-contain"
          />
          <div>
            <h1 className="text-2xl font-black  text-[#069642]">PLU</h1>
            <p className="text-slate-600 text-sm">Informations urbanistiques en un clic</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex relative">
        {/* Map container with dynamic width */}
        <div className={`transition-all duration-300 ${sidePanelOpen ? 'w-[calc(100%-40rem)]' : 'w-full'}`}>
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
