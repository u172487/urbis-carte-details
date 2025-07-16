
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PrescriptionInfoProps {
  data?: any;
}

const PrescriptionInfo: React.FC<PrescriptionInfoProps> = ({ data }) => {
  if (!data?.features) {
    return (
      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-orange-200 rounded w-3/4"></div>
          <div className="h-4 bg-orange-200 rounded w-1/2"></div>
          <div className="h-4 bg-orange-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Group features by type
  const infoFeatures = data.features.filter((f: any) => f.id?.startsWith('info_'));
  const prescriptionFeatures = data.features.filter((f: any) => f.id?.startsWith('prescription_'));
  const generateurFeatures = data.features.filter((f: any) => f.id?.startsWith('generateur_'));

  const renderFeatureList = (features: any[], emptyMessage: string) => {
    if (features.length === 0) {
      return <p className="text-slate-500 text-sm italic">{emptyMessage}</p>;
    }

    return (
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded border border-slate-200 p-3">
            {feature.properties?.libelle && (
              <div className="font-medium text-slate-800 mb-1">
                {feature.properties.libelle}
              </div>
            )}
            {feature.properties?.txt && (
              <div className="text-sm text-slate-600">
                {feature.properties.txt}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
      <Accordion type="multiple" defaultValue={["info", "prescription", "servitude"]}>
        <AccordionItem value="info">
          <AccordionTrigger className="text-sm font-medium">
            Info ({infoFeatures.length})
          </AccordionTrigger>
          <AccordionContent>
            {renderFeatureList(infoFeatures, "Aucune information disponible")}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="prescription">
          <AccordionTrigger className="text-sm font-medium">
            Prescription ({prescriptionFeatures.length})
          </AccordionTrigger>
          <AccordionContent>
            {renderFeatureList(prescriptionFeatures, "Aucune prescription disponible")}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="servitude">
          <AccordionTrigger className="text-sm font-medium">
            Servitude ({generateurFeatures.length})
          </AccordionTrigger>
          <AccordionContent>
            {renderFeatureList(generateurFeatures, "Aucune servitude disponible")}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PrescriptionInfo;
