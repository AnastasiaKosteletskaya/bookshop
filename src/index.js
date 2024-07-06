import './styles.css';
import { initSlider } from './slider';
import { loadBooks, setupCategoryHandlers, setupLoadMoreHandler, updateCartBadge } from './books';

initSlider();

setupCategoryHandlers();
setupLoadMoreHandler();

updateCartBadge();

document.addEventListener('DOMContentLoaded', () => {

    const burgerMenu = document.getElementById('burger-menu');
    const nav = document.querySelector('nav');
    const icons = document.querySelector('.icons');

    burgerMenu.addEventListener('click', () => {
        nav.classList.toggle('active');
        icons.classList.toggle('active');
    });


    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        });
    });

    document.querySelector('nav a').classList.add('active');
});

