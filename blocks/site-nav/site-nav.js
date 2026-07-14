/**
 * site-nav – primary site header/navigation block
 * Replicates: logo + top-level nav (Vehicles / Shop / Support & Service)
 * with mega-menu dropdowns, plus an Account flyout panel.
 *
 * ---------------------------------------------------------------------
 * da.live authoring (table), one block:
 * ---------------------------------------------------------------------
 *
 * Row 1 (block name):        Site Nav
 *
 * Row 2 (logo):               | Link (https://www.toyota.com) | Alt text (Toyota Logo) | Image |
 *
 * Row 3+ (one row per item):  | Label | Dropdown content |
 *   - Simple link item (e.g. "Vehicles"): put the link on the Label
 *     cell itself (hyperlink the label text). Leave the 2nd cell empty.
 *   - Mega-menu item (e.g. "Shop"): 2nd cell holds one or more columns:
 *       <p><strong>Column Title</strong></p>
 *       <ul><li><a href="...">Link 1</a></li><li><a href="...">Link 2</a></li></ul>
 *     ...repeat for more columns. A trailing CTA card is authored as:
 *       <p><strong>CTA Heading</strong></p>
 *       <p>CTA description text.</p>
 *       <p><a href="..." class="button">Button Label</a></p>
 *     (In da.live, select the link text and apply "Button" styling to
 *     get the `.button` class the script looks for.)
 *
 * Row N (Account row):        | Account | same CTA pattern, then a
 *                                          plain <ul> whose <li> items
 *                                          become collapsible rows
 *                                          (Notifications, My Saves,
 *                                          Settings, etc).
 * ---------------------------------------------------------------------
 */

function isAccountLabel(text) {
    return /^account$/i.test((text || '').trim());
  }
  
  /** Build one link-column (optional title + a <ul> of links). */
  function buildColumn(titleText, listEl) {
    const col = document.createElement('div');
    col.className = 'nav-menu-col';
  
    if (titleText) {
      const heading = document.createElement('p');
      heading.className = 'nav-menu-col-title';
      heading.textContent = titleText;
      col.append(heading);
    }
  
    if (listEl) {
      listEl.className = 'nav-menu-col-list';
      col.append(listEl);
    }
  
    return col;
  }
  
  /** Build the highlighted CTA card (heading + description + button). */
  function buildCta(titleText, descText, buttonEl) {
    const cta = document.createElement('div');
    cta.className = 'nav-menu-cta';
  
    if (titleText) {
      const h = document.createElement('p');
      h.className = 'nav-menu-cta-title';
      h.textContent = titleText;
      cta.append(h);
    }
  
    if (descText) {
      const d = document.createElement('p');
      d.className = 'nav-menu-cta-desc';
      d.textContent = descText;
      cta.append(d);
    }
  
    if (buttonEl) {
      buttonEl.classList.add('nav-menu-cta-btn');
      cta.append(buttonEl);
    }
  
    return cta;
  }
  
  /** Turn a plain <ul> into collapsible account rows (chevron toggle). */
  function buildAccountList(listEl) {
    const wrap = document.createElement('div');
    wrap.className = 'nav-account-list';
  
    [...listEl.children].forEach((li) => {
      const details = document.createElement('details');
      details.className = 'nav-account-row';
  
      const summary = document.createElement('summary');
      summary.className = 'nav-account-row-summary';
  
      const label = document.createElement('span');
      label.className = 'nav-account-row-label';
      label.textContent = li.textContent.trim();
  
      const chevron = document.createElement('span');
      chevron.className = 'nav-account-row-chevron';
      chevron.setAttribute('aria-hidden', 'true');
  
      summary.append(label, chevron);
      details.append(summary);
  
      // Preserve any nested content authored inside the <li> beyond plain text
      const extra = [...li.children].filter((c) => c.tagName !== 'A');
      extra.forEach((c) => details.append(c));
  
      wrap.append(details);
    });
  
    return wrap;
  }
  
  /** Parse a dropdown/account content cell into columns + CTA (+ account list). */
  function parseDropdownContent(cell, { isAccount = false } = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = isAccount ? 'nav-account-panel-inner' : 'nav-menu-panel-inner';
  
    const children = [...cell.children];
    let pendingTitle = null;
    let pendingDesc = null;
  
    children.forEach((el) => {
      if (el.tagName === 'UL' || el.tagName === 'OL') {
        if (isAccount) {
          wrapper.append(buildAccountList(el));
        } else {
          wrapper.append(buildColumn(pendingTitle, el));
        }
        pendingTitle = null;
        pendingDesc = null;
        return;
      }
  
      const button = el.querySelector(':scope > a[class*="button"]');
      if (button) {
        wrapper.append(buildCta(pendingTitle, pendingDesc, button));
        pendingTitle = null;
        pendingDesc = null;
        return;
      }
  
      const strong = el.querySelector(':scope > strong, :scope > b');
      const text = el.textContent.trim();
  
      if (strong && el.children.length === 1) {
        pendingTitle = text;
        pendingDesc = null;
        return;
      }
  
      if (text) pendingDesc = text;
    });
  
    return wrapper;
  }
  
  function closeAll(menu, accountItem) {
    [...menu.children, accountItem].filter(Boolean).forEach((li) => {
      li.classList.remove('is-open');
      li.querySelector(':scope > .nav-item-trigger')?.setAttribute('aria-expanded', 'false');
    });
  }
  
  export default function decorate(block) {
    const rows = [...block.children];
  
    const logoRow = rows.find((r) => r.querySelector('img, picture'));
    const menuRows = rows.filter((r) => r !== logoRow && r.children.length >= 1);
  
    block.textContent = '';
  
    const nav = document.createElement('nav');
    nav.className = 'nav-wrapper';
  
    // --- Brand logo ---
    if (logoRow) {
      const [linkCell, altCell, imgCell] = [...logoRow.children];
      const href = linkCell?.querySelector('a')?.href || linkCell?.textContent.trim() || '/';
      const alt = altCell?.textContent.trim() || 'Logo';
      const media = imgCell?.querySelector('picture, img');
  
      const brand = document.createElement('a');
      brand.className = 'nav-brand';
      brand.href = href;
  
      if (media) {
        const img = media.tagName === 'IMG' ? media : media.querySelector('img');
        if (img) img.alt = alt;
        brand.append(media);
      }
  
      nav.append(brand);
    }
  
    // --- Menu ---
    const menu = document.createElement('ul');
    menu.className = 'nav-menu';
  
    let accountItem = null;
  
    menuRows.forEach((row) => {
      const [labelCell, contentCell] = [...row.children];
      const labelText = labelCell?.textContent.trim();
      if (!labelText) return;
  
      const account = isAccountLabel(labelText);
      const hasDropdown = !!contentCell && contentCell.textContent.trim().length > 0;
  
      const li = document.createElement('li');
      li.className = account ? 'nav-item nav-item-account' : 'nav-item';
  
      const directLink = labelCell.querySelector('a')?.href;
      const trigger = document.createElement(hasDropdown ? 'button' : 'a');
      trigger.className = 'nav-item-trigger';
      trigger.textContent = labelText;
  
      if (account) {
        trigger.classList.add('nav-item-trigger-account');
      }
  
      if (!hasDropdown && directLink) {
        trigger.href = directLink;
      }
  
      if (hasDropdown) {
        trigger.type = 'button';
        trigger.setAttribute('aria-expanded', 'false');
  
        const panel = document.createElement('div');
        panel.className = account ? 'nav-account-panel' : 'nav-menu-panel';
        panel.append(parseDropdownContent(contentCell, { isAccount: account }));
        li.append(trigger, panel);
  
        trigger.addEventListener('click', () => {
          const willOpen = !li.classList.contains('is-open');
          closeAll(menu, accountItem);
          if (willOpen) {
            li.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      } else {
        li.append(trigger);
      }
  
      if (account) {
        accountItem = li;
      } else {
        menu.append(li);
      }
    });
  
    nav.append(menu);
    if (accountItem) nav.append(accountItem);
  
    block.append(nav);
  
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) closeAll(menu, accountItem);
    });
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAll(menu, accountItem);
    });
  }