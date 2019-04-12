let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
    center: [40.722216, -73.987501],
    zoom: 12,
    scrollWheelZoom: false
  });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoiZGF2aWRzaWx2YXNwIiwiYSI6ImNqc2NoOTh4bDBrNTgzeWpuMHRia2s0NTcifQ.1uFX0nSwsptbOJyCeZGiPA',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
}
/* window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
} */

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  const cText = cSelect.options[cIndex].textContent;
  const nText = nSelect.options[nIndex].textContent
  const section = document.getElementById('restaurants-list');

  section.setAttribute('aria-label', `List of restaurants for ${cText} in ${nText}`);

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const section = document.getElementById('restaurants-list');
  section.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const section = document.getElementById('restaurants-list')

  if(restaurants.length) {
    restaurants.forEach(restaurant => {
      section.append(createRestaurantHTML(restaurant));
    });

    addMarkersToMap();
  } else {
    handleRestaurantNotFound(section);
  }

}

/**
 * Display an error message if there are no results for the searched restaurants.
 */
handleRestaurantNotFound = section => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cText = cSelect.options[cSelect.selectedIndex].textContent;
  const nText = nSelect.options[nSelect.selectedIndex].textContent

  const errorMsg = document.createElement('h2');
  errorMsg.className = 'no-results';
  errorMsg.innerHTML = `No restaurant found for <b>${cText}</b> in <b>${nText}</b>.`;

  section.setAttribute('aria-label', `No restaurant found for ${cText} in ${nText}`);
  section.append(errorMsg);
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const article = document.createElement('article');
  article.className = 'restaurant-card';
  article.setAttribute('role', 'contentinfo');
  article.setAttribute('aria-label', `Card content about ${restaurant.name} Restaurant's`);
  article.tabIndex = 0;
  article.classList.add('load');

  const cover = document.createElement('div');
  cover.className = 'restaurant-cover';

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.alt = `Cover image of ${restaurant.name} restaurant`;
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.tabIndex = 0;
  cover.append(image);

  article.append(cover);

  // restaurant box info
  const info = document.createElement('div');
  info.className = 'restaurant-info';

  // title
  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  name.tabIndex = 0;
  info.append(name);

  // div location
  const location = document.createElement('address');
  location.tabIndex = 0;

  // address
  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  location.append(neighborhood);
  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  location.append(address);

  info.append(location);

  // link more details
  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.setAttribute('aria-label', `More details about ${restaurant.name} Restaurant's`);
  info.append(more);

  article.append(info);

  return article;
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

}
/* addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
} */
