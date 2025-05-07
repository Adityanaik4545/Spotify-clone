let currentSong=new Audio();
let songs;
let currfolder;
async function getSongs(folder) {
    currfolder=folder;
    let a= await fetch(`http://192.168.110.67:5500/${folder}/`);
    let response= await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as= div.getElementsByTagName("a");
     songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songUl=document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML=""
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
    return songs
    
}
function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const totalSeconds = Math.floor(seconds); 
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
    currentSong.src=`/${currfolder}/`+track;
    currentSong.play()
    document.querySelector(".songname").innerHTML=decodeURI(track);
    document.querySelector(".songduration").innerHTML="00.00 / 00.00";
}
async function main() {
    await getSongs("song/filmsong")
    playMusic(songs[0],true)


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
    document.querySelector(".songduration").innerHTML=`${convertSecondsToMinutes(currentSong.currentTime)} / ${convertSecondsToMinutes(currentSong.duration)}`;
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)* 100 
        document.querySelector(".circle").style.left= percent+ "%";
        currentSong.currentTime=((currentSong.duration)*percent)/100
    })
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })
// working for previous button
previous.addEventListener("click",()=>{
        let index=songs.indexOf(currentSong.src.split("/").splice(-1)[0])
        if ((index-1)>=0) {
            playMusic(songs[index-1])
        }
    })
    // working for nxt button
    next.addEventListener("click",()=>{
        currentSong.pause()
        let index=songs.indexOf(currentSong.src.split("/").splice(-1)[0])
        
        if ((index+1)<songs.length) {
            playMusic(songs[index+1])
        }
    })
    // volume btn
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume=parseInt(e.target.value)/100;
    })

    // load songs in playlist when user clicks on particular card
    Array.from(document.getElementsByClassName("card")).forEach(e=> {
        e.addEventListener("click",async item=>{
            songs= await getSongs(`song/${item.currentTarget.dataset.folder}`)
        })
        
    });
}
main()