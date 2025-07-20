import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
    <Accordion type="single" collapsible value={isExpanded ? "item" : ""} onValueChange={() => onToggle()}>
      <AccordionItem value="item" className="border-blue-200">
        <AccordionTrigger className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 [&[data-state=open]>svg]:rotate-180">
          {title}
        </AccordionTrigger>
        <AccordionContent className="bg-white px-3 py-2 space-y-2">
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DocumentSection;