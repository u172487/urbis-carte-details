import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchResult {
  x: number;
  y: number;
  fulltext: string;
  names: string[];
  zipcode?: string;
}

interface GeocodingSearchProps {
  onLocationSelect: (lat: number, lon: number) => void;
}

const GeocodingSearch: React.FC<GeocodingSearchProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const searchRef = useRef<HTMLDivElement>(null);

  const searchGeocoding = async (searchTerm: string) => {
    if (searchTerm.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://data.geopf.fr/geocodage/completion?gp-access-lib=3.4.6&text=${encodeURIComponent(searchTerm)}&type=PositionOfInterest,StreetAddress&terr=&maximumResponses=10`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results) {
        setResults(data.results);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche géocodage:', error);
      setResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce the search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      searchGeocoding(value);
    }, 300);
  };

  const handleResultSelect = (result: SearchResult) => {
    setQuery(result.fulltext);
    setShowResults(false);
    onLocationSelect(result.y, result.x); // Note: API returns x=lon, y=lat
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div ref={searchRef} className="relative w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher une adresse..."
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-4 w-full"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Results dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultSelect(result)}
              className={cn(
                "w-full text-left px-4 py-3 hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
                "flex items-center gap-3 border-b border-border last:border-b-0"
              )}
            >
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {result.fulltext}
                </div>
                {result.names && result.names.length > 0 && (
                  <div className="text-xs text-muted-foreground truncate">
                    {result.names.join(', ')}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeocodingSearch;