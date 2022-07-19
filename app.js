const express = require('express');
const https = require('https');
const axios = require('axios');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const app = express();
const apiKey = process.env.TMDB_API_KEY;


//URLs
const baseURL = "https://api.themoviedb.org/3"
const newReleasedURL = `${baseURL}/discover/movie?release_date.gte=2022-07-01&release_date.lte=2022-07-16&language=en&api_key=${apiKey}`;
const trendingURL = `${baseURL}/trending/movie/week?api_key=${apiKey}`;
const actionURL = `${baseURL}/discover/movie?language=en&with_genres=action&api_key=${apiKey}`;
const animatedURL = `${baseURL}/discover/movie?language=en-US&with_genres=animation&api_key=${apiKey}`;


app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('view engine', 'ejs');

//Routes
//Array of all filtered movie data
let movieDataArrays = [];

//Trending Moives

const trendingMovies = async () => {
    try {
        const { data } = await axios({
            method: 'get',
            url: trendingURL
        });
        const { results } = data;
        const trendingDatas = results.map(({ title, poster_path, vote_average, id }) => ({ title, poster_path, vote_average, id }));
        movieDataArrays.push(trendingDatas);
    } catch (error) {
        console.log(`Trending : ${error.code}`);
        console.log(`Host name : ${error.hostname}`);
        // if(error.code == 'ENOTFOUND' && error.hostname == `api.themoviedb.org`){
        //     movieDataArrays.push({
        //         "error" : `ENOTFOUND`,
        //         "msg" : "Cannot fetch data."
        //     })
        // }
    }
}
trendingMovies();

//New Released Movies
const newReleasedMovies = async () => {
    try {
        const { data } = await axios({
            method: 'get',
            url: newReleasedURL
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
            url: actionURL
        });
        const { results } = data;
        const actionDatas = results.map(({ title, poster_path, vote_average, id }) => ({ title, poster_path, vote_average, id }));
        movieDataArrays.push(actionDatas);
    } catch (error) {
        console.log(`Acton moives : ${error.code}`);
    }
}
actionMovies();
//Action movies
const animatedMovies = async () => {
    try {
        const { data } = await axios({
            method: 'get',
            url: animatedURL
        });
        const { results } = data;
        const animatedDatas = results.map(({ title, poster_path, vote_average, id }) => ({ title, poster_path, vote_average, id }));
        movieDataArrays.push(animatedDatas);
    } catch (error) {
        console.log(`Animated Movies : ${error.code}`);
    }
}
animatedMovies();

app.get("/", (req, res) => {
   res.render("index", { movieDataArrays });
// res.sendFile(path.join(__dirname,"index.html"));
})

app.get("/singlemovie", (req, res) => {
    const query = req.query;
    const singleMovieData = async () => {
        try {
            const { data } = await axios({
                method: 'get',
                url: `${baseURL}/movie/${query.id}?api_key=${apiKey}&language=en-US`
            });
            // console.log(data);
            const {genres} = data;
            const movieDetails = [data].map(({ title, poster_path, vote_average, id, release_date,overview }) => ({ title, poster_path, vote_average, id,release_date,overview }));
            res.render("singlemovie.ejs", { movieDetails, genres })
        } catch (error) {
            console.log(`Single movie : ${error.code}`);
        }
    }
    singleMovieData();

})

app.get("/search",(req,res)=>{
    const {search} = req.query;
    const {adult} = req.query;
    let includeAdult = "false";
    if(adult == "true") includeAdult = "true";
    const getSearchedMovie = async ()=>{
        try {
            const {data} = await axios({
                method : 'get',
                url : `${baseURL}/search/movie?api_key=${apiKey}&language=en-US&query=${search}&page=1&include_adult=${includeAdult}`
            });
            const {results} = data;
            const searchedMovies = results.map(({ title, poster_path, vote_average, id }) => ({ title, poster_path, vote_average, id }));
            res.render("search",{searchedMovies})
        } catch (error) {
            console.log(`Searched movie : ${error.code}`);
        }
    }
    getSearchedMovie();
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Server running at port ${PORT}`);
    if (PORT === 3000) console.log(`http://localhost:3000/`);;
})
