/*
 * Shop block — renders as a mega-menu dropdown anchored to the
 * header, opened by clicking the "Shop" link in the site nav.
 *
 * Approach: rather than calculating pixel offsets (fragile on
 * scroll/resize), the block is reparented into the header itself
 * and positioned with `position: absolute; top: 100%` relative to
 * it — so it always sits flush below the nav, however tall the
 * header is, and moves naturally with it (including sticky headers).
 */

function findShopNavLink(block) {
    const candidates = document.querySelectorAll('header a, nav a');
    return [...candidates].find(
      (a) => a.textContent.trim().toLowerCase() === 'shop' && !block.contains(a),
    );
  }
  
  function closeDropdown(block, trigger) {
    block.classList.remove('shop-open');
    trigger?.setAttribute('aria-expanded', 'false');
  }
  
  function openDropdown(block, trigger) {
    block.classList.add('shop-open');
    trigger?.setAttribute('aria-expanded', 'true');
  }
  
  function moveIntoHeader(block, trigger) {
    const header = trigger.closest('header') || document.querySelector('header');
    if (!header) return null;
  
    // Header needs a positioning context for the dropdown's
    // `position: absolute; top: 100%` to anchor correctly.
    if (getComputedStyle(header).position === 'static') {
      header.style.position = 'relative';
    }
  
    const originalWrapper = block.parentElement;
    header.append(block);
  
    // Avoid leaving a blank gap where the block used to live.
    if (originalWrapper && !originalWrapper.children.length) {
      originalWrapper.remove();
    } else if (originalWrapper && originalWrapper !== header) {
      originalWrapper.style.display = 'none';
    }
  
    return header;
  }
  
  function wireDropdown(block, trigger) {
    moveIntoHeader(block, trigger);
  
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
  
    // Wrap the columns so the outer block can be a full-bleed panel
    // while the inner grid stays centered/padded like the rest of the site.
    const content = document.createElement('div');
    content.className = 'shop-content';
    content.append(...block.children);
    block.append(content);
  
    [...content.children].forEach((row) => {
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