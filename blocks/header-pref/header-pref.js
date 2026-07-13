/**
 * Header block – recreates the Toyota/Lexus dual-brand header
 * seen at toyota.com/preferences
 *
 * Expected authoring (table in Google Doc / Word, each row = one brand link):
 * | Link                        | Alt text     | Image                          | Class       |
 * |------------------------------|--------------|---------------------------------|-------------|
 * | https://www.toyota.com       | Toyota Logo  | /content/dam/.../toyota-logo.svg | toyota-logo |
 * | https://www.lexus.com        | Lexus Logo   | /content/dam/.../lexus-logo.jpg  | lexus-logo  |
 *
 * A trailing row (optional) with just a heading text becomes the title.
 */
export default function decorate(block) {
    const rows = [...block.children];
    const brandRows = [];
    let titleText = 'My Toyota & Lexus Communications Profile';
  
    rows.forEach((row) => {
      const cells = [...row.children];
      // A single-cell row is treated as the header title
      if (cells.length === 1) {
        titleText = cells[0].textContent.trim() || titleText;
        return;
      }
      brandRows.push(cells);
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
  
    brandRows.forEach((cells) => {
      const [linkCell, altCell, imgCell, classCell] = cells;
  
      const href = linkCell?.querySelector('a')?.href || linkCell?.textContent.trim();
      const alt = altCell?.textContent.trim() || '';
      const imgEl = imgCell?.querySelector('img');
      const src = imgEl?.getAttribute('src') || imgCell?.textContent.trim();
      const brandClass = classCell?.textContent.trim() || '';
  
      if (!href || !src) return;
  
      const a = document.createElement('a');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      if (brandClass) a.className = brandClass;
  
      const logoImg = document.createElement('img');
      logoImg.src = src;
      logoImg.alt = alt;
      logoImg.loading = 'eager';
      logoImg.decoding = 'async';
  
      a.append(logoImg);
      logoWrap.append(a);
    });
  
    col.append(logoWrap);
    headerWrap.append(col);
  
    // --- header-cnt col: title ---
    const headerCnt = document.createElement('div');
    headerCnt.className = 'header-cnt col';
  
    const title = document.createElement('h1');
    title.className = 'header-title';
    title.textContent = titleText;
  
    headerCnt.append(title);
    headerWrap.append(headerCnt);
  
    block.append(headerWrap);
  }