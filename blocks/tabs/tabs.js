/*
 * Tabs block — jump-link bar (NOT panel-switching)
 * Authored as a table, one link per row, no content column:
 *
 * | tabs                                 |
 * | [Our Mission](#our-mission)          |
 * | [Getting Started](#getting-started)  |
 * | [FAQ](#faq)                          |
 *
 * Each link's href must match an id on another section of the page
 * (e.g. from an Anchor block, or an auto-id'd heading). Clicking uses the
 * browser's native anchor jump — no content switching happens here.
 * This script only builds the nav bar and adds scroll-spy: highlighting
 * whichever link's target section is currently in view.
 */

export default function decorate(block) {
  const rows = [...block.children];

  const nav = document.createElement('div');
  nav.classList.add('tabs-nav');
  nav.setAttribute('role', 'tablist');

  const links = [];

  rows.forEach((row) => {
    // find the authored link no matter how deeply it's wrapped
    // (da.live typically wraps it in a <div><p><a>...)
    const link = row.querySelector('a');
    if (!link) return;

    link.classList.add('tabs-link');
    link.setAttribute('role', 'tab');
    link.setAttribute('aria-selected', 'false');
    nav.appendChild(link);
    links.push(link);
  });

  block.textContent = '';
  block.appendChild(nav);

  if (!links.length || !('IntersectionObserver' in window)) return;

  const targets = links
    .map((link) => {
      const id = link.getAttribute('href')?.replace('#', '');
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  if (!targets.length) return;

  const setActive = (id) => {
    links.forEach((l) => {
      const isActive = l.getAttribute('href') === `#${id}`;
      l.setAttribute('aria-selected', String(isActive));
    });
  };

  // highlight the first section's link by default on page load
  setActive(targets[0].id);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  targets.forEach((t) => observer.observe(t));
}