document.addEventListener('DOMContentLoaded', () => {
    const shopTrigger = document.querySelector('.nav-shop');
    const shopDropdown = document.querySelector('.shop-dropdown');

    if (!shopTrigger || !shopDropdown) return;

    shopTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        shopDropdown.classList.toggle('shop-open');
    });

    document.addEventListener('click', (e) => {
        if (
            !shopTrigger.contains(e.target) &&
            !shopDropdown.contains(e.target)
        ) {
            shopDropdown.classList.remove('shop-open');
        }
    });
});