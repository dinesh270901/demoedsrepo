/*
 * Shop block
 * Renders N columns. Each column is one table row in the doc/sheet.
 * A column is treated as a "links" column if it contains a list (ul/ol).
 * Otherwise it's treated as a "promo" column (heading + copy + button),
 * matching the Toyota "MY TOYOTA / Build Your Toyota" style card.
 */

export default function decorate(block) {
    [...block.children].forEach((row) => {
      row.classList.add('shop-column');
  
      const cell = row.firstElementChild;
      if (!cell) return;
  
      // First heading/paragraph in the cell becomes the column title
      // (e.g. "SHOPPING TOOLS", "MY TOYOTA")
      const titleEl = cell.querySelector('h1, h2, h3, h4, h5, h6, p');
      if (titleEl) {
        const heading = document.createElement('p');
        heading.className = 'shop-column-title';
        heading.innerHTML = titleEl.innerHTML;
        titleEl.replaceWith(heading);
      }
  
      const list = cell.querySelector('ul, ol');
  
      if (list) {
        // Links column
        row.classList.add('shop-column-links');
        list.classList.add('shop-links');
      } else {
        // Promo column: style remaining links as buttons
        row.classList.add('shop-column-promo');
  
        cell.querySelectorAll('a').forEach((a) => {
          a.classList.add('button');
          if (!a.closest('.button-container')) {
            const wrapper = document.createElement('p');
            wrapper.className = 'button-container';
            a.replaceWith(wrapper);
            wrapper.append(a);
          }
        });
  
        // Any bold text left in the promo cell becomes the big headline
        cell.querySelectorAll('strong').forEach((strong) => {
          const h3 = document.createElement('h3');
          h3.className = 'shop-promo-heading';
          h3.innerHTML = strong.innerHTML;
          strong.closest('p')?.replaceWith(h3);
        });
      }
    });
  }