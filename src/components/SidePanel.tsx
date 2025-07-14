
import React from 'react';
import { ClickData } from '../pages/Index';
import AddressInfo from './AddressInfo';
import ZoningInfo from './ZoningInfo';
import PLUSynthesis from './PLUSynthesis';
import QuestionInput from './QuestionInput';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  clickData: ClickData | null;
  loading: boolean;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, clickData, loading }) => {
  return (
    <div
      className={`fixed right-0 top-0 h-full w-[40rem] bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Informations du point</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && !clickData?.addressData && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-slate-600">Chargement des données...</span>
            </div>
          )}

          {clickData && (
            <div className="space-y-6 p-4">
              <AddressInfo data={clickData.addressData} />
              <ZoningInfo data={clickData.zoningData} />
              <PLUSynthesis 
                addressData={clickData.addressData}
                zoningData={clickData.zoningData}
              />
            </div>
          )}
        </div>

        {/* Question Input */}
        {clickData && (
          <div className="border-t border-slate-200 p-4">
            <QuestionInput 
              addressData={clickData.addressData}
              zoningData={clickData.zoningData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
