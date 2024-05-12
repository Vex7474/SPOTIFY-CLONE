console.log('hey');
let currentsong = new Audio();
let currfolder;
let songs;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`${folder}`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement('div')
    div.innerHTML = response;
    let tds = div.getElementsByTagName("a")
    songs = []
    for (let i = 0; i < tds.length; i++) {
        const element = tds[i];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[[1]])
            
        }
    }
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>song artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="playnow.svg" alt="">
                            </div> </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return songs
}
const playmusic = (track, pause = false) => {
    currentsong.src = `${currfolder}/` + track
    //let audio= new Audio("/songs/" +track)
    if (!pause) {
        currentsong.play()
    }
    play.src = "playnow.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
async function displayalbum(){
    let a = await fetch("http://127.0.0.1/clone/songs")
    let response = await a.text();
    let div= document.createElement("div")
    div.innerHTML=response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    anchors=div.getElementsByTagName("a")
    let array=Array.from(anchors)
        for(let index=0;index<Array.length;index++){
          const e=array[index];
        if(e.href.includes("/songs")){
            let folder=e.href.split("/").slice(-2)[0]
            //get meta data
            let a = await fetch(`http://127.0.0.1/clone/songs/${folder}/info.json`)
            let response= await a.json();
            console.log(response)
            cardcontainer.innerHTML=cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
                 <div class="playbutton">
                            <img src="play.svg" alt=""/>1
                        </div>
                        <img src="clone/songs/${folder}/cover.jpg" alt=""/>
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                  </div>`
                  console.log("heyo");
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
            playmusic(songs[0])
        })
    })

}

/*
console.log("displaying albums")
let a = await fetch(`http://127.0.0.1/clone/songs`)
let response = await a.text();
let div = document.createElement("div")
div.innerHTML = response;
let anchors = div.getElementsByTagName("a")
let cardcontainer = document.querySelector(".cardcontainer")
let array = Array.from(anchors)
for (let index = 0; index < array.length; index++) {
    const e = array[index]; 
    if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
        let folder = e.href.split("/").slice(-2)[0]
        // Get the metadata of the folder
        let a = await fetch(`${folder}/info.json`)
        let response = await a.json(); 
        cardcontainer.innerHTML = cardcontainer.innerHTML + ` <div data-folder="${folder}" class="card">
        <div class="playbutton">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                    stroke-linejoin="round" />
            </svg>
        </div>

        <img src="${folder}/cover.jpg" alt="">
        <h2>${response.title}</h2>
        <p>${response.description}</p>
    </div>`
    }
}
*/


async function main() {
   // Get the list of all the songs
   await getsongs("songs/english")
   playmusic(songs[0], true)

   // Display all the albums on the page
    await displayalbum()
    //attach evet listener to play,next,previous
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "playnow.svg"
        }
    })
    //time update event
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}:${secondsToMinutesSeconds(currentsong.duration)}`
        let c = document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + '%';
        currentsong.currentTime = (currentsong.duration * percent) / 100

    })
    //adding a event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //adding a event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"


    })
    //going back and forth with id selector
    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log("previous song")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })
    //adding an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting value to ", e.target.value, "100")
        currentsong.volume = parseInt(e.target.value) / 100
    })
    //to load playlist
    /*Array.from(document.getElementsByClassName(".card")).forEach(e => {
        e.addEventListener("click", item => {
        songs = await getsongs(`song/${item.dataset.folder}`)
        })
    })*/
}

main()
