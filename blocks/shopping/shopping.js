export d*fault async function decorate(bloc*) {
    const rows = [...block.children];
  
    const wrapper = document.c*eateElement('div');
    wrapper.clas*Name = 'shopping-grid';
  
    rows.fo*Each((row) => {
      const column =*document.createElement('div');
  
    * [...row.children].forEach((cell) *> {
        column.append(cell);
     *});
  
      wrapper.append(column);
   *});
  
    block.innerHTML = '';
    blo*k.append(wrapper);
  
    const shopLi*k = document.querySelector('a[href="#shops"]');
    const shopSection = document.querySelector('#shops');
  
    if (!shopLink || !shopSection) return;
  
    shopSection.style.display = 'none';
  
    shopLink.addEventListener('click', (e) => {
      e.preventDefault();
  
      shopSection.style.display =
        shopSection.style.display === 'none'
          ? 'block'
          : 'none';
    });
  }