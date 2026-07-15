document.addEventListener('DOMContentLoaded', () => {
    const shopLink = document.querySelector('a[href="#shops"]');
    const shopSection = document.querySelector('#shops');
    const header = document.querySelector('.header-wrapper');
  
    if (!shopLink || !shopSection || !header) return;
  
    // Move dropdown below header
    header.appendChild(shopSection);
  
    // Initially hidden
    shopSection.classList.add('shop-hidden');
  
    shopLink.addEventListener('click', (e) => {
      e.preventDefault();
  
      shopSection.classList.toggle('shop-hidden');
      shopSection.classList.toggle('shop-open');
      shopLink.classList.toggle('active');
    });
  
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        !shopSection.contains(e.target) &&
        !shopLink.contains(e.target)
      ) {
        shopSection.classList.add('shop-hidden');
        shopSection.classList.remove('shop-open');
        shopLink.classList.remove('active');
      }
    });
  });
  