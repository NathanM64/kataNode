import React, { useState, useEffect } from 'react';
import { SearchQuery } from './SearchForm';

const API_URL = 'https://api.magicthegathering.io/v1/cards';

interface CardListProps {
  searchQuery: SearchQuery | null;
}

interface Card {
  id: string;
  name: string;
  text: string;
  types: string[];
  rarity: string;
}

interface SearchQuery {
  name: string;
  types: string[];
  rarity: string;
}

const CardList: React.FC<CardListProps> = ({searchQuery}) => {
  
  const [cards, setCards] = useState<Card[]>([]);
  const API_URL_CARDS = 'https://api.magicthegathering.io/v1/cards';

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) {
      if (searchQuery.name) {
        params.append('name', searchQuery.name);
      }

      if (searchQuery.types.length > 0) {
        params.append('types', searchQuery.types.join(','));
      }

      if (searchQuery.rarity) {
        params.append('rarity', searchQuery.rarity);
      }
    }

    fetch(`${API_URL_CARDS}?${params.toString()}`)
      .then(response => response.json())
      .then(data => setCards(data.cards))
      .catch(error => console.error(error));
  }, [searchQuery]);

  return (
    <div className='cardList-container'>
      <div className='cardList-list'>
        {cards.map(card => (
          <div key={card.id} className='cardList-card' style={{ backgroundColor: getRarityColor(card.rarity) }}>
            <h3>{card.name}</h3>
            <p>{card.text}</p>
            <p>Types: {card.types.join(', ')}</p>
            <p>Rareté: {card.rarity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'Common':
      return '#2e2e2e';
    case 'Uncommon':
      return '#ababab';
    case 'Rare':
      return '#ffca00';
    case 'Mythic Rare':
      return '#ff8600';
    case 'Special':
      return '#fd6ee1';
    case 'Basic Land':
      return '#000000';
    default:
      return 'transparent';
  }
};

export default CardList;