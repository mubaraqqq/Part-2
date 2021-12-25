// import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';


const Country = ({ search, countries, filter }) => {
  const [weather, setWeather] = useState(null);
  const api_key = process.env.REACT_APP_API_KEY;
  const [error, setError] = useState(null);
  const [fetchStatus, setFetchStatus] = useState('idle');
  
  useEffect(() => {
    setFetchStatus('loading');
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${filter.capital}&appid=${api_key}`)
    .then(response => {
      setWeather(response.data);
      setFetchStatus('success');
    })
    .catch(error => {
      setFetchStatus('error');
      setError(error)
    })
  }, [filter.capital, api_key]);
  
  if (fetchStatus === 'idle' || fetchStatus === 'loading') {
    return <div>Loading...</div>
  }

  if (fetchStatus === 'error') {
    return <div>Something went wrong
    <pre>{JSON.stringify(error, null, 2)}</pre></div>
  }

  return (
    <div>
      <h3>{filter.name.common}</h3>
      <p>Capital : {filter.capital}</p>
      <p>Population : {filter.population}</p>
      <ul>Spoken Languages {Object.values(filter.languages).map(lang => (
          <li>{lang}</li>
        ))} 
      </ul>
      <img src={filter.flags.svg} alt={`flag of ${filter}`} height='100' width='100'/>
      <h4>Weather in {filter.capital}</h4>
          {weather && 
            <div>
              <p><b>temperature:</b> {weather.main.temp} Kelvin</p>
              <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt={`weather representation in ${filter}`} height='100' width='100' />
              <p><b>wind:</b> {weather.wind.speed}m/s direction {weather.wind.deg} degrees</p>
            </div>
          }
    </div>
  )
};


const Countries = ({ search, countries, show, setShow }) => {
  const showCountry = (id) => {
    setShow(showed => ({
      ...showed, [id]: !showed[id]
    }));
  };

  return (
    <div>
    {
      (!search)
        ? null
        : (countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase())).length > 10)
        ? `Too many matches specify another filter`
        : (countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase())).length === 1)
        ? countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase())).map(filter => (
          <Country filter={filter} search={search} countries={countries}/>
        )) 
        : (countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase())).length < 10)
        ? countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase())).map((filter, id) => (
          <div  key={filter.name.common}>
            <li><h2>{filter.name.common}</h2></li> <button onClick={() => {showCountry(id)}}>{!show[id] ? `show` : 'hide'}</button>
            {
              show[id] &&
              <Country filter={filter} search={search} countries={countries}/>
            }
          </div>
        ))
        : null
    }
    </div>
  )
};

const App = () => {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [show, setShow] = useState({});

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
    .then(response => 
      setCountries(response.data));
  }, [])

  return (
    <div>
      find countries <input value={search} onChange={handleSearch}/>
      <Countries search={search} countries={countries} show={show} setShow={setShow}/>
    </div>
  )
};

export default App;


