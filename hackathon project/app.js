const API_KEY = "1d3a0eefa97b499d8fbc4ee93eeb40b7";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => {
    fetchNews("India"); // Default load with 'India' as query
    renderSearchHistory(); // Display search history on load
});

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);

    // Save search query to local storage
    saveSearchQuery(query);
}

function saveSearchQuery(query) {
    let searches = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!searches.includes(query)) {
        searches.push(query);
        localStorage.setItem("searchHistory", JSON.stringify(searches));
    }
}

function renderSearchHistory() {
    const searchHistoryContainer = document.getElementById("search-history");
    const searches = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Clear previous content
    searchHistoryContainer.innerHTML = "";

    // Render each search history item
    searches.forEach((query) => {
        const searchItem = document.createElement("div");
        searchItem.className = "search-item";
        searchItem.innerText = query;
        searchItem.addEventListener("click", () => fetchNews(query)); // Fetch news on click
        searchHistoryContainer.appendChild(searchItem);
    });
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
