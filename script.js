// ------------------------------------------------------
// 1) JSON LADEN (Aus getrennten Dateien via Promise.all)
// ------------------------------------------------------
Promise.all([
  fetch("seriale.json").then((res) => {
    if (!res.ok) throw new Error("seriale.json konnte nicht geladen werden");
    return res.json();
  }),
  fetch("filma.json").then((res) => {
    if (!res.ok) throw new Error("filma.json konnte nicht geladen werden");
    return res.json();
  })
])
  .then(([serialeData, filmaData]) => {
    renderSeriale(serialeData);
    renderFilma(filmaData);

    // Erst NACH dem Rendern aktivieren
    activateSearch();
    activatePopupAndVideoControl(); // Kombinierte Steuerung für Popups
  })
  .catch((error) => {
    console.error("Fehler beim Laden der JSON-Daten:", error);
  });

// ------------------------------------------------------
// 2) SERIEN RENDERN (PERFORMANCE-OPTIMIERT mit data-src)
// ------------------------------------------------------
function renderSeriale(list) {
  const container = document.querySelector(".carousel-seriale");
  if (!container) return;
  container.innerHTML = "";

  list.forEach((item, index) => {
    const id = index + 1;

    container.innerHTML += `
      <a href="#fenster${id}" class="card" style="background-image: url('${item.image}')">
        <div class="card-text">
          <h3>${item.title}</h3>
          <h4>Episodi ${item.episode}</h4>
          <p>${item.day} • ${item.time}</p>
        </div>
      </a>

      <div id="fenster${id}" class="popup-overlay">
        <div class="popup-box">
          <a href="#seriale" class="close-btn">&times;</a>

          <!-- WICHTIG: data-src statt src verhindert das Laden im Hintergrund -->
          <iframe width="560" height="315"
            data-src="https://www.youtube.com/embed/${item.youtube}?autoplay=1"
            allow="autoplay; fullscreen"
            allowfullscreen>
          </iframe>

          <h3>${item.title}</h3>
          <h4>Episodi ${item.episode}</h4>
          <p>${item.day} • ${item.time}</p>
        </div>
      </div>
    `;
  });
}

// ------------------------------------------------------
// 3) FILME RENDERN (PERFORMANCE-OPTIMIERT mit data-src)
// ------------------------------------------------------
function renderFilma(list) {
  const container = document.querySelector(".carousel-filma");
  if (!container) return;
  container.innerHTML = "";

  list.forEach((item, index) => {
    const id = "film" + (index + 1);

    container.innerHTML += `
      <a href="#${id}" class="card-h" style="background-image: url('${item.image}')">
        <div class="card-h-text">
          <h3>${item.title}</h3>
        </div>
      </a>

      <div id="${id}" class="popup-overlay">
        <div class="popup-box">
          <a href="#filma" class="close-btn">&times;</a>

          <!-- WICHTIG: data-src statt src verhindert das Laden im Hintergrund -->
          <iframe width="560" height="315"
            data-src="https://www.youtube.com/embed/${item.youtube}?autoplay=1"
            allow="autoplay; fullscreen"
            allowfullscreen>
          </iframe>

          <h3>${item.title}</h3>
          <h4>${item.genre}</h4>
          <p>${item.year}</p>
        </div>
      </div>
    `;
  });
}

// ------------------------------------------------------
// 4) SUCHFUNKTION
// ------------------------------------------------------
function activateSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchForm = document.querySelector(".searchBar");
  if (!searchForm || !searchInput) return;

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchTerm = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".card, .card-h");

    cards.forEach((card) => {
      const h3Element = card.querySelector("h3");
      if (h3Element) {
        const title = h3Element.textContent.toLowerCase();
        card.style.display = title.includes(searchTerm) ? "flex" : "none";
      }
    });
  });
}

// ------------------------------------------------------
// 5) POPUP- TEXT CONTROL & BLITZSCHNELLES VIDEO-MANAGEMENT
// ------------------------------------------------------
function activatePopupAndVideoControl() {
  // A) BEIM ÖFFNEN: Video erst jetzt wirklich in den Player laden (Super schnell!)
  document.querySelectorAll(".card, .card-h").forEach((card) => {
    card.addEventListener("click", function () {
      const targetId = this.getAttribute("href");
      if (!targetId) return;

      const popup = document.querySelector(targetId);
      if (!popup) return;

      // Video-URL aktiv setzen
      const iframe = popup.querySelector("iframe");
      if (iframe && iframe.dataset.src) {
        iframe.src = iframe.dataset.src;
      }

      // Text synchronisieren
      const cardH3 = this.querySelector("h3")?.textContent || "";
      const cardH4 = this.querySelector("h4")?.textContent || "";
      const cardP = this.querySelector("p")?.textContent || "";

      const popupH3 = popup.querySelector("h3");
      const popupH4 = popup.querySelector("h4");
      const popupP = popup.querySelector("p");

      if (popupH3) popupH3.textContent = cardH3;
      if (popupH4) popupH4.textContent = cardH4;
      if (popupP) popupP.textContent = cardP;
    });
  });

  // B) BEIM SCHLIESSEN: Video-Source leeren stoppt die Wiedergabe sofort zu 100%
  window.addEventListener("hashchange", () => {
    // Wenn kein Popup mehr aktiv ist (oder ein Anker gewechselt wurde)
    const currentHash = window.location.hash;
    
    document.querySelectorAll(".popup-overlay").forEach((popup) => {
      // Wenn das Popup nicht mehr das aktive Ziel ist, leere sein iframe
      if (currentHash !== "#" + popup.id) {
        const iframe = popup.querySelector("iframe");
        if (iframe) iframe.src = "";
      }
    });
  });
}
