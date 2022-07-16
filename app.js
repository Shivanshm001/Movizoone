const express = require('express');
const https = require('https');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const app = express();
const apiKey = process.env.TMDB_API_KEY;

//Https routes 


//URLs
const trendingURL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;

//Middle ware
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Set 
app.set('view engine', 'ejs');

//Routes

app.get("/", (req, res) => {
    let getTrending = () => {
        https.get(trendingURL, function (response) {
            response.on("data", (data) => {
                const parsedData = JSON.parse(data);
                const { results } = parsedData;
                // console.log(results);
                let trendingDatas = results.map(({ title, poster_path, vote_average }) => ({ title, poster_path, vote_average }));

                res.status(200).render("index", { trendingDatas });
            });
        });
    }
    getTrending();
})

app.get("/singlemovie", (req, res) => {
 res.render("singlemovie.ejs")
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Server running at port ${PORT}`);
    if (PORT === 3000) console.log(`http://localhost:3000/`);;
})
