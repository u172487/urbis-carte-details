import React from 'react';
import CollapsibleSection from './CollapsibleSection';

interface PLURule {
  nom: string;
  liste_regles: string[];
  numero_page?: number;
}

interface DocumentUrls {
  doc_ecrit_url?: string[];
  doc_graph_url?: string[];
  doc_rest_url?: string[];
}

interface PLURuleProps {
  rule: PLURule;
  isExpanded: boolean;
  onToggle: () => void;
  documentUrls?: DocumentUrls;
}

const PLURule: React.FC<PLURuleProps> = ({
  rule,
  isExpanded,
  onToggle,
  documentUrls
}) => {
  return (
    <CollapsibleSection
      title={rule.nom}
      isExpanded={isExpanded}
      onToggle={onToggle}
      className="border-amber-200"
      headerClassName="bg-amber-100 hover:bg-amber-150 text-amber-800"
      contentClassName="bg-white space-y-2"
    >
      <ul className="list-disc pl-5 text-slate-700 text-sm space-y-1">
        {rule.liste_regles.map((item: string, idx: number) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      
      <div className="flex flex-wrap gap-3 mt-2">
        {documentUrls?.doc_ecrit_url?.length > 0 && (
          <a
            href={`${documentUrls.doc_ecrit_url[0].split('#')[0]}#page=${rule.numero_page}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 text-sm font-medium px-3 py-1 my-2 rounded-md hover:bg-amber-900 hover:text-white transition-colors"
          >
            Consulter l'article
          </a>
        )}
        {documentUrls?.doc_graph_url?.length > 0 && (
          <a
            href={`${documentUrls.doc_graph_url[0].split('#')[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 text-sm font-medium px-3 py-1 my-2 rounded-md hover:bg-amber-900 hover:text-white transition-colors"
          >
            Consulter le document graphique
          </a>
        )}
      </div>
    </CollapsibleSection>
  );
};

export default PLURule;