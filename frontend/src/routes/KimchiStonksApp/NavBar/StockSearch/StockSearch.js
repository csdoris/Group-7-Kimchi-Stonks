import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import InputField from '../../../../components/InputField/InputField';
import { AuthContext } from '../../../../contexts/Auth';
import { StockContext } from '../../../../contexts/Stock';

import './StockSearch.scss';

const URL = process.env.REACT_APP_API_URL;

function StockSearch() {
  const history = useHistory();

  const { user } = useContext(AuthContext);
  const { clearStock } = useContext(StockContext);

  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (search === '') {
      setSuggestions([]);
    } else {
      axios.get(`${URL}/dashboard/search?keyword=${search}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken.token}`,
        },
      }).then((res) => {
        const { status, data } = res;

        if (status === 200) {
          setSuggestions(data.matches);
        }
      });
    }
  }, [search]);

  function handleSuggestionSelection(symbol) {
    setSearch('');
    setSuggestions([]);
    clearStock();

    history.push(`/stock/${symbol}?period=day`);
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
                <div className="suggestion-item" onClick={() => handleSuggestionSelection(suggestion.symbol)}>
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
