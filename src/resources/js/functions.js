const { auth, columns, article } = require("./globals");

async function FetchApi(url) {
  const dataFetch = await fetch(`https://api.pexels.com/v1/${url}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  return dataFetch.json();
}
function RenderPhotos(data) {
  let index = 0;
  data.photos.forEach((photo) => {
    const figure = document.createElement("figure");
    figure.innerHTML = `
    <img src="${photo.src.large}">
    <figcaption><a target="_blank" rel="noreferrer noopener" href="${photo.photographer_url}">${photo.photographer}</a></figcaption>
  `;
    columns[index].appendChild(figure);
    if (index === columns.length - 1) return (index = 0);
    index++;
  });
}
function CuratedPhotos(page = 1) {
  FetchApi(`curated?per_page=80&page=${page}`)
    .then((data) => RenderPhotos(data))
    .catch((error) => console.error(error));
}

function SearchPhotos(query) {
  FetchApi(`search?query=${query}+query&per_page=80&page=1`)
    .then((data) => RenderPhotos(data))
    .catch((error) => console.error(error));
}

function ClearPhotos() {
  columns.forEach((column) => {
    column.innerHTML = "";
  });
}
let currentPage = 1;
function GetNewPhotos() {
  const articleHeight = Math.floor(article.getBoundingClientRect().height);
  const trigger = articleHeight - window.pageYOffset;
  
  if (window.pageYOffset > trigger) {
    currentPage++;
    CuratedPhotos(currentPage);
  }
}
/* Startup */
CuratedPhotos();

module.exports = { SearchPhotos, ClearPhotos, GetNewPhotos };
