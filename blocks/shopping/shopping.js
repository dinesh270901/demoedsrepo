export default async function decorate(block) {
    const shopSection = document.getElementById('shops');
  
    if (!shopSection) return;
  
    shopSection.classList.remove('shop-open');
  
    const shopLink = [...document.querySelectorAll('a')]
      .find((link) => link.textContent.trim() === 'Shop');
  
    if (!shopLink) {
      console.log('Shop link not found');
      return;
    }
  
    shopLink.addEventListener('click', (e) => {
      e.preventDefault();
  
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