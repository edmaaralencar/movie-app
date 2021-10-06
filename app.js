const moviesList = document.querySelector(".movies-list");
const movieContent = document.querySelector(".movie-content");
const flex = document.querySelector(".flex");
const searchInput = document.querySelector(".search-input");
const addMovieButton = document.querySelector(".add-movie");
const modalOverlay = document.querySelector(".modal-overlay");
const movieForm = document.querySelector("form");
const removeMovieButton = document.querySelector(".remove-movie");
const showMovies = document.querySelector(".menu");

const getMovies = () => JSON.parse(localStorage.getItem("movies")) || [];
const setMovies = (movie) => localStorage.setItem("movies", JSON.stringify(movie));
const movies = getMovies();

const HTMLTemplates = {
  getListMovieTemplate(movie) {
    return `
        <div class="movie" data-movie="${movie.id}">
            <img src="./imgs/${movie.img_path}" alt="" class="movie-info--img">
            
            <div class="movie-info">
                <h3 class="movie-info--title">
                    ${movie.title}
                </h3>
                <div class="movie-info--rate">
                    <img src="./imgs/star-colored-icon.svg" alt="">
                    ${movie.rate}/10
                </div>
            </div>
        </div>
        `;
  },

  getMovieContentTemplate(movie) {
    return `
        <img src="./imgs/${movie.img_path}" alt="" class="movie-img">
        <h1 class="movie-title">${movie.title}</h1>

        <div class="movie-desc--container">
            <div class="movie-desc--box">
                <img src="./imgs/clock-icon.svg" alt="">
                ${movie.duration}
            </div>
            <div class="movie-desc--box">
                <img src="./imgs/star-icon.svg" alt="">
                ${movie.rate}/10
            </div>
            <div class="movie-desc--box">
                <img src="./imgs/calendar-icon.svg" alt="">
                ${movie.release_date}
            </div>
            <div class="movie-desc--box">
                <img src="./imgs/platform-icon.svg" alt="">
                ${movie.platform}
            </div>
        </div>

        <div class="movie-genres--container">
            ${Utils.generateGenres(movie.genres)}
        </div>

        <div class="movie-text--box">
            <h2 class="movie-subtitle">Descrição</h2>
            <div class="movie-desc">
                ${movie.description}
            </div>
        </div>

        <div class="movie-text--box">
            <h2 class="movie-subtitle">Opinião</h2>
            <div class="movie-desc">
                ${movie.opinion}
            </div>
        </div>

        <button data-trash="${
          movie.id
        }" class="remove-movie">Remover filme</button>
        `;
  },
};

const Utils = {
  generateGenres(genres) {
    let newArray = [];

    genres.forEach((genre) => {
      newArray.push(`<div class="movie-genre">${genre}</div>`);
    });

    return newArray;
  },

  generateRandomId() {
    return Math.floor(Math.random() * 1000);
  },

  hideUnfilteredMovies(movie) {
    movie.classList.remove("d-flex");
    movie.classList.add("hidden");
  },

  showUnfilteredMovies(movie) {
    movie.classList.remove("hidden");
    movie.classList.add("d-flex");
  },
};

// Filter movies
searchInput.addEventListener("input", (event) => {
  const inputValue = event.target.value.trim().toLowerCase();

  const moviesListInArray = Array.from(moviesList.children);

  moviesListInArray
    .filter((movie) => !movie.textContent.toLowerCase().includes(inputValue))
    .forEach((movie) => Utils.hideUnfilteredMovies(movie));

  moviesListInArray
    .filter((movie) => movie.textContent.toLowerCase().includes(inputValue))
    .forEach((movie) => Utils.showUnfilteredMovies(movie));
});

// More info about a movie
moviesList.addEventListener("click", (event) => {
  const clickedElement = event.target;

  if (clickedElement.dataset.movie) {
    Array.from(moviesList.children).forEach((element) => {
      element.classList.remove("active");
    });

    const dataOfClickedElement = clickedElement.dataset.movie;
    const clickedMovie = document.querySelector(
      `[data-movie="${dataOfClickedElement}"]`
    );
    const getClickedMovieObject = movies.find(
      (movie) => movie.id === Number(dataOfClickedElement)
    );

    flex.style.height = "auto";
    clickedMovie.classList.add("active");
    movieContent.innerHTML = HTMLTemplates.getMovieContentTemplate(
      getClickedMovieObject
    );
    moviesList.classList.add('hide')
  }
});

// Add a movie
movieForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = event.target.title.value;
  const img_path = event.target.imgpath.value;
  const duration = event.target.duration.value;
  const rate = event.target.rate.value;
  const release_date = event.target.releasedate.value;
  const platform = event.target.platform.value;
  const genreValue = event.target.genre.value;
  const description = document.querySelector("#description").value;
  const opinion = document.querySelector("#opinion").value;
  const id = Utils.generateRandomId();
  const genres = genreValue.split(",");

  if (
    title &&
    img_path &&
    duration &&
    genres &&
    rate &&
    release_date &&
    platform &&
    description &&
    opinion
  ) {
    const movie = {
      title,
      img_path,
      duration,
      rate,
      release_date,
      genres,
      platform,
      platform,
      description,
      opinion,
      id,
    };

    movies.push(movie);
    moviesList.innerHTML += HTMLTemplates.getListMovieTemplate(movie);
    event.target.reset();
    modalOverlay.classList.remove("active");

    setMovies(movies);
    return;
  }
});

// Remove a movie
movieContent.addEventListener("click", (event) => {
  const clickedElement = event.target;
  const datasetOfClickedElement = clickedElement.dataset.trash;

  if (datasetOfClickedElement) {
    const getRemovedMovie = movies.find(
      (movie) => movie.id === Number(datasetOfClickedElement)
    );

    movies.splice(movies.indexOf(getRemovedMovie), 1);

    setMovies(movies);

    moviesList.innerHTML = "";
    movieContent.innerHTML = "";
    flex.style.height = "calc(100vh - 11.6rem)";
    movies.forEach((movie) => {
      moviesList.innerHTML += HTMLTemplates.getListMovieTemplate(movie);
    });
  }
});

// Open modal
addMovieButton.addEventListener("click", () => {
  modalOverlay.classList.add("active");
});

// Close modal
modalOverlay.addEventListener("click", (event) => {
  const clickedElement = event.target;

  if (clickedElement.classList.contains("modal-overlay") || (clickedElement.classList.contains("close-modal"))) {
    modalOverlay.classList.remove("active");
    return;
  }
});

// Update UI
movies.forEach((movie) => {
  moviesList.innerHTML += HTMLTemplates.getListMovieTemplate(movie);
});


showMovies.addEventListener('click', () => {

    if (moviesList.classList.contains('hide')) {
        moviesList.classList.remove('hide')
    } else {
        moviesList.classList.add('hide')
   }
})