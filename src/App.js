import axios from 'axios';
import './App.css';
import React, {useState, useEffect} from 'react';

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [error, setError] = useState('');

  async function removeMovie(indexToRemove) {
    const newSelectedMovies = selectedMovies.filter((_, index) => index !== indexToRemove);
    setSelectedMovies(newSelectedMovies);
  }

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

  async function searchHandler(e) {
    e.preventDefault();
    fetchData();
  }

  function addMovie(movies, day, time) {
    const isDuplicate = selectedMovies.some(selectedMovie => {
      return selectedMovie.day === day && selectedMovie.time === time;
    });

    if (isDuplicate) {
      setError('There is already a movie at that time! Please remove it first.')
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    } else {
      setSelectedMovies(prevState => [
        ...prevState,
        {
          ...movies,
          day: day,
          time: time
        }
      ]);
      setError('');
    }
  }

  const moviesByDate = selectedMovies.reduce((acc, movie) => {
    // If the date group doesn't exist, create it
    if (!acc[movie.day]) {
      acc[movie.day] = [];
    }
    // Add the movie to the corresponding date group
    acc[movie.day].push(movie);
    return acc;
  }, {});

  return (
    <div className="App">
      <div>
        <h2>Selected Movies:</h2>
        {error && (
          <div id="errorSection">
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}
          <div> 
          {Object.keys(moviesByDate).map(day => (
            <div key={day}>
              <h2>{day}</h2>
              <ul>
                {moviesByDate[day].map((selectedMovie, index) => (
                  <li key={index}>
                    <p> Title: {selectedMovie.l} </p>
                    <p> Day: {selectedMovie.day} </p>
                    <p> Time: {selectedMovie.time} </p>
                    {/* <br/> {selectedMovie.i ? (
                    <img src={selectedMovie.i.imageUrl} alt={selectedMovie.l} className="img" />
                    ) : (
                    <p>No poster available</p>
                    )} */}
                    <br/> <button onClick={() => removeMovie(index)}> Remove </button>
                  </li>
                ))}
              </ul>
            </div>
          ))} 
        </div>
      </div>
      <form onSubmit={searchHandler}>
        <input
          type="text"
          value={query}
          placeholder="Search a movie..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <p>{movie.l}</p>
            <p>Release Date: {movie.y}</p>
            <p>Rating: {movie.rank}</p>
            {movie.i ? (
              <img src={movie.i.imageUrl} alt={movie.l} className="img" />
            ) : (
              <p>No poster available</p>
            )}
            <br />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const day = e.target.day.value;
                const time = e.target.time.value;
                addMovie(movie, day, time);
              }}
            >
              <p>Set Date and Time:</p>
              <select id="day">
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
              </select>
              <br />
              <select id="time">
                <option>1:00-3:00pm</option>
                <option>3:30-4:30pm</option>
                <option>5:00-7:00pm</option>
              </select>
              <br />
              <button type="submit">Add Movie</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
