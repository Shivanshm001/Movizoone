const zoneText = document.getElementById("zonetext");
const zoneWords = ["COMFORT","VIBE","JOY"];

function zoneTextChanger() { 
    const randomNumber = ()=>{
        const x = Math.floor(Math.random()*3);
        return x;
    }
    setInterval(() => {
        zoneText.innerText = zoneWords[randomNumber()];
    }, 1000);
 }

 zoneTextChanger();