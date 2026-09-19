import React from 'react';
import { Search, X, SlidersHorizontal, UserCheck } from 'lucide-react';
import { BookGenre } from '../../types';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onResetFilters: () => void;
}

const GENRE_CHIPS: { label: string; value: string }[] = [
  { label: 'All Catalog', value: 'all' },
  { label: 'Sci-Fi Thriller', value: 'Sci-Fi Thriller' },
  { label: 'Cyberpunk', value: 'Cyberpunk' },
  { label: 'Space Opera', value: 'Space Opera' },
  { label: 'Noir Mystery', value: 'Noir Mystery' },
  { label: 'Audiobook Top Picks', value: 'Audiobook' },
  { label: 'Dystopian Tech', value: 'Dystopian Tech' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onSelectGenre,
  selectedLetter,
  onSelectLetter,
  sortBy,
  onSortChange,
  onResetFilters
}) => {
  const hasActiveFilters = searchQuery !== '' || selectedGenre !== 'all' || selectedLetter !== '';

  return (
    <div className="w-full space-y-4 mb-8">
      
      {/* Search Input and Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        
        {/* Multi-attribute search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="reader-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, genre category, or author name..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              id="reader-sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort books catalog by"
              className="appearance-none bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm font-medium py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value="featured">Featured &amp; Trending</option>
              <option value="rating">Highest Rated</option>
              <option value="author-asc">Author Name (A → Z)</option>
              <option value="title-asc">Title (A → Z)</option>
              <option value="price-asc">Price: Low to High</option>
            </select>
            <SlidersHorizontal className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          {hasActiveFilters && (
            <button
              id="reader-clear-filters-button"
              onClick={onResetFilters}
              className="px-3 py-2.5 text-xs font-medium text-amber-400 hover:text-amber-300 hover:bg-slate-900 border border-slate-800 rounded-xl transition-colors whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>

      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-slate-400 font-mono flex-shrink-0 mr-1">GENRE:</span>
        {GENRE_CHIPS.map((chip) => {
          const isActive = selectedGenre === chip.value;
          return (
            <button
              key={chip.value}
              id={`genre-chip-${chip.value.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectGenre(chip.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Alphabetical Author Filter Bar (A-Z) */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1 pt-1 border-t border-slate-900">
        <span className="text-[11px] text-slate-400 font-mono flex-shrink-0 mr-1 flex items-center gap-1">
          <UserCheck className="w-3 h-3 text-slate-400" />
          AUTHOR:
        </span>
        <button
          onClick={() => onSelectLetter('')}
          className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
            selectedLetter === ''
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ALL
        </button>
        {ALPHABET.map((char) => {
          const isSelected = selectedLetter === char;
          return (
            <button
              key={char}
              onClick={() => onSelectLetter(char)}
              className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-mono transition-colors ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {char}
            </button>
          );
        })}
      </div>

    </div>
  );
};
