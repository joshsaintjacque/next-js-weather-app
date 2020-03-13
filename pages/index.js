import {useState} from 'react';
import Head from 'next/head';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';

const Home = ({temp, conditions, isDaytime}) => {
  const [city, setCity] = useState('');

  const onChange = (event) => {
    setCity(event.target.value);
  }

  const onClick = () => {
    Router.push({
      pathname: '/',
      query: { city }
    })
  }

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Weather App
        </h1>

        <p className="description">
          <input placeholder="City name" onChange={onChange} className="city-name"></input>
          <button onClick={onClick} className="search-button">Search</button>
        </p>

        {city && temp && <div className="grid">
          <div className="card">
            <h3>Temp</h3>
            <p>{temp}&deg; F</p>
          </div>

          <div className="card">
            <h3>Condition</h3>
            {conditions?.map(condition => (
              <div key={condition.id} className="condition">
                <img src={`http://openweathermap.org/img/wn/${condition.icon}.png`} />
                <p>{condition.description}</p>
              </div>
            ))}
          </div>

          <div
            className="card"
          >
            <h3>Time of Day</h3>
            <p>{isDaytime ? '☀️' : '🌜'}</p>
          </div>
        </div>}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          height: 125px;
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          text-transform: capitalize;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 .5rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .card img {
          margin-right: 10px;
        }

        .card .condition {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }

        .city-name {
          padding: 10px 20px;
          font-size: 20px;
        }

        .search-button {
          padding: 13px 20px;
          font-size: 20px;
          background: cornflowerblue;
          color: white;
          border: none;
          margin-left: 10px;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}



export async function getServerSideProps(context) {
  const key = process.env.open_weather_key;
  const { city } = context.query;
  if(!city || city.length === 0) return {props: {}};
  const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=imperial`);
  const data = await response.json();
  const sunriseTime = new Date(data.sys.sunrise * 1000);
  const sunsetTime = new Date(data.sys.sunset * 1000);
  const currentTime = new Date();
  const isDaytime = currentTime > sunriseTime && currentTime < sunsetTime;

  return {
    props: {
      temp: data.main.temp,
      conditions: data.weather,
      isDaytime,
    }
  }
}


export default Home
