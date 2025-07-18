import React, { useState } from 'react';
import { Textarea } from './ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { processedZonage }  from "../components/PLUSynthesis";

interface QuestionInputProps {
  addressData?: any;
  zoningData?: any;
}

interface ApiResponse {
  reponse: string;
  doc_url: string[];
}

const chatHistory = {};

const QuestionInput: React.FC<QuestionInputProps> = ({ addressData, zoningData }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const { toast } = useToast();

  // Simple Markdown renderer for bold text
  const renderMarkdown = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index}>{boldText}</strong>;
      }
      return part;
    });
  };

  const fetchAnswer = async (questionText: string) => {
    if (!addressData || !zoningData) {
      toast({
        title: "Données manquantes",
        description: "Les données d'adresse et de zonage doivent être chargées avant de poser une question.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResponse(null); // Clear previous response

    try {
      // Extract parameters from addressData and zoningData
      const dep = addressData.citycode?.substring(0, 2);
      const adresse = addressData.label;
      const partition = zoningData.partition;
      const zonage = zoningData.libelle;
      const gpu_doc_id = zoningData.gpu_doc_id;
      const nomfic = zoningData.nomfic;
      const datvalid = zoningData.datvalid;
      const typezone = zoningData.typezone;

      const key = `${partition}_${zonage}`;
      let regles =''
      console.log("processedZonage", processedZonage)
      if (key in processedZonage){
        regles = JSON.stringify(processedZonage[key]);
      }

      let history = [];
      if (key in chatHistory) {
        history = chatHistory[key];
      } else {
        chatHistory[key] = [];
      }

      // Create query parameters
      const params = new URLSearchParams({
        question: questionText,
        regles: regles,
        history: JSON.stringify(history),
        ...(dep && { dep }),
        ...(adresse && { adresse }),
        ...(partition && { partition }),
        ...(zonage && { zonage }),
        ...(gpu_doc_id && { gpu_doc_id }),
        ...(nomfic && { nomfic }),
        ...(datvalid && { datvalid }),
        ...(typezone && { typezone }),
      });

      const apiResponse = await fetch(`http://127.0.0.1:5000/question?${params.toString()}`);
      
      if (!apiResponse.ok) {
        throw new Error(`Erreur ${apiResponse.status}: ${apiResponse.statusText}`);
      }

      const answer = await apiResponse.json();
      
      // Store the response for display
      setResponse(answer);
      
      toast({
        title: "Question envoyée",
        description: "Votre question a été traitée avec succès.",
      });

      console.log('Réponse reçue:', answer);

      chatHistory[key] = chatHistory[key] || [];
      chatHistory[key].push({
        question: questionText,
        response: answer.reponse,
      });
      
      // Clear the question after successful submission
      setQuestion('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la question:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la question. Vérifiez votre connexion et réessayez.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      fetchAnswer(question.trim());
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Posez votre question sur cette zone..."
          className="text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={3}
        />
        <button
          type="submit"
          disabled={!question.trim() || loading || !addressData || !zoningData}
          className="w-full py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer la question'}
        </button>
      </form>

      {/* Response Section with scrollable content */}
      {response && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <h5 className="text-sm font-medium text-slate-700 mb-2">Réponse</h5>
          <div className="max-h-64 overflow-y-auto text-sm text-slate-600 mb-3 leading-relaxed">
            {renderMarkdown(response.reponse)}
          </div>
          {(response.doc_url[0] || response.doc_url[1]) && (
            <div className="flex flex-col gap-1">
              {response.doc_url[0] && (
                <a
                  href={response.doc_url[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 text-xs font-medium underline"
                >
                  Consulter le règlement écrit
                </a>
              )}
              {response.doc_url[1] && (
                <a
                  href={response.doc_url[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 text-xs font-medium underline"
                >
                  Consulter le règlement graphique
                </a>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default QuestionInput;
