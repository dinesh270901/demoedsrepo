/**
 * mega-menu – standalone block for nav dropdown content
 * (used on fragment pages like /nav/shop, /nav/support-services)
 *
 * ---------------------------------------------------------------------
 * da.live authoring (table):
 * ---------------------------------------------------------------------
 *
 * Row 1 (block name):   Mega Menu
 *
 * Column rows — 2 cells: Title | a bulleted list of links
 *   | Shopping Tools | • Build & Price
 *                       • Compare Vehicles
 *                       • Electrified
 *                       • Find a Dealer            |
 *
 * ...repeat one row per column (Vehicle Inventory, Financial Tools, etc).
 *
 * CTA row — 3 cells: Heading | Description | Button link
 *   | Build Your Toyota | Customize your Toyota with colors, options
 *     and accessories to suit your lifestyle. | [Build Now] (apply
 *     "Button" style to the link so it gets a `.button`-like class) |
 *
 * Only ONE CTA row is expected, typically last, and it renders as the
 * highlighted card on the right (matching "MY TOYOTA / Build Your
 * Toyota" in the reference design).
 * ---------------------------------------------------------------------
 */

function buildColumn(titleText, listEl) {
    const col = document.createElement('div');
    col.className = 'mega-menu-col';
  
    const heading = document.createElement('p');
    heading.className = 'mega-menu-col-title';
    heading.textContent = titleText;
    col.append(heading);
  
    listEl.className = 'mega-menu-col-list';
    col.append(listEl);
  
    return col;
  }
  
  function buildCta(titleText, descEl, buttonLink) {
    const cta = document.createElement('div');
    cta.className = 'mega-menu-cta';
  
    const heading = document.createElement('p');
    heading.className = 'mega-menu-cta-title';
    heading.textContent = titleText;
    cta.append(heading);
  
    if (descEl) {
      descEl.className = 'mega-menu-cta-desc';
      cta.append(descEl);
    }
  
    if (buttonLink) {
      buttonLink.className = 'mega-menu-cta-btn';
      cta.append(buttonLink);
    }
  
    return cta;
  }
  
  export default function decorate(block) {
    const rows = [...block.children];
    block.textContent = '';
  
    const wrapper = document.createElement('div');
    wrapper.className = 'mega-menu-inner';
  
    rows.forEach((row) => {
      const cells = [...row.children];
  
      // CTA row: 3 cells -> Heading | Description | Button link
      if (cells.length === 3) {
        const [titleCell, descCell, btnCell] = cells;
        const titleText = titleCell.textContent.trim();
        const descEl = descCell.querySelector('p') || descCell;
        const buttonLink = btnCell.querySelector('a');
        if (titleText && buttonLink) {
          wrapper.append(buildCta(titleText, descEl.cloneNode(true), buttonLink));
        }
        return;
      }
  
      // Column row: 2 cells -> Title | list of links
      if (cells.length === 2) {
        const [titleCell, listCell] = cells;
        const titleText = titleCell.textContent.trim();
        const listEl = listCell.querySelector('ul, ol');
        if (titleText && listEl) {
          wrapper.append(buildColumn(titleText, listEl));
        }
      }
    });
  
    block.append(wrapper);
  }