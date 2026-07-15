export default function decorate(block) {
    const shopLink = document.querySelector('a[href="#shop"]')
      || document.querySelector('a[href="#shops"]');
  
    const shopSection = document.querySelector('#shops');
  
    if (!shopLink || !shopSection) return;
  
    shopSection.classList.remove('shop-open');
  
    shopLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
  
      shopSection.classList.toggle('shop-open');
      shopLink.classList.toggle('active');
    });
  
    document.addEventListener('click', (e) => {
      if (
        !shopSection.contains(e.target) &&
        !shopLink.contains(e.target)
      ) {
        shopSection.classList.remove('shop-open');
        shopLink.classList.remove('active');
      }
    });
  }