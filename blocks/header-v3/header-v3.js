/**
 * Header block – recreates the Toyota/Lexus dual-brand header
 * seen at toyota.com/preferences
 *
 * Actual da.live authoring (simple, matches how content authors work):
 *
 *  -----------------------------------------------------------
 *  | header-pref                                              |
 *  -----------------------------------------------------------
 *  | [Toyota logo image, hyperlinked to toyota.com]           |
 *  | [Lexus logo image, hyperlinked to lexus.com]             |
 *  -----------------------------------------------------------
 *  | My Toyota & Lexus Communications Profile                 |
 *  -----------------------------------------------------------
 *
 * Rules:
 *  - Any row containing image(s) is treated as a "logo row" — each
 *    image (optionally wrapped in a link by the author) becomes one
 *    brand logo. Images can be in the same cell/row or split into
 *    separate cells; both work.
 *  - Brand class (toyota-logo / lexus-logo) is inferred from the
 *    image src or alt text. Falls back to authoring order
 *    (1st image = toyota-logo, 2nd = lexus-logo) if brand can't
 *    be detected.
 *  - If the author didn't wrap an image in a link, a sensible
 *    default href is used based on the detected brand.
 *  - A row with only text (no image) is treated as the title.
 */

const DEFAULT_HREFS = {
    'toyota-logo': 'https://www.toyota.com',
    'lexus-logo': 'https://www.lexus.com',
  };
  
  function detectBrandClass(src = '', alt = '', fallbackIndex = 0) {
    const haystack = `${src} ${alt}`.toLowerCase();
    if (haystack.includes('lexus')) return 'lexus-logo';
    if (haystack.includes('toyota')) return 'toyota-logo';
    return fallbackIndex === 0 ? 'toyota-logo' : 'lexus-logo';
  }
  
  export default function decorate(block) {
    const rows = [...block.children];
    let titleText = 'My Toyota & Lexus Communications Profile';
    const imageEls = [];
  
    rows.forEach((row) => {
      const cells = [...row.children];
  
      // Only count top-level media: a <picture> wrapper, OR a bare <img>
      // that is NOT already nested inside a <picture>. This avoids matching
      // the same logo twice (once as <picture>, once as its inner <img>),
      // which previously corrupted brand detection/ordering.
      const rowImages = [...row.querySelectorAll('picture, img')].filter((el) => {
        if (el.tagName === 'IMG') return !el.closest('picture');
        return true;
      });
  
      if (rowImages.length === 0) {
        // No image in this row -> treat as title text
        const text = cells.map((c) => c.textContent.trim()).join(' ').trim();
        if (text) titleText = text;
        return;
      }
  
      rowImages.forEach((el) => imageEls.push(el));
    });
  
    block.textContent = '';
  
    // --- header-wrap row ---
    const headerWrap = document.createElement('div');
    headerWrap.className = 'header-wrap row';
  
    // --- col: logo-wrap ---
    const col = document.createElement('div');
    col.className = 'col';
  
    const logoWrap = document.createElement('div');
    logoWrap.className = 'logo-wrap';
    logoWrap.setAttribute('role', 'img');
    logoWrap.setAttribute('aria-label', 'Brand Logo');
  
    imageEls.forEach((el, index) => {
      const picture = el.tagName === 'PICTURE' ? el : null;
      const img = picture ? picture.querySelector('img') : el;
      if (!img) return;
  
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      const brandClass = detectBrandClass(src, alt, index);
  
      // Reuse an existing author-added link if present, otherwise fall back
      const existingLink = el.closest('a');
      const href = existingLink?.getAttribute('href') || DEFAULT_HREFS[brandClass];
  
      const a = document.createElement('a');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = brandClass;
  
      // Move the actual picture/img node (keeps optimized <picture> sources intact)
      a.append(picture || img);
      logoWrap.append(a);
    });
  
    col.append(logoWrap);
    headerWrap.append(col);
  
    // --- header-cnt col: title ---
    const headerCnt = document.createElement('div');
    headerCnt.className = 'header-cnt col';
  
    const title = document.createElement('p');
    title.className = 'header-title';
    title.textContent = titleText;
  
    headerCnt.append(title);
    headerWrap.append(headerCnt);
  
    block.append(headerWrap);
  }