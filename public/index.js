const trendingContainer = document.getElementById("trending-container");

const populateTrendingSection = async ()=>{
    try {
        let {data} = await axios({
            method : "get",
            url : "http://localhost:3000/trending"
        })

      data.forEach(trendingData => {
        console.log(trendingData);
        trendingContainer.innerHTML = `<div class="min-w-[250px] min-h-[350] rounded-lg trending-card overflow-hidden">
                    <img src="https://image.tmdb.org/t/p/original/${trendingData.poster_path}"
                        class="max-w-[250px] max-h-[350px] w-full h-max" alt="">
                        <p class="bg-black flex justify-between items-center font font-semibold text-white px-5 py-4 border-t border-t-white"><span>${trendingData.title}</span><span class="">${trendingData.vote_average.toFixed(2)}</span></p>
                </div>`
      });
    } catch (error) {
        
    }
}