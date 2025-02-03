// BMO
document.addEventListener("DOMContentLoaded", function () {
    var body = document.getElementById("body");
    var face = document.getElementById("face");
    var expression = document.getElementById("expression");
    var blocks = document.getElementById("blocks");
    var isActive = false;

    function toggleExpression() {
        if (isActive) {
            face.src = "assets/face.png"; 
            expression.src = "assets/music.png"; 
            blocks.classList.remove("show"); 
        } else {
            face.src = "assets/onhoverface.png"; 
            expression.src = "assets/onhover.png"; 
            blocks.classList.add("show"); 
        }
        isActive = !isActive; 
    }
  
 
    function resetCacheData() {
        
        document.querySelectorAll('input.searchInput').forEach(input => {
            input.value = ''; 
        });
  
        
        document.getElementById("trackResults").innerHTML = '';
        document.getElementById("artistResults").innerHTML = '';
        document.getElementById("albumResults").innerHTML = '';
  
       
        document.getElementById("spotifyIframe").src = '';
        document.getElementById("audio").pause();
        document.getElementById("audio").src = '';
  
        console.log('Cache and data have been reset');
    }
  

    face.addEventListener("mouseenter", toggleExpression);
    face.addEventListener("mouseleave", toggleExpression);
  
    
    face.addEventListener("click", function () {
        toggleExpression();
        resetCacheData();  
    });
});

//Spotify API***********************************************************************

const client_id = 'e181603ee33143ebaf8f59551d06843a';
const client_secret = '79615c463f1c4b6cb59f1552e51d82f7'; 
const playlistId = '6i2Qd6OpeRBAzxfscNXeWp';


async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`
    });

    const data = await response.json();
    console.log("Access Token:", data.access_token); 
    return data.access_token;
}


async function searchSong(type) {
    const searchInput = document.querySelector(`#${type} input`).value;
    console.log("Search Input:", searchInput);

    if (!searchInput) {
        alert("♫ Pick a song, any song! ♫");
        return;
    }

    const accessToken = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=${type}&limit=10`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    console.log("API Response Data:", data);

    let resultsHtml = '';
    let songIds = [];


    if (type === 'track') {
        if (data.tracks.items.length === 0) {
            document.getElementById("trackResults").innerHTML = "No tracks found.";
            return;
        }

        data.tracks.items.forEach(song => {
            resultsHtml += `<a href="#" onclick="playSong('${song.id}')">${song.name}</a><br>`;
            songIds.push(song.id);
        });
        document.getElementById("trackResults").innerHTML = resultsHtml;
    }


    else if (type === 'artist') {
        if (data.artists.items.length === 0) {
            document.getElementById("artistResults").innerHTML = "No artists found.";
            return;
        }

        data.artists.items.forEach(artist => {
            resultsHtml += `<a href="#" onclick="playArtistPreview('${artist.id}')">${artist.name}</a><br>`;
        });
        document.getElementById("artistResults").innerHTML = resultsHtml;
    }


    else if (type === 'album') {
        if (data.albums.items.length === 0) {
            document.getElementById("albumResults").innerHTML = "No albums found.";
            return;
        }

        data.albums.items.forEach(album => {
            resultsHtml += `<a href="#" onclick="playAlbumPreview('${album.id}')">${album.name}</a><br>`;
        });
        document.getElementById("albumResults").innerHTML = resultsHtml;
    }

 
    if (songIds.length > 0) {
        const randomSongId = songIds[Math.floor(Math.random() * songIds.length)];
        playSong(randomSongId);
    }
}

async function playSong(songId) {
    const iframe = document.getElementById("spotifyIframe");

    if (!iframe) {
        console.error("Whoops! Spotify can't find it!");
        return;
    }

   
    iframe.src = `https://open.spotify.com/embed/track/${songId}?utm_source=generator&theme=0`;

    const accessToken = await getAccessToken();

    try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        const trackData = await response.json();
        console.log(trackData);

        if (trackData.preview_url) {
           
            audio.src = trackData.preview_url;
            audio.play();
        } else {
            console.log("No preview available for this track.");
        }
    } catch (error) {
        console.error("Error fetching track details:", error);
    }
}


async function playArtistPreview(artistId) {
    const accessToken = await getAccessToken();

    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        const artistData = await response.json();
        console.log(artistData);

        if (artistData.tracks.length > 0) {
            const firstTrack = artistData.tracks[0];
            playSong(firstTrack.id); 
        } else {
            console.log("No top tracks found for this artist.");
        }
    } catch (error) {
        console.error("Error fetching artist top tracks:", error);
    }
}


async function playAlbumPreview(albumId) {
    const accessToken = await getAccessToken();

    try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        const albumData = await response.json();
        console.log(albumData);

        if (albumData.items.length > 0) {
            const firstTrack = albumData.items[0];
            playSong(firstTrack.id); 
        } else {
            console.log("No tracks found for this album.");
        }
    } catch (error) {
        console.error("Error fetching album tracks:", error);
    }
}
