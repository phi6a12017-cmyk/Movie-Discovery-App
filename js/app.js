
// Movie data (bổ sung thêm phim nếu muốn)
const movies = [
  {
    id: 1,
    title: "Titanic",
    year: 1997,
    genres: ["Romance", "Drama"],
    poster: "images/titanic.png",
    description: "A love story on the Titanic.",
    director: "James Cameron",
    actors: "Leonardo DiCaprio, Kate Winslet"
  },
  {
    id: 2,
    title: "Avengers",
    year: 2012,
    genres: ["Action", "Sci-Fi"],
    poster: "images/avengers.png",
    description: "Superhero team-up movie.",
    director: "Joss Whedon",
    actors: "Robert Downey Jr., Chris Evans"
  },
  {
    id: 3,
    title: "The Godfather",
    year: 1972,
    genres: ["Crime", "Drama"],
    poster: "images/Thegodfather.png",
    description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
    director: "Francis Ford Coppola",
    actors: "Marlon Brando, Al Pacino"
  },
  {
    id: 4,
    title: "Toy Story",
    year: 1995,
    genres: ["Animation", "Comedy", "Family"],
    poster: "images/toy story.png    ",
    description: "A cowboy doll is profoundly threatened by a new spaceman figure.",
    director: "John Lasseter",
    actors: "Tom Hanks, Tim Allen"
  }
];

// DOM Elements
const moviesList = document.getElementById('movies-list');
const genreForm = document.getElementById('genre-form');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('movie-modal');
const modalDetails = document.getElementById('modal-details');
const closeModalBtn = document.getElementById('close-modal');
const toggleModeBtn = document.getElementById('toggle-mode');

// 1. Render Movie Cards
function renderMovies(list) {
  moviesList.innerHTML = '';
  if (list.length === 0) {
    moviesList.innerHTML = '<p>Không tìm thấy phim phù hợp.</p>';
    return;
  }
  list.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>${movie.year}</p>
    `;
    card.addEventListener('click', () => openModal(movie));
    moviesList.appendChild(card);
  });
}

// 2. Render Genre Filters (auto detect)
function getAllGenres(movies) {
  const genres = new Set();
  movies.forEach(m => m.genres.forEach(g => genres.add(g)));
  return Array.from(genres).sort();
}
function renderGenreFilters() {
  const genres = getAllGenres(movies);
  genreForm.innerHTML = '';
  genres.forEach(genre => {
    const id = `genre-${genre.replace(/\s+/g, '-')}`;
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="checkbox" value="${genre}" name="genre" id="${id}">
      ${genre}
    `;
    genreForm.appendChild(label);
  });
}

// 3. Filter Logic (genre + search, both combined)
function getSelectedGenres() {
  return Array.from(genreForm.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
}
function filterMovies() {
  const selectedGenres = getSelectedGenres();
  const keyword = searchInput.value.trim().toLowerCase();
  return movies.filter(movie => {
    // Filter by genres
    const genreMatch = selectedGenres.length === 0 || movie.genres.some(g => selectedGenres.includes(g));
    // Filter by search
    const searchMatch = keyword === '' || movie.title.toLowerCase().includes(keyword);
    return genreMatch && searchMatch;
  });
}

// 4. Debounce for search
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 5. Modal logic
function openModal(movie) {
  modalDetails.innerHTML = `
    <img src="${movie.poster}" alt="${movie.title}">
    <h2>${movie.title} (${movie.year})</h2>
    <p><strong>Thể loại:</strong> ${movie.genres.join(', ')}</p>
    <p><strong>Đạo diễn:</strong> ${movie.director || 'N/A'}</p>
    <p><strong>Diễn viên:</strong> ${movie.actors || 'N/A'}</p>
    <p><strong>Mô tả:</strong> ${movie.description || ''}</p>
  `;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// 6. Light/Dark Mode logic
function setMode(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    toggleModeBtn.querySelector('.toggle-icon').textContent = '🌙';
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    toggleModeBtn.querySelector('.toggle-icon').textContent = '☀️';
  }
}
function toggleMode() {
  setMode(!document.body.classList.contains('dark-mode'));
}
toggleModeBtn.addEventListener('click', toggleMode);
// On load, set theme from localStorage
setMode(localStorage.getItem('theme') === 'dark');

// 7. Event listeners for filters
function updateMovies() {
  renderMovies(filterMovies());
}
const debouncedUpdate = debounce(updateMovies, 400);
genreForm.addEventListener('change', updateMovies);
searchInput.addEventListener('input', debouncedUpdate);

// 8. Initial render
renderGenreFilters();
updateMovies();
