let camps;

async function fetchCamps() {
  const data = await (
    await fetch("https://placement.freaks.se/api/v1/mapentities")
  ).json();

  camps = data
    .filter((e) => !e.isDeleted)
    .map((e) => {
      const geoJson = JSON.parse(e.geoJson);
      if (!geoJson.properties.name) {
        return;
      }

      const minLon = Math.min(
        ...geoJson.geometry.coordinates[0].map((c) => c[0])
      );
      const maxLon = Math.max(
        ...geoJson.geometry.coordinates[0].map((c) => c[0])
      );
      const minLat = Math.min(
        ...geoJson.geometry.coordinates[0].map((c) => c[1])
      );
      const maxLat = Math.max(
        ...geoJson.geometry.coordinates[0].map((c) => c[1])
      );
      const center = [(minLon + maxLon) / 2, (minLat + maxLat) / 2];

      const name = geoJson.properties.name.trim();
      const q = encodeURIComponent(`${center[1]},${center[0]} (${name})`);
      const googleMaps = `https://www.google.com/maps?q=${q}`;

      return {
        name,
        googleMaps,
      };
    })
    .filter(
      (e) =>
        e &&
        e.name.length > 0 &&
        !["the void", "offlimit"].includes(e.name.toLowerCase())
    );
}

function createComponentFromHTML(htmlString) {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

function mountFindCampButton() {
  const container = document.getElementById("find-camp-container");

  const input = createComponentFromHTML(
    `<input id="find-camp-input" class="button button-default" type="text" placeholder="🔍 Search for a camp..."/>`
  );
  const results = createComponentFromHTML(`<div id="find-camp-results"></div>`);

  input.onkeyup = (e) => {
    const value = e.target.value.toLowerCase();
    results.innerHTML = "";
    if (value.length >= 2) {
      const filteredCamps = camps
        .filter((camp) => camp.name.toLowerCase().includes(value))
        .sort((a, b) => a.name.localeCompare(b.name));

      filteredCamps.forEach((camp) => {
        const campElement =
          createComponentFromHTML(`<a href="${camp.googleMaps}"
            target="_blank" 
            rel="noopener"></a>`);
        campElement.textContent = camp.name; // to prevent XSS
        results.appendChild(campElement);
        results.appendChild(createComponentFromHTML(`<br/>`));
      });

      if (filteredCamps.length === 0) {
        results.appendChild(createComponentFromHTML(`<i>No results 💔</i>`));
      }
    }
  };

  container.appendChild(input);
  container.appendChild(results);
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchCamps();
  mountFindCampButton();
});
