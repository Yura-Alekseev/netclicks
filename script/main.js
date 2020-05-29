const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';


const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const dropdown = document.querySelectorAll('.dropdown');
const tvShowsList= document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');
const tvShowsTitle = document.querySelector('.tv-shows__head');
const preloader = document.querySelector('.preloader');
const pagination = document.querySelector('.pagination');

const loading = document.createElement('div');
loading.classList.add('loading');


class DBService {
    constructor() {
        this.API_KEY = 'c4f22be2650095b76fad51929db0b942';
        this.SERVER = 'https://api.themoviedb.org/3';
    }

    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`{не удалось получить данные по адресу ${url}`)
        }
    };

    //response of search

    getSearchResult = (query) => {
        this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
        return this.getData(this.temp);
    };

    getNextPage = (page) => {
        return this.getData(this.temp + '&page=' + page);
    };

    //response for tv-card

    getTvShow = (id) => {
        return this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    };

    getTopRated = () => {
        return this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);
    };

    getPopular = () => {
        return this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);
    };

    getToday = () => {
        return this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);
    };

    getWeek = () => {
        return this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);
    };
}

const dbService = new DBService();

//render card

const renderCard = (response, target) => {
    tvShowsList.textContent = '';

    if (!response.total_results) {
        loading.remove();
        tvShowsTitle.textContent = 'По вашему запросу сериалов не найдено';
    } else {
        tvShowsTitle.textContent = target ? target.textContent : 'Результат поиска';

        response.results.forEach(item => {

            const {
                backdrop_path: backdrop,
                name: title,
                vote_average: vote,
                poster_path: poster,
                id
            } = item;

            const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
            const backdropIMG = backdrop ? IMG_URL + backdrop : '';
            const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

            const card = document.createElement('li');
            card.classList.add('tv-shows__item');

            card.innerHTML = `
            <a href="#" id="${id}" class="tv-card">
                ${voteElem}
                <img class="tv-card__img"
                     src="${posterIMG}"
                     data-backdrop="${backdropIMG}"
                     alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;

            loading.remove();
            tvShowsList.insertAdjacentElement("afterbegin", card);
        });

        pagination.textContent = '';

        if (!target && response.total_pages > 1) {
            for (let i = 1; i <= response.total_pages; i++) {
                pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`
            }
        }
    }
};

//search

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if (value) {
        dbService.getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
});

//toggle menu

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});


//close toggle menu

document.addEventListener('click', (event) => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        dropdown.forEach(item => {
            item.classList.remove('active')
        })
    }
});

//dropdown

leftMenu.addEventListener('click', (event) => {
    event.preventDefault();
    const target = event.target;
    const dropdownItem = target.closest('.dropdown');
    if (dropdownItem) {
        dropdownItem.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }

    if (target.closest('#top-rated')) {
        tvShows.append(loading);
        dbService.getTopRated().then((response) => {
            renderCard(response, target)
        });
    }

    if (target.closest('#popular')) {
        tvShows.append(loading);
        dbService.getPopular().then((response) => {
            renderCard(response, target)
        });
    }

    if (target.closest('#today')) {
        tvShows.append(loading);
        dbService.getToday().then((response) => {
            renderCard(response, target)
        });
    }

    if (target.closest('#week')) {
        tvShows.append(loading);
        dbService.getWeek().then((response) => {
            renderCard(response, target)
        });
    }

    if (target.closest('#search')) {
        tvShowsList.textContent = '';
    }

});

//modal for tv-card

tvShowsList.addEventListener('click', (event) => {
    event.preventDefault();

    preloader.style.display = 'flex';

    const target = event.target;
    const card = target.closest('.tv-card');


    if (card) {
        dbService.getTvShow(card.id)
            .then((data) => {
                if (data.poster_path) {
                    tvCardImg.src = IMG_URL + data.poster_path;
                    tvCardImg.alt = data.name;
                } else if(!data.poster_path && data.backdrop_path) {
                    tvCardImg.src = IMG_URL + data.backdrop_path;
                    tvCardImg.alt = data.name;
                } else {
                    tvCardImg.src = 'img/no-poster.jpg';
                }


                modalTitle.textContent = data.name;
                genresList.textContent = '';
                for (const item of data.genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`
                }
                rating.textContent = data.vote_average;
                description.textContent = data.overview;
                modalLink.href = data.homepage;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
            .finally(() => {
                preloader.style.display = '';
            })
    }
});

//close modal tv-card

modal.addEventListener('click', (event) => {
    if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});

//change image in tv-card after hover

const changeImage = (event) => {
    const card = event.target.closest('.tv-card');

    if (card) {
        const img = card.querySelector('.tv-card__img');
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
        }
    }
};

tvShowsList.addEventListener('mouseover', changeImage);

tvShowsList.addEventListener('mouseout', changeImage);

pagination.addEventListener('click', (event) => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('pages')) {
        tvShows.append(loading);
        dbService.getNextPage(target.textContent).then(renderCard);
    }
});
