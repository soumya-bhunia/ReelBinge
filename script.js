const apiKey = 'de80b2796366f4bca92a9fa38cbe7338';
const now_playing = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
const top_rated = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
const now_airing = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}`;
const nowPlayingIndia = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=hi-IN&region=IN&with_original_language=hi`;
const bollywood = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=hi-IN&region=IN&with_original_language=hi`;

const top_rated_series = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}`;
const korean_series = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=ko-KR&region=KR&sort_by=popularity.desc&with_original_language=ko`;

function fetchSpecificMovies(movieIds) {
  const moviePromises = movieIds.map(movieId => {
    return fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
  });
  
  return Promise.all(moviePromises)
    .then(responses => Promise.all(responses.map(response => response.json())))
    .catch(error => console.error('Error fetching specific movies:', error));
}

function fetchAndDisplayMovies(url, containerId, movieIds = null) {
  const movieList = document.querySelector('#' + containerId);
  movieList.innerHTML = ""; // Clear previous content
  
  if (movieIds) {
    fetchSpecificMovies(movieIds)
      .then(movies => {
        movies.forEach(movie => {
          // Create and append movie image element
          const image = document.createElement('img');
          image.classList.add('card-image');
          image.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
          image.alt = movie.title;
          image.style.cursor = 'pointer';
          image.style.borderRadius = '1.2rem';
          
          image.addEventListener('mouseenter', () => {
            image.style.transform = 'scale(1.1)';
          });
          
          image.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1)';
          });
          
          image.addEventListener('click', () => {
            handlePosterClick(movie.id);
          });
          
          movieList.appendChild(image);
        });
      });
  } else {
    // Existing code for fetching from URL
    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.results.forEach(movie => {
          // Create and append movie image element
          const image = document.createElement('img');
          image.classList.add('card-image');
          image.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
          image.alt = movie.title;
          image.style.cursor = 'pointer';
          image.style.borderRadius = '1.2rem';
          
          image.addEventListener('mouseenter', () => {
            image.style.transform = 'scale(1.1)';
          });
          
          image.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1)';
          });
          
          image.addEventListener('click', () => {
            handlePosterClick(movie.id);
          });
          
          movieList.appendChild(image);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }
}

function handlePosterClick(movieId) {
  // Redirect to movie details page with movie ID as URL parameter
  window.location.href = `movie_details/movie_details.html?id=${movieId}`;
}

function fetchAndDisplaySeries(url, containerId) {
  const seriesList = document.querySelector('#' + containerId);
  seriesList.innerHTML = ""; // Clear previous content
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      data.results.forEach(series => {
        const image = document.createElement('img');
        image.classList.add('card-image');
        image.src = `https://image.tmdb.org/t/p/w200${series.poster_path}`;
        image.alt = series.name;
        image.style.cursor = 'pointer';
        image.style.borderRadius = '1.2rem';

        image.addEventListener('mouseenter', () => {
          image.style.transform = 'scale(1.1)';
        });
        
        image.addEventListener('mouseleave', () => {
          image.style.transform = 'scale(1)';
        });

        image.addEventListener('click', () => {
          fetchAndDisplaySeriesEpisodes(series.id);
        });

        seriesList.appendChild(image);
      });

      adjustImageHeights();
    })
    .catch(error => console.error('Error fetching data:', error));
}

function fetchAndDisplaySeriesEpisodes(seriesId) {
  // Redirect to series details page with series ID as URL parameter
  window.location.href = `series_details/series_details.html?id=${seriesId}`;
}

document.addEventListener('DOMContentLoaded', function() {
  fetchAndDisplayMovies(now_playing, 'movies');
  fetchAndDisplayMovies(top_rated, 'topratedmovies');
  fetchAndDisplayMovies(nowPlayingIndia, 'moviesind');
  fetchAndDisplayMovies(bollywood, 'bollywood');
  
  // Series
  fetchAndDisplaySeries(now_airing, 'series');
  fetchAndDisplaySeries(top_rated_series, 'seriestr');
  fetchAndDisplaySeries(korean_series, 'koreanseries');
  
  // Display specific movies
  fetchAndDisplayMovies(null, 'specificMovies', [27205, 49026, 299534, 24428,396535, 157336, 299534, 603692]);
});

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const movieIds = [106646,324552,49026,911430,396535,945961,1112426]; // Movie IDs
    const tvIds = [219937,71446,127532, 76479,37680,37854]; // TV Show IDs
    const slider = document.querySelector('.slider');

    // Function to fetch and append content
    async function fetchAndAppendContent(url, type) {
      const response = await fetch(url);
      const data = await response.json();

      if (data.backdrop_path) {
        const item = document.createElement('li');
        item.classList.add('item');
        item.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${data.backdrop_path}')`;

        const content = document.createElement('div');
        content.classList.add('content');
        content.innerHTML = `
          <h2 class='title'>${type === 'movie' ? data.title : data.name}</h2>
          <p class='description'>${data.overview}</p>
          <a href="movie_details/movie_details.html?id=${data.id}&type=${type}" class="watch-now-button">Watch Now</a>
        `;

        item.appendChild(content);
        slider.appendChild(item);
      }
    }

    // Fetch and append movies
    for (const movieId of movieIds) {
      const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
      await fetchAndAppendContent(movieUrl, 'movie');
    }

    // Fetch and append TV shows
    for (const tvId of tvIds) {
      const tvUrl = `https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}&language=en-US`;
      await fetchAndAppendContent(tvUrl, 'tv');
    }

  } catch (error) {
    console.error('Error fetching movies or TV shows:', error);
  }
});

// Slider navigation logic remains unchanged
document.addEventListener('DOMContentLoaded', function() {
  let a = 6;
  const slider = document.querySelector('.slider');
  const nav = document.querySelector('.nav');

  function activate(e) {
    let inx = 0;
    const items = document.querySelectorAll('.item');

    if (e.target.matches('.next') || e.key === 'ArrowRight') {
      slider.append(items[0]);
      inx = 2;
    }
    if (e.target.matches('.prev') || e.key === 'ArrowLeft') {
      slider.prepend(items[items.length - 1]);
    }

    items.forEach(item => {
      item.style.opacity = 1;
    });
    document.querySelector(`.slider .item:nth-child(${a})`).style.opacity = 0;

    nav.addEventListener('mouseenter', () => {
      items.forEach(item => {
        item.style.opacity = 1;
      });
      document.querySelector(`.slider .item:nth-child(6)`).style.opacity = 0;
    });

    nav.addEventListener('mouseleave', () => {
      items.forEach((item, index) => {
        if (index === inx) {
          item.style.opacity = 1;
        } else {
          item.style.opacity = 0;
        }
      });
    });
  }

  // Click event listener for navigation
  nav.addEventListener('click', activate);

  // Keyboard event listener for arrow key navigation
  document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      activate(event);
    }
  });
});


// Sidebar logic remains unchanged//
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuBtnChange();
});
searchBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuBtnChange();
});

function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
  }
}

// Scroll container navigation logic remains unchanged
document.addEventListener("DOMContentLoaded", function() {
  const scrollContainers = document.querySelectorAll('.scroll-container');
  const fwButtons = document.querySelectorAll('.btf');
  const bwButtons = document.querySelectorAll('.btw');

  function scrollLeft(container) {
    container.scrollLeft -= 200;
  }

  function scrollRight(container) {
    container.scrollLeft += 200;
  }

  fwButtons.forEach((button, index) => {
    button.addEventListener('click', () => scrollLeft(scrollContainers[index]));
  });

  bwButtons.forEach((button, index) => {
    button.addEventListener('click', () => scrollRight(scrollContainers[index]));
  });
});

// Animation control on hover remains unchanged
document.addEventListener("DOMContentLoaded", function() {
  const fwButtons = document.querySelectorAll('.btf');
  const bwButtons = document.querySelectorAll('.btw');
  const imagesContainers = document.querySelectorAll('.scroll-container');

  function stopAnimation(images) {
    images.forEach(img => {
      img.style.animation = 'none';
    });
  }

  function resumeAnimation(images) {
    images.forEach(img => {
      img.style.animation = 'scrollMovies 20s linear infinite';
    });
  }

  fwButtons.forEach((fwButton, index) => {
    const images = imagesContainers[index].querySelectorAll('img');
    fwButton.addEventListener('mouseover', () => stopAnimation(images));
    fwButton.addEventListener('mouseleave', () => resumeAnimation(images));
  });

  bwButtons.forEach((bwButton, index) => {
    const images = imagesContainers[index].querySelectorAll('img');
    bwButton.addEventListener('mouseover', () => stopAnimation(images));
    bwButton.addEventListener('mouseleave', () => resumeAnimation(images));
  });

  imagesContainers.forEach(container => {
    container.addEventListener('mouseover', () => stopAnimation(container.querySelectorAll('img')));
    container.addEventListener('mouseleave', () => resumeAnimation(container.querySelectorAll('img')));
  });
});

// Search functionality remains unchanged
function searchMovies() {
  const query = document.getElementById('searchInput').value;
  if (query.length < 3) {
    alert("Please enter at least 3 characters for search.");
    return;
  }
  const url = `results/results.html?query=${query}`;
  window.location.href = url;
}

// Responsive image height adjustment remains unchanged
function adjustImageHeights() {
  const images = document.querySelectorAll('.card-image');
  images.forEach(image => {
    if (document.body.clientWidth <= 768) {
      image.style.height = "25vh";
    } else {
      image.style.height = "35vh";
    }
  });
}

window.addEventListener('resize', adjustImageHeights);