import React, { useState, useRef, useEffect } from 'react';
import { getRarityColor } from './CardList';

interface AutoCompleteProps {
  options: string[];
  onChange: (selectedValues: string[]) => void;
  allowMultiple?: boolean;
  isRarity?: boolean;
  label?: string;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  options,
  onChange,
  allowMultiple = false,
  isRarity = false,
  label,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const blurTimeoutRef = useRef<number | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const handleOptionClick = (option: string) => {
    if (allowMultiple) {
      if (!selectedValues.includes(option)) {
        const newSelectedValues = [...selectedValues, option];
        setSelectedValues(newSelectedValues);
        onChange(newSelectedValues);
      }
      setInputValue('');
      inputRef.current!.focus();
    } else {
      setSelectedValues([option]);
      onChange([option]);
      setInputValue('');
      inputRef.current!.focus();
    }
  };

  const handleInputFocus = () => {
    clearTimeout(blurTimeoutRef.current);
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleTagRemove = (value: string) => {
    const newSelectedValues = selectedValues.filter(val => val !== value);
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  const filterOptions = (value: string) => {
    return options.filter(option => option.toLowerCase().includes(value.toLowerCase()) && !selectedValues.includes(option));
  };

  const filteredOptions = filterOptions(inputValue);

  const handleClickOutside = (event: MouseEvent) => {
    if (listRef.current && !listRef.current.contains(event.target as Node)) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  return (
    <div className="autocomplete">
      {selectedValues.length > 0 && (
        <div className="tags">
          {selectedValues.map(value => (
            <span
              key={value}
              className="tag"
              style={{ backgroundColor: isRarity ? getRarityColor(value) : 'lightgray', color: isRarity ? 'white' : 'black' }}
            >
              {value}
              <button type="button" onClick={() => handleTagRemove(value)}>
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
      {label && <label>{label}</label>}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={inputRef}
        className='search-input'
      />
      {isFocused && (
        <ul className="autocomplete-list" ref={listRef}>
          {filteredOptions.map(option => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className={selectedValues.includes(option) ? 'selected' : ''}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
