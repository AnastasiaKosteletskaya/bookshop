import { apiKey } from './config';

let booksCache = {};
let startIndex = 0;

export const loadBooks = (category, startIndex = 0, maxResults = 6) => {
    console.log(`Loading books for category: ${category}, startIndex: ${startIndex}, maxResults: ${maxResults}`);
    const url = `https://www.googleapis.com/books/v1/volumes?q="subject:${category}"&key=${apiKey}&printType=books&startIndex=${startIndex}&maxResults=${maxResults}&langRestrict=en`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!booksCache[category]) {
                booksCache[category] = [];
            }
            booksCache[category] = booksCache[category].concat(data.items);
            console.log(`Books loaded: ${data.items.length}`);
            displayBooks(data.items);
        })
        .catch(error => console.error('Error fetching books:', error));
};

const displayBooks = (books) => {
    const booksSection = document.querySelector('.books');
    books.forEach(item => {
        const book = item.volumeInfo;
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.innerHTML = `
            <img src="${book.imageLinks?.thumbnail || './assets/placeholder.jpg'}" alt="${book.title}" />
            <div class="book-info">
                <h2>${book.title}</h2>
                <p class="author">${book.authors?.join(', ') || 'Unknown'}</p>
                ${book.averageRating ? `<p class="reviews">${book.averageRating} stars, ${book.ratingsCount} reviews</p>` : ''}
                <p class="description">${book.description ? truncateDescription(book.description) : ''}</p>
                ${book.saleInfo?.listPrice ? `<p class="price">${book.saleInfo.listPrice.amount} ${book.saleInfo.listPrice.currencyCode}</p>` : ''}
                <button class="${isInCart(item.id) ? 'in-cart' : ''}">${isInCart(item.id) ? 'In Cart' : 'Buy Now'}</button>
            </div>
        `;
        booksSection.appendChild(bookItem);

        const buyButton = bookItem.querySelector('button');
        buyButton.addEventListener('click', () => {
            toggleCartItem(item.id);
            updateCartBadge();
            buyButton.textContent = isInCart(item.id) ? 'In Cart' : 'Buy Now';
            buyButton.classList.toggle('in-cart', isInCart(item.id));
        });
    });
};

const truncateDescription = (description) => {
    const maxLength = 200;
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
    }
    return description;
};

const toggleCartItem = (bookId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const bookIndex = cart.findIndex(item => item === bookId);

    if (bookIndex !== -1) {
        cart.splice(bookIndex, 1);
    } else {
        cart.push(bookId);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
};

const isInCart = (bookId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.includes(bookId);
};

export const setupCategoryHandlers = () => {
    const categories = document.querySelectorAll('.category');
    categories.forEach((category, index) => {
        category.addEventListener('click', () => {
            document.querySelector('.category.active').classList.remove('active');
            category.classList.add('active');
            document.querySelector('.books').innerHTML = '';
            startIndex = 0;
            loadBooks(category.textContent, 0, 6);
        });

        if (index === 0) {
            category.classList.add('active');
            loadBooks(category.textContent, 0, 6);
        }
    });
};

export const setupLoadMoreHandler = () => {
    const loadMoreButton = document.getElementById('load-more');
    loadMoreButton.addEventListener('click', () => {
        const activeCategory = document.querySelector('.category.active').textContent;
        startIndex += 6;
        console.log(`Loading more books for category: ${activeCategory}, startIndex: ${startIndex}`);
        loadBooks(activeCategory, startIndex, 6);
    });
};

export const updateCartBadge = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBadge = document.getElementById('cart-badge');
    cartBadge.textContent = cart.length;
};
