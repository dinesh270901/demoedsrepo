export default function decorate(block) {
    // Actual structure: one div (e.g. .toyota-logo) containing two <p> tags —
    // first <p> is the Toyota logo, second <p> is the Lexus logo (picture/img)
    const logoWrap = block.querySelector('.toyota-logo');
  
    if (logoWrap) {
      const logoParas = [...logoWrap.querySelectorAll(':scope > p')];
  
      logoParas.forEach((p, i) => {
        p.classList.add(i === 0 ? 'toyota-logo-item' : 'lexus-logo-item');
  
        const img = p.querySelector('img');
        if (img && !img.alt) {
          img.alt = i === 0 ? 'Toyota' : 'Lexus';
        }
      });
    }
  
    // If the caption text lives inside this block as its own row/paragraph,
    // tag it so header-pref.css can target it directly
    const caption = block.querySelector('p:not(.toyota-logo-item):not(.lexus-logo-item)');
    if (caption) {
      caption.classList.add('header-pref-title');
    }
  }