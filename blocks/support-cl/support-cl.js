export default function decorate(block) {
    const supportLink =
      document.querySelector('a[href="#support"]');
  
    const supportDropdown =
      document.querySelector('#support');
  
    if (!supportLink || !supportDropdown) {
      return;
    }
  
    // hidden initially
    supportDropdown.classList.remove('support-open');
  
    supportLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
  
      supportDropdown.classList.toggle('support-open');
      supportLink.classList.toggle('active');
    });
  
    document.addEventListener('click', (e) => {
      const insideDropdown =
        supportDropdown.contains(e.target);
  
      const clickedSupport =
        supportLink.contains(e.target);
  
      if (!insideDropdown && !clickedSupport) {
        supportDropdown.classList.remove('support-open');
        supportLink.classList.remove('active');
      }
    });
  }