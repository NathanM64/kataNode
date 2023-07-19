import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import CardList from './components/CardList';
import './App.scss';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null);

  const handleSearch = (query: SearchQuery) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      <CardList searchQuery={searchQuery} />
    </div>
  );
};

interface SearchQuery {
  name: string;
  types: string[];
  rarity: string;
}

export default App;
