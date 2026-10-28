// ===================== LOKALE LISTEN =====================
let serieList = [];
let filmList = [];

// ===================== YOUTUBE-ID EXTRAKTION =====================
function extractYouTubeID(url) {
  if (!url) return "";

  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return short[1];

  const long = url.match(/v=([a-zA-Z0-9_-]{11})/);
  if (long) return long[1];

  const embed = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed) return embed[1];

  return "";
}

// ===================== TITEL → DATEINAME =====================
function toFileName(title) {
  return title
    .toLowerCase()
    .replace(/ /g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

// ===================== SERIEN HINZUFÜGEN =====================
document.getElementById('btnSerieAdd').addEventListener('click', () => {
  const title = document.getElementById('serieTitle').value.trim();
  const season = document.getElementById('serieSeason').value.trim();
  const episode = document.getElementById('serieEpisode').value.trim();
  const youtubeInput = document.getElementById('serieYoutube').value.trim();
  const channel = document.getElementById('serieChannel').value.trim();
  const day = document.getElementById('serieDay').value.trim();
  const date = document.getElementById('serieDate').value.trim();
  const time = document.getElementById('serieTime').value.trim();

  const youtube = extractYouTubeID(youtubeInput);

  const entry = {};

  if (title) entry.title = title;
  if (season) entry.season = season;
  if (episode) entry.episode = episode;
  if (youtube) entry.youtube = youtube;
  if (channel) entry.channel = channel;
  if (day) entry.day = day;
  if (date) entry.date = date;
  if (time) entry.time = time;

  if (title) {
    const fileName = toFileName(title);
    entry.image = `/seriale_bg/${fileName}_bg.jpg`;
  }

  serieList.unshift(entry);

  document.getElementById('serieOutput').textContent =
    JSON.stringify(serieList, null, 2);
});

// ===================== FILME HINZUFÜGEN =====================
document.getElementById('btnFilmAdd').addEventListener('click', () => {
  const title = document.getElementById('filmTitle').value.trim();
  const genre = document.getElementById('filmGenre').value.trim();
  const year = document.getElementById('filmYear').value.trim();
  const youtubeInput = document.getElementById('filmYoutube').value.trim();
  const image = document.getElementById('filmImage').value.trim();

  const youtube = extractYouTubeID(youtubeInput);

  const entry = {};
  if (title) entry.title = title;
  if (genre) entry.genre = genre;
  if (year) entry.year = Number(year);
  if (youtube) entry.youtube = youtube;
  if (image) entry.image = image;

  filmList.unshift(entry);

  document.getElementById('filmOutput').textContent =
    JSON.stringify(filmList, null, 2);
});

// ===================== JSON DOWNLOADEN STATT SPEICHERN =====================
function downloadJSON() {
  const data = {
    seriale: serieList,
    filma: filmList
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "content.json";
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById("btnSaveSeries").addEventListener("click", downloadJSON);
document.getElementById("btnSaveFilms").addEventListener("click", downloadJSON);
