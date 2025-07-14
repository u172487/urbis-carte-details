
import React, { useState } from 'react';

interface PLUSynthesisProps {
  addressData?: any;
  zoningData?: any;
}

const PLUSynthesis: React.FC<PLUSynthesisProps> = ({ addressData, zoningData }) => {
  const [loading, setLoading] = useState(false);
  const [plusData, setPlusData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});


  const fetchPLUData = async () => {
    if (!zoningData?.partition || !zoningData?.libelle) {
      setError('Données manquantes pour la requête PLU');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dep = addressData?.citycode.substring(0, 2);
      const adresse = addressData?.label
      const partition = zoningData.partition;
      const zonage = zoningData.libelle;  
      const gpu_doc_id = zoningData.gpu_doc_id
      const nomfic = zoningData.nomfic
      const datvalid = zoningData.datvalid
      const typezone = zoningData.typezone
      console.log(addressData, zoningData)

      const baseUrl = "http://127.0.0.1:5000/get_plu";

      const queryParams = new URLSearchParams({
          dep,
          partition,
          zonage,
          gpu_doc_id,
          nomfic,
          datvalid,
          typezone,
          adresse  
      });

      const response = await fetch(`${baseUrl}?${queryParams}`);

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données PLU');
      }

      const data = await response.json();
      console.log(data)
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

  return (
    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
      <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Synthèse PLU
      </h3>

      {!plusData ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Cliquez sur le bouton ci-dessous pour obtenir la synthèse des règles du PLU.
          </p>
          <button
            onClick={fetchPLUData}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Chargement...
              </div>
            ) : (
              'Obtenir la synthèse PLU'
            )}
          </button>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {plusData.regles.map((regle: any, index: number) => (
            <div key={index} className="border border-amber-200 rounded">
              <button
                onClick={() => toggleSection(regle.nom)}
                className="w-full px-3 py-2 text-left bg-amber-100 hover:bg-amber-150 transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-amber-800">{regle.nom}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    expandedSections[regle.nom] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedSections[regle.nom] && (
                <div className="px-3 py-2 bg-white space-y-2">
                  <ul className="list-disc pl-5 text-slate-700 text-sm space-y-1">
                    {regle.liste_regles.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <a
                    href={`${plusData.doc_url.split('#')[0]}#page=${regle.numero_page}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 text-sm underline hover:text-amber-900"
                  >
                    Consulter l'article
                  </a>
                </div>
              )}
            </div>

          ))}
        </div>
      )}
    </div>
  );
};

export default PLUSynthesis;
