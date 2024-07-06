export const updateCartBadge = () => {
    const cartBadge = document.getElementById('cart-badge');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartBadge.textContent = cart.length;
    cartBadge.style.display = cart.length > 0 ? 'inline' : 'none';
};
