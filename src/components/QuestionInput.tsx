
import React, { useState } from 'react';

const QuestionInput: React.FC = () => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      // Ici vous pourriez implémenter l'envoi de la question
      console.log('Question posée:', question);
      alert('Fonctionnalité à implémenter : ' + question);
      setQuestion('');
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-slate-700 mb-2">
        Questions ou clarifications
      </h4>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Posez votre question sur cette zone..."
          className="w-full p-2 border border-slate-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
        <button
          type="submit"
          disabled={!question.trim()}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          Envoyer la question
        </button>
      </form>
    </div>
  );
};

export default QuestionInput;
