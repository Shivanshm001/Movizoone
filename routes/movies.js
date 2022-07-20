const axios = require('axios');
const baseURL = "https://api.themoviedb.org/3";
const apiKey = process.env.TMDB_API_KEY;

const getSearchedMovie = async (req,res)=>{
    const {search} = req.query;
    const {adult} = req.query;
    let includeAdult = "false";
    if(adult == "true") includeAdult = "true";
    try {
        const {data} = await axios({
            method : 'get',
            url : `${baseURL}/search/movie?api_key=${apiKey}&language=en-US&query=${search}&page=1&include_adult=${includeAdult}`
        });
        const {results} = data;
        const searchedMovies = results.map(({ title, poster_path, vote_average, id }) => ({ title, poster_path, vote_average, id }));
        res.render("search",{searchedMovies})
    } catch (error) {
        console.log(`Searched movie : ${error}`);
    }
}


const getSingleMovie = (req, res) => {
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
}

module.exports = {
    getSearchedMovie,
    getSingleMovie,
}
