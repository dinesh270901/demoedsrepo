export default async function decorate(block) {
    const shopLink = document.querySelector('a[href="#shops"]');
    const shopSection = document.querySelector('#shops');
  
    if (!shopLink || !shopSection) return;
  
    shopSection.classList.add('shop-hidden');
  
    shopLink.addEventListener('click', (e) => {
      e.preventDefault();
  
      shopSection.classList.toggle('shop-open');
      shopSection.classList.toggle('shop-hidden');
      shopLink.classList.toggle('active');
    });
  
    document.addEventListener('click', (e) => {
      if (
        !shopLink.contains(e.target) &&
        !shopSection.contains(e.target)
      ) {
        shopSection.classList.remove('shop-open');
        shopSection.classList.add('shop-hidden');
        shopLink.classList.remove('active');
      }
    });
  }