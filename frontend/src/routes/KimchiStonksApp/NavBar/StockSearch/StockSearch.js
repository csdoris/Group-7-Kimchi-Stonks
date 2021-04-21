import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import InputField from '../../../../components/InputField/InputField';
import { AuthContext } from '../../../../contexts/Auth';
import { StockContext } from '../../../../contexts/Stock';

import './StockSearch.scss';

const URL = process.env.REACT_APP_API_URL;

function StockSearch() {
  const { user } = useContext(AuthContext);
  const { retrieveStockData } = useContext(StockContext);

  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (search === '') {
      setSuggestions([]);
    } else {
      console.log('Searching ...');
      axios.get(`${URL}/dashboard/search?keyword=${search}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken.token}`,
        },
      }).then((res) => {
        const { status, data } = res;

        if (status === 200) {
          console.log(data);
          setSuggestions(data.matches);
        }
      });
    }
  }, [search]);

  function handleSuggestionSelection() {
    retrieveStockData('IBM', 'WEEK');
  }

  return (
    <div className="stock-search-container">
      <InputField
        autoComplete="off"
        className="search"
        type="text"
        name="search"
        value={search}
        placeholder="Search Stonks"
        onChange={(event) => setSearch(event.target.value)}
      />
      { suggestions.length !== 0 && search !== ''
        ? (
          <ul className="suggestion-list">
            {suggestions.map((suggestion) => (
              <li key={suggestion.symbol}>
                <div className="suggestion-item" onClick={handleSuggestionSelection}>
                  <p className="suggestion-text">
                    {`${suggestion.name} | ${suggestion.symbol}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )
        : null }
    </div>
  );
}

export default StockSearch;
