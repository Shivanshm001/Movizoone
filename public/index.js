const apiKey = process.env.API_KEY;
const trendingUrl =  `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
console.log(trendingUrl);