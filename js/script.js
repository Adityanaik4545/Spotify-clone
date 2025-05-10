let currentSong = new Audio();
let songs;
let currfolder;
// below function is used to get the songs from the folder and make array of songs from which we can play songs by accessing index of array and display them in library section
async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="image/music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div>aditya</div>
                        </div>
                        <div class="playnow">
                            <span>Play now</span>
                            <img class="invert" src="image/play.svg" alt="">
                        </div></li>`;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        })
    })
    return songs;
}
// this function is used to convert seconds to minutes for song duration
function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
// this function handles the play and pause functionality of the music
const playMusic = (track, pause = false) => {
    if (!pause) {
        currentSong.play();
        play.src = "image/pause.svg";
    }
    currentSong.src = `/${currfolder}/` + track;
    currentSong.play()
    document.querySelector(".songname").innerHTML = decodeURI(track);
    document.querySelector(".songduration").innerHTML = "00.00 / 00.00";
}
// creates an card for each album and populates song data from info.json file
async function displayAlbum() {
    let a = await fetch(`/song/`);
    let response = await a.text();
    let div = document.createElement("div");
    let cardContainer = document.querySelector(".cardContainer");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/song/")) {
            let folder = e.href.split("/").slice(-2)[1];
            let a = await fetch(`/song/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                                fill="none">
                                <polygon points="7,4 7,20 18,12" fill="black" />
                            </svg>
                        </div>
                        <img src="/song/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`

        }
    }
    // load songs in playlist when user clicks on particular card
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`song/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        })

    });

}
async function main() {
    await getSongs("song/englishRomantic");
    playMusic(songs[0], true);

    displayAlbum();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "image/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "image/play.svg";
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songduration").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)} / ${convertSecondsToMinutes(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })
    // working for previous button
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    })
    // working for nxt button
    next.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    })
    // volume btn
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume>0) {
            document.querySelector(".volume>img").src= document.querySelector(".volume>img").src.replace("mutevol.svg", "volume.svg");
        }
    })

    // added toggle for volume icon
    document.querySelector(".volume > img").addEventListener("click", (e) => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mutevol.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mutevol.svg", "volume.svg");
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
}
main();