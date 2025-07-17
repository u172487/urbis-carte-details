
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Map, FileText, Building2, MessageSquare, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleStartExploring = () => {
    navigate('/app');
  };

  const handleContact = () => {
    window.location.href = 'mailto:contact@setbysetec.com';
  };

  const features = [
    {
      icon: Map,
      title: "Carte interactive",
      description: "Cliquez sur une parcelle pour obtenir les données d'urbanisme."
    },
    {
      icon: Building2,
      title: "Zonage & PLU",
      description: "Accès rapide aux règles de zonage et documents réglementaires."
    },
    {
      icon: FileText,
      title: "Prescriptions locales",
      description: "Consultez les contraintes spécifiques comme les hauteurs, zones archéologiques, etc."
    },
    {
      icon: MessageSquare,
      title: "Questions en langage naturel",
      description: "Posez une question du type \"Puis-je construire un étage ici ?\""
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a 
              href="https://www.setbysetec.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xl font-bold text-[#07a549] hover:text-[#07a549]/80 transition-colors"
            >
              Set By Setec
            </a>
            <Button 
              variant="outline" 
              onClick={handleContact}
              className="hidden sm:flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Nous contacter
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 animate-fade-in">
              Explorez les règles d'urbanisme
              <span className="block text-[#07a549]">en un clic</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Un outil interactif pour consulter instantanément les règles du PLU, 
              les prescriptions locales et les documents d'urbanisme applicables à une parcelle.
            </p>
            
            <Button 
              onClick={handleStartExploring}
              className="bg-[#07a549] hover:bg-[#07a549]/90 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Commencer l'exploration
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Fonctionnalités principales
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Découvrez tous les outils mis à votre disposition pour une analyse urbanistique complète
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-lg border border-slate-200 hover:border-[#07a549]/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-[#07a549]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#07a549]/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-[#07a549]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Interface intuitive
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Découvrez l'interface que vous utiliserez pour explorer les données d'urbanisme
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="aspect-video bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-24 h-24 text-[#07a549] mx-auto mb-4" />
                  <p className="text-slate-600 text-lg">
                    Aperçu de l'interface interactive
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    Carte avec panneau latéral d'informations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#07a549]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Prêt à explorer ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Commencez dès maintenant votre analyse urbanistique interactive
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleStartExploring}
              variant="secondary"
              className="bg-white text-[#07a549] hover:bg-white/90 px-8 py-3 text-lg font-semibold"
            >
              Commencer l'exploration
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={handleContact}
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
            >
              <Mail className="mr-2 w-5 h-5" />
              Nous contacter
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-400">
              Données fournies par le Géoportail de l'Urbanisme.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
