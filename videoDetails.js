const apiKey = "AIzaSyA-jM5KMjOaFiqz7iCCNsuaenA-GaQdHnE";
const url = "https://www.googleapis.com/youtube/v3/commentThreads";
const commentsContainer = document.getElementById("comments-container");

const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");

// Add a click event listener to the search button
searchButton.addEventListener("click", () => {
  const searchValue = searchInput.value;
  fetchSearchResults(searchValue);
  searchInput.value = ""; // Clear the input field after clicking the button
});

window.addEventListener("load", () => {
  let videoId = document.cookie.split("=")[1];

  if (YT) {
    new YT.Player("video-placeholder", {
    //   height: "300",
    //   width: "500",
      videoId,
    });

    loadComments(videoId);
  }
});

async function loadComments(videoId) {
  let endpoint = `${url}?key=${apiKey}&videoId=${videoId}&maxResults=10&part=snippet`;

  const response = await fetch(endpoint);
  const result = await response.json();

  result.items.forEach((item) => {
    const repliesCount = item.snippet.totalReplyCount;
    const {
      authorDisplayName,
      textDisplay,
      likeCount,
      authorProfileImageUrl: profileUrl,
      publishedAt,
    } = item.snippet.topLevelComment.snippet;

    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
    <img src="${profileUrl}" class="author-profile" alt="author profile" />
    <b id="authorDisplayName">${authorDisplayName}</b>
    <p id="textDisplay">${textDisplay}</p>`;

    commentsContainer.appendChild(div);
  });
}

function renderVideosOntoUI(videosList) {
    // videosList will be an array of video objects.
    container.innerHTML = "";
    videosList.forEach((video) => {
      const videoContainer = document.createElement("div");
      videoContainer.className = "videolist";
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
  async function getVideoStatistics(videoId) {
    // https://www.googleapis.com/youtube/v3/videos?key=AIzaSyDvo2p4xMEI3GC-PWH02_0OAIN1h88k4rE&part=statistics
    const endpoint = `${baseUrl}/videos?key=${apiKey}&part=statistics&id=${videoId}`;
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      return result.items[0].statistics;
    } catch (error) {
      alert("Failed to fetch Statistics for ", videoId);
    }
  }