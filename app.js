const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const app = express();

const apiKey = process.env.TMDB_API_KEY;
const { getSearchedMovie, getSingleMovie, } = require('./routes/movies');
const baseURL = "https://api.themoviedb.org/3";


app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('view engine', 'ejs');
let movieDataArrays = [];

//Trending movies
const trendingMovies = async () => {
    try {
        const { data } = await axios({
            method: 'get',
            url: `${baseURL}/trending/movie/week?api_key=${apiKey}`
        });
        const { results } = data;
        const trendingDatas = results.map(({ title, poster_path, vote_average, id }) => ({ title, poster_path, vote_average, id }));
        movieDataArrays.push(trendingDatas);
    } catch (error) {
        console.log(`Trending : ${error.code}`);
        console.log(`Host name : ${error.hostname}`);
        
    }
}
trendingMovies();

//New released Movies
const newReleasedMovies = async () => {
    try {
        const { data } = await axios({
            method: 'get',
            url: `${baseURL}/discover/movie?release_date.gte=2022-07-01&release_date.lte=2022-07-16&language=en&api_key=${apiKey}`
        })
        const { results } = data;
        let releasedDatas = results.map(({ title, poster_path, vote_average, release_date, id }) => ({ title, poster_path, vote_average, release_date, id }));
        movieDataArrays.push(releasedDatas);
    } catch (error) {
        console.log(`New Released : ${error.code}`);
    }
}
newReleasedMovies();

//Action movies
const actionMovies = async () => {
    try {
        const { data } = await axios({
            method: 'get',
            url: `${baseURL}/discover/movie?language=en&with_genres=action&api_key=${apiKey}`
        });
        const { results } = data;
        const actionDatas = results.map(({ title, poster_path, vote_average, id }) => ({ title, poster_path, vote_average, id }));
        movieDataArrays.push(actionDatas);
    } catch (error) {
        console.log(`Acton moives : ${error.code}`);
    }
}
actionMovies();

//Animated movies
const animatedMovies = async () => {
    try {
        const { data } = await axios({
            method: 'get',
            url: `${baseURL}/discover/movie?language=en-US&with_genres=animation&api_key=${apiKey}`
        });
        const { results } = data;
        const animatedDatas = results.map(({ title, poster_path, vote_average, id }) => ({ title, poster_path, vote_average, id }));
        movieDataArrays.push(animatedDatas);
    } catch (error) {
        console.log(`Animated Movies : ${error.code}`);
    }
}
animatedMovies();


app.get("/",(req,res)=>{
     res.render("index",{movieDataArrays});
})

app.get("/singlemovie", getSingleMovie)

app.get("/search", getSearchedMovie)

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Server running at port ${PORT}`);
    if (PORT === 3000) console.log(`http://localhost:3000/`);;
})
