//Menu

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const dropdown = document.querySelectorAll('.dropdown');
const tvCard= document.querySelectorAll('.tv-card');
//toggle menu

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

//dropdown

leftMenu.addEventListener('click', (event) => {
    const target = event.target;
    const dropdownItem = target.closest('.dropdown');
    if (dropdownItem) {
        dropdownItem.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    } else if (!target.closest('.left-menu__list')) {
        dropdown.forEach(item => {
            item.classList.remove('active')
        })
    }
});

tvCard.forEach(item => {
    const img = item.querySelector('.tv-card__img');
    const imgSrc = img.src;
    item.addEventListener('mouseenter', () => {
        img.src = img.dataset.backdrop;
    });

    item.addEventListener('mouseleave', () => {
        img.src = imgSrc;
    });
});
