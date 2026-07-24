export default function decorate(block) {
    [...block.children].forEach((card) => {
      const cols = [...card.children];
   
      if (cols.length < 3) return;
   
      /* ---------------- Image ---------------- */
   
      cols[0].classList.add('card-image');
   
      const picture = cols[0].querySelector('picture');
   
      if (picture) {
        const infoBtn = document.createElement('button');
        infoBtn.className = 'info-button';
        infoBtn.textContent = 'Info';
   
        cols[0].append(infoBtn);
      }
   
      /* ---------------- Content ---------------- */
   
      cols[1].classList.add('card-content');
   
      /* ---------------- Price ---------------- */
   
      cols[2].classList.add('card-price');
   
      const p = cols[2].querySelector('p');
   
      if (p) {
        p.innerHTML = p.innerHTML.replace(
          /(\$\d+)/,
          '<span class="price">$1</span>',
        );
      }
    });
  }