/*
 * Shop block — renders as a mega-menu dropdown, opened by clicking
 * the "Shop" link in the site header nav, and closed on outside
 * click, Escape, or clicking "Shop" again.
 */

function findShopNavLink(block) {
    const candidates = document.querySelectorAll('header a, nav a');
    return [...candidates].find(
      (a) => a.textContent.trim().toLowerCase() === 'shop' && !block.contains(a),
    );
  }
  
  function positionDropdown(block) {
    const header = document.querySelector('header') || document.querySelector('.header');
    const bottom = header ? header.getBoundingClientRect().bottom : 0;
    block.style.top = `${Math.max(bottom, 0)}px`;
  }
  
  function closeDropdown(block, trigger) {
    block.classList.remove('shop-open');
    trigger?.setAttribute('aria-expanded', 'false');
  }
  
  function openDropdown(block, trigger) {
    positionDropdown(block);
    block.classList.add('shop-open');
    trigger?.setAttribute('aria-expanded', 'true');
  }
  
  function wireDropdown(block, trigger) {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');
  
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = block.classList.contains('shop-open');
      if (isOpen) {
        closeDropdown(block, trigger);
      } else {
        openDropdown(block, trigger);
      }
    });
  
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!block.classList.contains('shop-open')) return;
      if (block.contains(e.target) || trigger.contains(e.target)) return;
      closeDropdown(block, trigger);
    });
  
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && block.classList.contains('shop-open')) {
        closeDropdown(block, trigger);
        trigger.focus();
      }
    });
  
    // Reposition if the header height changes (e.g. sticky/scroll states)
    window.addEventListener('resize', () => {
      if (block.classList.contains('shop-open')) positionDropdown(block);
    });
  }
  
  function attachTrigger(block, attempt = 0) {
    const trigger = findShopNavLink(block);
    if (trigger) {
      wireDropdown(block, trigger);
      return;
    }
    // Header may still be loading (async block) — retry briefly.
    if (attempt < 20) {
      setTimeout(() => attachTrigger(block, attempt + 1), 150);
    }
  }
  
  export default function decorate(block) {
    block.classList.add('shop-dropdown');
  
    [...block.children].forEach((row) => {
      row.classList.add('shop-column');
  
      const cell = row.firstElementChild;
      if (!cell) return;
  
      const titleEl = cell.querySelector('h1, h2, h3, h4, h5, h6, p');
      if (titleEl) {
        const heading = document.createElement('p');
        heading.className = 'shop-column-title';
        heading.innerHTML = titleEl.innerHTML;
        titleEl.replaceWith(heading);
      }
  
      const list = cell.querySelector('ul, ol');
  
      if (list) {
        row.classList.add('shop-column-links');
        list.classList.add('shop-links');
      } else {
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
  
        cell.querySelectorAll('strong').forEach((strong) => {
          const h3 = document.createElement('h3');
          h3.className = 'shop-promo-heading';
          h3.innerHTML = strong.innerHTML;
          strong.closest('p')?.replaceWith(h3);
        });
      }
    });
  
    attachTrigger(block);
  }