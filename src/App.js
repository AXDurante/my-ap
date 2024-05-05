import axios from 'axios';
import './App.css';
import React, {useState, useEffect} from 'react';

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');

  async function fetchData() {
    const url = `https://imdb8.p.rapidapi.com/auto-complete?q=${query}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'ca224eb53amshd67a88c70e27f52p1d3a8cjsn12663eaca0ef',
        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setMovies(data.d);

      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  async function searchHandler(e)  {
    e.preventDefault()
    fetchData();
  }

  async function movieHandler(e)  {
    e.preventDefault()
  }

  return (
    <div className="App">
        <form onSubmit={searchHandler}>
          <input 
            type="text" 
            value={query} 
            placeHolder="Search a movie..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        <ul> 
          {movies.map((movie, index) => (
            <li key={index}> 
              <p> {movie.l} </p>
              <p> Release Date: {movie.y} </p>
              <p> Rating: {movie.rank} </p>
              {movie.i ? (
                <img src={movie.i.imageUrl} alt={movie.l} className="img" />
                  ) : (
                <p>No poster available</p>
              )}
              <br/> <form onSubmit={movieHandler}>
              <p> Set Date and Time: </p>
                <select id="day"> 
                  <option> Monday </option>
                  <option> Tuesday </option>
                  <option> Wednesday </option>
                </select>
                <br/> <select id="time">
                  <option> 1:00-3:00pm </option>
                  <option> 3:30-4:30pm </option>
                  <option> 5:00-7:00pm </option>
                </select>
                <br/> <button> Add Movie </button> 
              </form>
              
            </li>
          ))}
        </ul>
    </div>
  );
}

export default App;
