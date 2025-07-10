
import React from 'react';

interface AddressInfoProps {
  data?: any;
}

const AddressInfo: React.FC<AddressInfoProps> = ({ data }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Informations générales
      </h3>
      
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
