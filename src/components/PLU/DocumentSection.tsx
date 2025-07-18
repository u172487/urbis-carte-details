import React from 'react';
import CollapsibleSection from './CollapsibleSection';

interface DocumentSectionProps {
  title: string;
  urls: string[];
  isExpanded: boolean;
  onToggle: () => void;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({
  title,
  urls,
  isExpanded,
  onToggle
}) => {
  if (!urls || urls.length === 0) {
    return null;
  }

  return (
    <CollapsibleSection
      title={title}
      isExpanded={isExpanded}
      onToggle={onToggle}
      className="border-blue-200"
      headerClassName="bg-blue-50 hover:bg-blue-100 text-blue-700"
      contentClassName="bg-white space-y-2"
    >
      {urls.map((url: string, index: number) => {
        const fileName = url.split('/').pop() || url;
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 text-sm hover:text-blue-800 hover:underline break-all"
          >
            {fileName}
          </a>
        );
      })}
    </CollapsibleSection>
  );
};

export default DocumentSection;