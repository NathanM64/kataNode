import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import { SearchQuery } from '../App.tsx';

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

const CardList: React.FC<CardListProps> = ({ searchQuery }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  const fetchData = async () => {
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

    const offset = (currentPage - 1) * pageSize;
    params.append('pageSize', pageSize.toString());
    params.append('page', offset.toString());

    console.log(params.offset)
    const response = await fetch(`${API_URL}?${params.toString()}`);
    const data = await response.json();

    setCards(data.cards);

    const totalCountHeader = response.headers.get('total-count');
    const totalCount = totalCountHeader ? parseInt(totalCountHeader) : 0;
    const calculatedTotalPages = Math.ceil(totalCount / pageSize);
    setTotalPages(calculatedTotalPages);
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, pageSize, currentPage]); // La dépendance currentPage est supprimée ici

  useEffect(() => {
    setCurrentPage(1); // Réinitialise currentPage à 1 à chaque changement de searchQuery
  }, [searchQuery]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    console.log(currentPage)
    setCurrentPage(page);
  };

  return (
    <div className='cardList-container'>
      <div className='cardList-list'>
        {cards.map(card => (
          <div key={card.id} className='cardList-card' style={{background: getRarityColor(card.rarity)}}>
            <h3>{card.name}</h3>
            <p>{card.text}</p>
            <p>Types: {card.types.join(', ')}</p>
            <p>Rarity: {card.rarity}</p>
          </div>
        ))}
      </div>
      <ThemeProvider theme={paginationTheme}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
      </ThemeProvider>
    </div>
  );
};

const paginationTheme = createTheme({
  components: {
    MuiPagination: {
      styleOverrides: {
        root: {
          display: 'flex',
          justifyContent: 'center',
          marginTop: '16px',
        },
      },
    },
  },
});

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'Common':
      return '#2e2e2e';
    case 'Uncommon':
      return '#ababab';
    case 'Rare':
      return '#ffca00';
    case 'Mythic':
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
