import React, { useState, useEffect } from 'react';
import CollapsibleSection from './PLU/CollapsibleSection';
import DocumentSection from './PLU/DocumentSection';
import PLURule from './PLU/PLURule';
import LoadingButton from './PLU/LoadingButton';

interface PLUSynthesisProps {
  addressData?: any;
  zoningData?: any;
}

interface PLUData {
  regles: Array<{
    nom: string;
    liste_regles: string[];
    numero_page?: number;
  }>;
  doc_url?: {
    doc_ecrit_url?: string[];
    doc_graph_url?: string[];
    doc_rest_url?: string[];
  };
}

interface FetchParams extends Record<string, string> {
  dep: string;
  adresse: string;
  partition: string;
  zonage: string;
  gpu_doc_id: string;
  nomfic: string;
  datvalid: string;
  typezone: string;
}

const processedZonage: { [key: string]: PLUData } = {};

const PLUSynthesis: React.FC<PLUSynthesisProps> = ({ addressData, zoningData }) => {
  const [loading, setLoading] = useState(false);
  const [plusData, setPlusData] = useState<PLUData | null>(null);
  const [error, setError] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  // Reset component state when new point data is selected
  useEffect(() => {
    setPlusData(null);
    setError('');
    setExpandedSections({});
    setLoading(false);
  }, [addressData, zoningData]);

  const buildFetchParams = (): FetchParams | null => {
    if (!zoningData?.partition || !zoningData?.libelle) {
      setError('Données manquantes pour la requête PLU');
      return null;
    }

    return {
      dep: addressData?.citycode.substring(0, 2),
      adresse: addressData?.label,
      partition: zoningData.partition,
      zonage: zoningData.libelle,
      gpu_doc_id: zoningData.gpu_doc_id,
      nomfic: zoningData.nomfic,
      datvalid: zoningData.datvalid,
      typezone: zoningData.typezone
    };
  };

  const fetchPLUData = async () => {
    const params = buildFetchParams();
    if (!params) return;

    setLoading(true);
    setError('');

    try {
      const key = `${params.partition}_${params.zonage}`;

      if (key in processedZonage) {
        setPlusData(processedZonage[key]);
        return;
      }

      const queryParams = new URLSearchParams(params);
      const response = await fetch(`http://127.0.0.1:5000/get_plu?${queryParams}`);

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données PLU');
      }

      const data: PLUData = await response.json();
      processedZonage[key] = data;
      setPlusData(data);

    } catch (err) {
      setError('Impossible de récupérer les données PLU. Veuillez re-essayer');
      console.error('Erreur PLU:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderPLUContent = () => {
    if (!plusData) return null;

    return (
      <div className="space-y-2">
        {plusData.regles.map((regle, index) => (
          <PLURule
            key={index}
            rule={regle}
            isExpanded={expandedSections[regle.nom]}
            onToggle={() => toggleSection(regle.nom)}
            documentUrls={plusData.doc_url}
          />
        ))}
      </div>
    );
  };

  const renderDocumentsSection = () => {
    if (!plusData?.doc_url) return null;

    const { doc_ecrit_url, doc_graph_url, doc_rest_url } = plusData.doc_url;
    const hasAnyDocuments = 
      (doc_ecrit_url && doc_ecrit_url.length > 0) ||
      (doc_graph_url && doc_graph_url.length > 0) ||
      (doc_rest_url && doc_rest_url.length > 0);

    if (!hasAnyDocuments) return null;

    return (
      <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200">
        <CollapsibleSection
          title="Documents PLU"
          isExpanded={expandedSections['plu-documents']}
          onToggle={() => toggleSection('plu-documents')}
          className="border-blue-200"
          headerClassName="bg-blue-100 hover:bg-blue-150 text-blue-800 px-4 py-3"
          contentClassName="p-4 space-y-4"
        >
          <DocumentSection
            title="Documents écrits"
            urls={doc_ecrit_url || []}
            isExpanded={expandedSections['written-docs']}
            onToggle={() => toggleSection('written-docs')}
          />
          <DocumentSection
            title="Documents graphiques"
            urls={doc_graph_url || []}
            isExpanded={expandedSections['graphical-docs']}
            onToggle={() => toggleSection('graphical-docs')}
          />
          <DocumentSection
            title="Autres documents"
            urls={doc_rest_url || []}
            isExpanded={expandedSections['other-docs']}
            onToggle={() => toggleSection('other-docs')}
          />
        </CollapsibleSection>
      </div>
    );
  };

  return (
    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
      {!plusData ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Cliquez sur le bouton ci-dessous pour obtenir la synthèse des règles du PLU.
          </p>
          <LoadingButton
            onClick={fetchPLUData}
            loading={loading}
          >
            Obtenir la synthèse PLU
          </LoadingButton>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}
        </div>
      ) : (
        <>
          {renderPLUContent()}
          {renderDocumentsSection()}
        </>
      )}
    </div>
  );
};

export default PLUSynthesis;
export { processedZonage };