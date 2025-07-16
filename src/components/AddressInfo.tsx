
import React from 'react';

interface AddressInfoProps {
  data?: any;
}

const AddressInfo: React.FC<AddressInfoProps> = ({ data }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      {data ? (
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-slate-600">Adresse :</span>
            <p className="text-slate-800">{data.label || 'Non disponible'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-slate-600">Code INSEE :</span>
            <p className="text-slate-800">{data.citycode || 'Non disponible'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-slate-600">Département :</span>
            <p className="text-slate-800">{data.context || 'Non disponible'}</p>
          </div>
        </div>
      ) : (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-blue-200 rounded w-3/4"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
          <div className="h-4 bg-blue-200 rounded w-2/3"></div>
        </div>
      )}
    </div>
  );
};

export default AddressInfo;
