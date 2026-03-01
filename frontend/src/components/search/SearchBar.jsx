import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import SearchResults from './SearchResults';
import SearchSuggestions from './SearchSuggestions';
import { products, searchKeywords } from '../../data/products';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Advanced search
  const searchProducts = (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const lowerQuery = searchQuery.toLowerCase().trim();
    const searchTerms = lowerQuery.split(' ').filter(term => term.length > 0);

    // Keyword mapping results
    let keywordResults = [];
    searchTerms.forEach(term => {
      const matchedIds = searchKeywords[term] || [];
      matchedIds.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product && !keywordResults.find(p => p.id === product.id)) {
          keywordResults.push({ ...product, searchScore: 200 });
        }
      });
    });

    // Field search results
    const fieldResults = products.filter(product => {
      if (keywordResults.find(p => p.id === product.id)) return false;

      const searchableFields = [
        product.name,
        product.brand,
        product.category,
        product.subcategory,
        product.tag,
        product.description || '',
        ...(product.keywords || [])
      ].map(field => field?.toLowerCase() || '');

      const combinedText = searchableFields.join(' ');
      const matchesAny = searchTerms.some(term => combinedText.includes(term));

      if (!matchesAny) return false;

      let score = 0;
      if (combinedText.includes(lowerQuery)) score += 100;
      searchTerms.forEach(term => {
        if (product.name.toLowerCase().includes(term)) score += 50;
        if (product.brand?.toLowerCase().includes(term)) score += 40;
        if (product.category?.toLowerCase().includes(term)) score += 30;
      });

      product.searchScore = score;
      return score > 0;
    });

    const allResults = [...keywordResults, ...fieldResults]
      .sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0))
      .slice(0, 15);

    setTimeout(() => {
      setResults(allResults);
      setIsLoading(false);
    }, 100);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(true);
    searchProducts(value);
  };

  const handleSuggestionSelect = (term) => {
    setQuery(term);
    searchProducts(term);
  };

  const handleSelectProduct = (product) => {
    const updatedRecent = [
      query,
      ...recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase())
    ].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
    navigate(`/product/${product.id}`);
    setQuery('');
    setShowResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowResults(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div 
      ref={searchRef} 
      style={{ 
        position: 'relative', 
        flex: 1, 
        maxWidth: '600px'
      }}
    >
      {/* Search Input - Dark Theme */}
      <motion.div 
        animate={{
          boxShadow: showResults 
            ? '0 8px 30px rgba(255,107,53,0.15)' 
            : '0 2px 10px rgba(0,0,0,0.2)'
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: showResults ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)',
          borderRadius: '50px',
          padding: '4px 6px 4px 20px',
          border: showResults ? '2px solid #ff6b35' : '1px solid rgba(255,255,255,0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        <MagnifyingGlassIcon style={{ 
          width: '20px', 
          height: '20px', 
          color: showResults ? '#ff6b35' : '#a0a0a0',
          marginRight: '12px',
          transition: 'color 0.3s ease'
        }} />
        
        <input
          type="text"
          placeholder="Search for products, brands..."
          value={query}
          onChange={handleSearch}
          onFocus={() => setShowResults(true)}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '15px',
            color: '#fff',
            padding: '12px 0'
          }}
        />

        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(255,255,255,0.2)',
              borderTopColor: '#ff6b35',
              borderRadius: '50%',
              marginRight: '8px'
            }}
          />
        )}

        {query && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '4px'
            }}
          >
            <XMarkIcon style={{ width: '16px', height: '16px', color: '#a0a0a0' }} />
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (query.trim()) {
              searchProducts(query);
            }
          }}
          style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            border: 'none',
            borderRadius: '50px',
            padding: '12px 24px',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Search
        </motion.button>
      </motion.div>

      {/* Results or Suggestions */}
      <AnimatePresence>
        {showResults && (
          query.length >= 2 ? (
            <SearchResults
              query={query}
              results={results}
              onClose={() => {
                setShowResults(false);
                setQuery('');
              }}
              onSelect={handleSelectProduct}
              recentSearches={recentSearches}
            />
          ) : (
            <SearchSuggestions 
              onSelect={handleSuggestionSelect}
              recentSearches={recentSearches}
            />
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;