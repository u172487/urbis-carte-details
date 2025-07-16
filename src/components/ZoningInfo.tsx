
import React from 'react';

interface ZoningInfoProps {
  data?: any;
}

const formatDate = (dateStr: string): string => {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${day}/${month}/${year}`;
};

const ZoningInfo: React.FC<ZoningInfoProps> = ({ data }) => {
  
  return (
    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
      {data ? (
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-slate-600">Type de document :</span>
              <p className="text-slate-800 font-medium">
                {data.typezone === 'x' ? 'Carte communale'  : 'PLU/PLUi'}
              </p>
          </div>
          <div>
            <span className="text-sm font-medium text-slate-600">Zonage :</span>
            <p className="text-slate-800 font-medium">{data.libelle || 'Non disponible'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-slate-600">Type de zone :</span>
            <p className="text-slate-800">{data.typezone || 'Non disponible'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-slate-600">Statut :</span>
            <p className="text-slate-800">{data.gpu_status || 'Non disponible'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-slate-600">Partition :</span>
            <p className="text-slate-800">{data.partition || 'Non disponible'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-slate-600">Date de validation :</span>
            <p className="text-slate-800">{data.datvalid ? formatDate(data.datvalid) : 'Non disponible'}</p>
          </div>
          {data.libelong && (
            <div>
              <span className="text-sm font-medium text-slate-600">Description :</span>
              <p className="text-slate-800 text-sm mt-1">{data.libelong}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-green-200 rounded w-3/4"></div>
          <div className="h-4 bg-green-200 rounded w-1/2"></div>
          <div className="h-4 bg-green-200 rounded w-2/3"></div>
          <div className="h-4 bg-green-200 rounded w-1/3"></div>
        </div>
      )}
    </div>
  );
};

export default ZoningInfo;
