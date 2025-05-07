let currSong = new Audio();

function formatTime(seconds) {
    // Convert to integer seconds (round down)
    const totalSeconds = Math.floor(seconds);
    
    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    // Pad with leading zeros
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(secs).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {
    const response = await fetch("http://192.168.29.53:5500/songs/");
    const htmlText = await response.text();
    const div = document.createElement("div");
    div.innerHTML = htmlText;
    const fileLinks = div.querySelectorAll("a");
    const songs = [];
    fileLinks.forEach(link => {
        if (link.href.endsWith(".mp3")) {
            songs.push(link.href.split("/songs/")[1]);
        }
    });
    console.log("Parsed MP3 files:", songs);
    return songs;
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track);
    currSong.src = "/songs/" + track
    // console.log(currSong)
    if(!pause){
        currSong.play();
        playCurr.src = "pause.svg"
    }

    document.querySelector('#songInfo').innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
} 

async function playSong() {
    const songs = await getSongs();

    playMusic(songs[0].replaceAll("%20", " "), true)

    let songOl = document.querySelector(".songLists").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songOl.innerHTML = songOl.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                            <div class="songInfo">
                                <div class="songName">${song.replaceAll("%20", " ")}</div>
                                <div class="songArtist">Song Artist</div>
                            </div>
                            <div class="playnow">
                                Play Now
                                <img class="invert" src="playnow.svg" alt="">
                            </div>
                            </li>`;
    }

    Array.from(document.querySelector(".songLists").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", elements => {
            // console.log(e.querySelector('.songInfo').firstElementChild.innerHTML);
            playMusic(e.querySelector('.songInfo').firstElementChild.innerHTML);
        })
    });

    playCurr.addEventListener("click", () => {
        if(currSong.paused){
            currSong.play()
            playCurr.src = "pause.svg"
        } else {
            currSong.pause()
            playCurr.src = "play.svg"
        }
    })

    //listen for time update event
    currSong.addEventListener("timeupdate", () => {
        // console.log(formatTime(currSong.currentTime), formatTime(currSong.duration))
        document.querySelector(".songtime").innerHTML = `${formatTime(currSong.currentTime)} / ${formatTime(currSong.duration)}`
        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let songPercent = (e.offsetX / e.target.getBoundingClientRect().width) * 100 
        document.querySelector(".circle").style.left = songPercent + "%";
        currSong.currentTime = `${currSong.duration * songPercent / 100}`
    });
    
}




// Call the function after interaction
playSong();
