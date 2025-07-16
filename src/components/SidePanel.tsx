import React from 'react';
import { ClickData } from '../pages/Index';
import AddressInfo from './AddressInfo';
import ZoningInfo from './ZoningInfo';
import PLUSynthesis from './PLUSynthesis';
import QuestionInput from './QuestionInput';
import PrescriptionInfo from './PrescriptionInfo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

        {/* Content - Single scrollable container */}
        <div className="flex-1 overflow-y-auto">
          {loading && !clickData?.addressData && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-slate-600">Chargement des données...</span>
            </div>
          )}

          {clickData && (
            <div className="p-4">
              <Accordion type="multiple" defaultValue={["general", "zoning", "prescription", "plu", "questions"]} className="space-y-2">
                <AccordionItem value="general">
                  <AccordionTrigger className="text-base font-semibold">
                    Informations générales
                  </AccordionTrigger>
                  <AccordionContent>
                    <AddressInfo data={clickData.addressData} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="zoning">
                  <AccordionTrigger className="text-base font-semibold">
                    Zonage
                  </AccordionTrigger>
                  <AccordionContent>
                    <ZoningInfo data={clickData.zoningData} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="prescription">
                  <AccordionTrigger className="text-base font-semibold">
                    Prescription
                  </AccordionTrigger>
                  <AccordionContent>
                    <PrescriptionInfo data={clickData.prescriptionData} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="plu">
                  <AccordionTrigger className="text-base font-semibold">
                    Synthèse PLU
                  </AccordionTrigger>
                  <AccordionContent>
                    <PLUSynthesis 
                      addressData={clickData.addressData}
                      zoningData={clickData.zoningData}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="questions">
                  <AccordionTrigger className="text-base font-semibold">
                    Questions ou clarifications
                  </AccordionTrigger>
                  <AccordionContent>
                    <QuestionInput 
                      addressData={clickData.addressData}
                      zoningData={clickData.zoningData}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
