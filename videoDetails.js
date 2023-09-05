const apiKey = "AIzaSyAbPzWReORQfvFeis6me7LENetU2ddxsn4";
const baseUrl = "https://www.googleapis.com/youtube/v3";
const url = "https://www.googleapis.com/youtube/v3/commentThreads";
const commentsContainer = document.getElementById("comments-container");

const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const videolist = document.getElementById("v-list");

let searchLink = "https://www.youtube.com/results?search_query=";
// Add a click event listener to the search button
searchButton.addEventListener("click", () => {
  const searchValue = searchInput.value;
  if(searchInput.value.length){
    location.href = searchLink + searchInput.value;
  }
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
  videosList.forEach((video) => {
    videolist = document.createElement("div");
    videolist.className = "list-item";
    videolist.innerHTML = `
            <img
              src="${video.snippet.thumbnails.high.url}"
              alt=""
              class="thumbnail"
            />
            <div class="details">
              <p class="gray-text">${video.snippet.title}</p>
              <p>${video.snippet.channelTitle}</p>
              <p class="gray-text">${video.snippet.viewCount} • 3 years ago</p>
            </div>
          `;
        videolist.appendChild(div);
  });
}

