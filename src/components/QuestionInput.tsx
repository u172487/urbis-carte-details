
import React, { useState } from 'react';
import { Textarea } from './ui/textarea';
import { useToast } from "@/hooks/use-toast";

interface QuestionInputProps {
  addressData?: any;
  zoningData?: any;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ addressData, zoningData }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

      // Create query parameters
      const params = new URLSearchParams({
        question: questionText,
        ...(dep && { dep }),
        ...(adresse && { adresse }),
        ...(partition && { partition }),
        ...(zonage && { zonage }),
        ...(gpu_doc_id && { gpu_doc_id }),
        ...(nomfic && { nomfic }),
        ...(datvalid && { datvalid }),
        ...(typezone && { typezone }),
      });

      const response = await fetch(`http://127.0.0.1:5000/question?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const answer = await response.json();
      
      toast({
        title: "Question envoyée",
        description: "Votre question a été traitée avec succès.",
      });

      console.log('Réponse reçue:', answer);
      
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
      <h4 className="text-sm font-medium text-slate-700 mb-2">
        Questions ou clarifications
      </h4>
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
    </div>
  );
};

export default QuestionInput;
