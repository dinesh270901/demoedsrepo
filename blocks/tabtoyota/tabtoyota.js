import { toClassName } from '../../scripts/aem.js';

/**
 * Authoring structure (table block named "Tabtoyota"):
 *
 * | Tabtoyota             |            |
 * | --------------------- | ---------- |
 * | Our Mission           |            |   <- row 1: tab label (2nd cell optional flag e.g. "highlight")
 * | <rich text content>   |            |   <- row 2: tab panel content
 * | Getting Started       |            |
 * | <rich text content>   |            |
 * | FAQ                   | highlight  |
 * | <rich text content>   |            |
 *
 * Rows come in label/content pairs.
 */
export default function decorate(block) {
  const rows = [...block.children];

  const tablist = document.createElement('div');
  tablist.className = 'tabtoyota-list';
  tablist.setAttribute('role', 'tablist');

  const panelsWrapper = document.createElement('div');
  panelsWrapper.className = 'tabtoyota-panels';

  for (let i = 0; i < rows.length; i += 2) {
    const labelRow = rows[i];
    const contentRow = rows[i + 1];
    if (!labelRow || !contentRow) break;

    const labelCell = labelRow.children[0];
    const flagCell = labelRow.children[1];
    const isHighlighted = flagCell && flagCell.textContent.trim().toLowerCase() === 'highlight';
    const labelText = labelCell.textContent.trim();
    const id = toClassName(labelText);
    const isFirst = i === 0;

    // tab button
    const button = document.createElement('button');
    button.className = 'tabtoyota-tab';
    if (isHighlighted) button.classList.add('tabtoyota-tab-highlight');
    button.id = `tab-${id}`;
    button.textContent = labelText;
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', isFirst);
    tablist.append(button);

    // tab panel (reuse the content row as the panel)
    const panel = contentRow;
    panel.className = 'tabtoyota-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.setAttribute('aria-hidden', !isFirst);
    panelsWrapper.append(panel);

    button.addEventListener('click', () => {
      tablist.querySelectorAll('.tabtoyota-tab').forEach((btn) => {
        btn.setAttribute('aria-selected', 'false');
      });
      panelsWrapper.querySelectorAll('.tabtoyota-panel').forEach((p) => {
        p.setAttribute('aria-hidden', 'true');
      });
      button.setAttribute('aria-selected', 'true');
      panel.setAttribute('aria-hidden', 'false');
    });

    labelRow.remove();
  }

  block.textContent = '';
  block.append(tablist, panelsWrapper);
}