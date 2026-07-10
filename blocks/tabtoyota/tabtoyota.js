import { toClassName } from '../../scripts/aem.js';

/**
 * Authoring structure (matches the screenshot table named "tabtoyota"):
 *
 * | tabtoyota                                    |
 * | -------------- | --------------------------- |
 * | our mission    | <content for this tab>      |
 * | getting started| <content for this tab>      |
 * | FAQ            | <content for this tab>      |
 *
 * Each row = ONE tab: 1st cell = label, 2nd cell = panel content.
 * (Add the word "highlight" at the end of the label cell text to render
 *  that tab in the accent/red color, e.g. "FAQ highlight".)
 */
export default function decorate(block) {
  const rows = [...block.children];

  const tablist = document.createElement('div');
  tablist.className = 'tab-toyota-list';
  tablist.setAttribute('role', 'tablist');

  const panelsWrapper = document.createElement('div');
  panelsWrapper.className = 'tab-toyota-panels';

  rows.forEach((row, i) => {
    const labelCell = row.children[0];
    const contentCell = row.children[1];
    if (!labelCell || !contentCell) return;

    let labelText = labelCell.textContent.trim();
    const isHighlighted = /highlight$/i.test(labelText);
    if (isHighlighted) labelText = labelText.replace(/highlight$/i, '').trim();

    const id = toClassName(labelText);
    const isFirst = i === 0;

    // tab button
    const button = document.createElement('button');
    button.className = 'tab-toyota-tab';
    if (isHighlighted) button.classList.add('tab-toyota-tab-highlight');
    button.id = `tab-${id}`;
    button.textContent = labelText;
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', isFirst);
    tablist.append(button);

    // tab panel
    const panel = document.createElement('div');
    panel.className = 'tab-toyota-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.setAttribute('aria-hidden', !isFirst);
    panel.append(...contentCell.childNodes);
    panelsWrapper.append(panel);

    button.addEventListener('click', () => {
      tablist.querySelectorAll('.tab-toyota-tab').forEach((btn) => {
        btn.setAttribute('aria-selected', 'false');
      });
      panelsWrapper.querySelectorAll('.tab-toyota-panel').forEach((p) => {
        p.setAttribute('aria-hidden', 'true');
      });
      button.setAttribute('aria-selected', 'true');
      panel.setAttribute('aria-hidden', 'false');
    });
  });

  block.textContent = '';
  block.append(tablist, panelsWrapper);
}