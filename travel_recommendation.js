// travel_recommendation.js

let recommendations = {};

fetch("travel_recommendation_api.json")
  .then(response => response.json())
  .then(data => {
    recommendations = data;
    console.log("Data loaded:", recommendations);
  })
  .catch(error => console.error("Error fetching data:", error));

// Show/hide sections for navigation
document.getElementById("homeLink").addEventListener("click", () => showSection("homeSection"));
document.getElementById("aboutLink").addEventListener("click", () => showSection("aboutSection"));
document.getElementById("contactLink").addEventListener("click", () => showSection("contactSection"));

function showSection(sectionId) {
    document.getElementById("homeSection").style.display = "none";
    document.getElementById("aboutSection").style.display = "none";
    document.getElementById("contactSection").style.display = "none";
    document.getElementById(sectionId).style.display = "block";
    clearResults();
}

function displayResults(results) {
  clearResults();
  const resultsSection = document.createElement("section");
  resultsSection.id = "results";

  if (!results || results.length === 0) {
    resultsSection.innerHTML = "<h2>No results found.</h2>";
  } else {
    resultsSection.innerHTML = "<h2>Recommended Destinations</h2>";
    results.forEach(place => {
      const placeDiv = document.createElement("div");
      placeDiv.style.marginBottom = "20px";
      if (place.cities) {
        place.cities.forEach(city => {
          placeDiv.innerHTML += `
            <h3>${city.name}, ${place.name}</h3>
            <p>${city.description}</p>
            <img src="${city.imageUrl}" alt="${city.name}" width="300">
          `;
        });
      } else {
        placeDiv.innerHTML += `
          <h3>${place.name}${place.country ? ", " + place.country : ""}</h3>
          <p>${place.description}</p>
          <img src="${place.imageUrl}" alt="${place.name}" width="300">
        `;
      }
      resultsSection.appendChild(placeDiv);
    });
  }
  document.body.appendChild(resultsSection);
}

function clearResults() {
  let existingSection = document.getElementById("results");
  if (existingSection) existingSection.remove();
}

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  let filteredResults = [];
  if (!query) {
    alert("Please enter a search term.");
    return;
  }
  if (query.includes("beach")) {
    filteredResults = recommendations.beaches || [];
  } else if (query.includes("temple")) {
    filteredResults = recommendations.temples || [];
  } else if (query.includes("country")) {
    filteredResults = recommendations.countries || [];
  } else {
    // Search all
    const allResults = []
      .concat(recommendations.beaches || [])
      .concat(recommendations.temples || []);
    (recommendations.countries || []).forEach(country => {
      (country.cities || []).forEach(city => {
        allResults.push({
          name: city.name,
          country: country.name,
          description: city.description,
          imageUrl: city.imageUrl
        });
      });
    });
    filteredResults = allResults.filter(item =>
      item.name.toLowerCase().includes(query) ||
      (item.country && item.country.toLowerCase().includes(query)) ||
      item.description.toLowerCase().includes(query)
    );
  }
  displayResults(filteredResults);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  clearResults();
});
