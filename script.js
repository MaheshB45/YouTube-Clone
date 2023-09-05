const apiKey = "AIzaSyAbPzWReORQfvFeis6me7LENetU2ddxsn4";
const baseUrl = "https://www.googleapis.com/youtube/v3";
let searchLink = "https://www.youtube.com/results?search_query=";

const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const container = document.getElementById("container");

// Add a click event listener to the search button
searchButton.addEventListener("click", () => {
  const searchValue = searchInput.value;
  if(searchInput.value.length){
    location.href = searchLink + searchInput.value;
  }
  fetchSearchResults(searchValue);
  searchInput.value = ""; // Clear the input field after clicking the button
});

function calculateTheTimeGap(publishTime) {
  let publishDate = new Date(publishTime);
  let currentDate = new Date();

  let secondsGap = (currentDate.getTime() - publishDate.getTime()) / 1000;

  const secondsPerDay = 20 * 60 * 60;
  const secondsPerWeek = 7 * secondsPerDay;
  const secondsPerMonth = 30 * secondsPerDay;
  const secondsPerYear = 365 * secondsPerDay;

  if (secondsGap < secondsPerDay) {
    return `${Math.ceil(secondsGap / (60 * 60))}hrs ago`;
  }
  if (secondsGap < secondsPerWeek) {
    return `${Math.ceil(secondsGap / secondsPerWeek)} weeks ago`;
  }
  if (secondsGap < secondsPerMonth) {
    return `${Math.ceil(secondsGap / secondsPerMonth)} months ago`;
  }

  return `${Math.ceil(secondsGap / secondsPerYear)} years ago`;
}

function navigateToVideoDetails(videoId) {
  document.cookie = `id=${videoId}; path=/videoDetails.html`;
  window.location.href = "http://127.0.0.1:5500/videoDetails.html";
}

function renderVideosOntoUI(videosList) {
  // videosList will be an array of video objects.
  container.innerHTML = "";
  videosList.forEach((video) => {
    const videoContainer = document.createElement("div");
    videoContainer.className = "video";
    videoContainer.innerHTML = `
        <img
            src="${video.snippet.thumbnails.high.url}"
            class="thumbnail"
            alt="thumbnail"
        />
        <div class="bottom-container">
            <div class="logo-container">
            <img class="logo" src="${video.channelLogo}" alt="Channel Logo" />
            </div>
            <div class="title-container">
            <p class="title">
                ${video.snippet.title}
            </p>
            <p class="gray-text">${video.snippet.channelTitle}</p>
            <p class="gray-text">${
              video.statistics.viewCount
            } Views . ${calculateTheTimeGap(video.snippet.publishTime)}</p>
            </div>
        </div>`;

    videoContainer.addEventListener("click", () => {
      navigateToVideoDetails(video.id.videoId);
    });

    container.appendChild(videoContainer);
  });
}

async function fetchChannelLogo(channelId) {
  const endpoint = `${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=snippet`;

  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    return result.items[0].snippet.thumbnails.high.url;
  } catch (error) {
    alert("Failed to load channel logo for ", channelId);
  }
}
/**
 * this will take videoId and returns the statics of the video.
 */
async function getVideoStatistics(videoId) {
  const endpoint = `${baseUrl}/videos?key=${apiKey}&part=statistics&id=${videoId}`;
  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    return result.items[0].statistics;
  } catch (error) {
    alert("Failed to fetch Statistics for ", videoId);
  }
}


async function fetchSearchResults(searchString) {
  // searchString will the input entered by the user
  const endpoint = `${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=6`;
  try {
    const response = await fetch(endpoint);
    const result = await response.json();

    for (let i = 0; i < result.items.length; i++) {
      let videoId = result.items[i].id.videoId;
      let channelId = result.items[i].snippet.channelId;

      let statistics = await getVideoStatistics(videoId);
      let channelLogo = await fetchChannelLogo(channelId);

      result.items[i].statistics = statistics;
      result.items[i].channelLogo = channelLogo;
    }

    renderVideosOntoUI(result.items); // 2
  } catch (error) {
    alert("Some error occured");
  }
}

