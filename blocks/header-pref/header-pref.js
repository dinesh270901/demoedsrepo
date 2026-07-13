export default function decorate(block) {
    const rows = [...block.children];
    const [logoRow, textRow] = rows;
  
    if (logoRow) {
      const logoCells = [...logoRow.children];
      logoCells.forEach((cell, i) => {
        cell.classList.add(i === 0 ? 'toyota-logo' : 'lexus-logo');
  
        // ensure alt text is set for accessibility
        const img = cell.querySelector('img');
        if (img && !img.alt) {
          img.alt = i === 0 ? 'Toyota' : 'Lexus';
        }
      });
    }
  
    if (textRow) {
      textRow.classList.add('header-pref-caption');
    }
  }