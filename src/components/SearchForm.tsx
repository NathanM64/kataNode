import React, { useState, useEffect } from 'react';
import AutoComplete from './AutoComplete';
import { SearchQuery } from '../App';

export interface SearchQuery {
  name: string;
  types: string[];
  rarity: string;
}

interface SearchFormProps {
  onSearch: (searchQuery: SearchQuery) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [name, setName] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [typesOptions, setTypesOptions] = useState<string[]>([]);
  const [rarity, setRarity] = useState('');
  const API_URL_TYPES = 'https://api.magicthegathering.io/v1/types';

  useEffect(() => {
    fetch(API_URL_TYPES)
      .then(response => response.json())
      .then(data => setTypesOptions(data.types))
      .catch(error => console.error(error));
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleTypeChange = (selectedTypes: string[]) => {
    setTypes(selectedTypes);
  };

  const handleRarityChange = (selectedRarity: string[]) => {
    setRarity(selectedRarity[0]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const searchQuery: SearchQuery = {
      name,
      types,
      rarity,
    };

    onSearch(searchQuery);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className='search-form'>
        <div className='formGroup'>
          <label>Nom</label>
          <input type="text" value={name} onChange={handleNameChange} className='search-input'/>
        </div>
        <div className='formGroup'>
          <label>Type</label>
          <AutoComplete key={1} options={typesOptions} onChange={handleTypeChange} allowMultiple={true}/>
        </div>
        <div className='formGroup'>
          <label>Rareté</label>
          <AutoComplete key={2} isRarity={true} options={rarityOptions} onChange={handleRarityChange} />
        </div>
        <div className='formGroup'>
          <button type="submit" className=''>Rechercher</button>
        </div>
      </form>
    </div>
  );
};

const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Mythic Rare', 'Special', 'Basic Land'];

export default SearchForm;