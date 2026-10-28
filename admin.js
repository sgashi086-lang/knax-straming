/* ============================================================
   IMPORTUESI MANUAL I SERIVE
============================================================ */

document.getElementById('btnSerieAdd').addEventListener('click', () => {
  const title = document.getElementById('serieTitle').value.trim();
  const season = document.getElementById('serieSeason').value.trim();
  const episode = document.getElementById('serieEpisode').value.trim();
  const embed = document.getElementById('serieEmbed').value.trim();
  const thumbnail = document.getElementById('serieThumbnail').value.trim();
  const channel = document.getElementById('serieChannel').value.trim();

  if (!title || !season || !episode || !embed || !thumbnail || !channel) {
    alert("Ju lutem plotësoni të gjitha fushat.");
    return;
  }

  const entry = {
    title,
    season,
    episode,
    embed,
    image: thumbnail,
    channel
  };

  document.getElementById('serieOutput').textContent =
    JSON.stringify(entry, null, 2);
});


/* ============================================================
   IMPORTUESI MANUAL I FILMAVE
============================================================ */

document.getElementById('btnFilmAdd').addEventListener('click', () => {
  const title = document.getElementById('filmTitle').value.trim();
  const genre = document.getElementById('filmGenre').value.trim();
  const year = document.getElementById('filmYear').value.trim();
  const embed = document.getElementById('filmEmbed').value.trim();
  const cover = document.getElementById('filmCover').value.trim();

  if (!title || !genre || !year || !embed || !cover) {
    alert("Ju lutem plotësoni të gjitha fushat.");
    return;
  }

  const entry = {
    title,
    genre,
    year,
    embed,
    cover
  };

  document.getElementById('filmOutput').textContent =
    JSON.stringify(entry, null, 2);
});
