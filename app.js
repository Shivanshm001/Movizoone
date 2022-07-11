const express = require('express');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const app = express();
const https = require('https');
const apiKey = process.env.API_KEY;


const movieData = {
    movieName: "",
    genre: "",
    rating: "",
    releaseDate: "",
    preview: ""
}
//URLs
const trendingURL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`

//Middle ware
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Set 
app.set('view engine', 'ejs');


app.get("/", async (_req, res) => {
    https.get(trendingURL, (response) => {
        response.on("data", (data) => {
            const parsedData = JSON.parse(data);
            const { results } = parsedData;
            const { page } = parsedData;
            const trendingTitles = results.map(result => {return result.title});
            const trendingRating = results.map(result => {return result.vote_average});
            const trendingPoster = results.map(result => {return result.poster_path});

            console.log(trendingTitles);
            console.log(trendingRating);
            console.log(trendingPoster);
        })
    });
    res.render("index");
})

app.get("/singlemovie", (req, res) => {

    res.render("singlemovie.ejs", movieData)
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Server running at port ${PORT}`);
    if (PORT === 3000) console.log(`http://localhost:3000/`);;
})