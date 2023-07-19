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
      <div className='app'>
        <div>
          <SearchForm onSearch={handleSearch} />
        </div>
        <div>
          <CardList searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export interface SearchQuery {
  name: string;
  types: string[];
  rarity: string;
}

export default App;
