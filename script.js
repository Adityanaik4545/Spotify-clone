let currentSong=new Audio();
async function getSongs() {
    let a= await fetch("http://127.0.0.1:5500/song/");
    let response= await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as= div.getElementsByTagName("a");
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/song/")[1])
        }
    }
    return songs;
    
}
function convertSecondsToMinutes(seconds) {
    const totalSeconds = Math.floor(seconds); // Remove decimal part
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
  
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  
const playMusic=(track,pause=false)=>{
    // let audio=new Audio
    if (!pause) {
        currentSong.play()
        play.src="image/pause.svg"
    }
    currentSong.src="/song/"+track;
    currentSong.play()
    document.querySelector(".songname").innerHTML=decodeURI(track);
    document.querySelector(".songduration").innerHTML="00.00/00.00";
}
async function main() {
    let songs= await getSongs()
    playMusic(songs[0],true)

    let songUl=document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML=songUl.innerHTML+`<li><img class="invert" src="image/music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20"," ")}</div>
                            <div>aditya</div>
                        </div>
                        <div class="playnow">
                            <span>Play now</span>
                            <img class="invert" src="image/play.svg" alt="">
                        </div></li>`;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
    play.addEventListener("click",()=>{
        if (currentSong.paused) {
            currentSong.play();
            play.src="image/pause.svg"
        }
        else{
            currentSong.pause();
            play.src="image/play.svg"
        }
    })
    currentSong.addEventListener("timeupdate",()=>{
        console.log(convertSecondsToMinutes(currentSong.currentTime,currentSong.duration))
    document.querySelector(".songduration").innerHTML=`${convertSecondsToMinutes(currentSong.currentTime)}/${convertSecondsToMinutes(currentSong.duration)}`;
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
    })
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect)* 100 + "%";
        
    })
}
main()