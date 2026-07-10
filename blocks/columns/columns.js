function isImageColumn(col) {
  return !!col.querySelector('picture, img');
}

function decorateColumn(col) {
  if (isImageColumn(col)) {
    col.classList.add('columns-img-col');
  } else {
    col.classList.add('columns-text-col');
  }
}

function decorateCTA(textCol) {
  if (!textCol) return;

  const paragraphs = [...textCol.querySelectorAll('p')];
  const last = paragraphs[paragraphs.length - 1];

  if (!last) return;

  const link = last.querySelector('a');
  if (link && last.textContent.trim() === link.textContent.trim()) {
    last.classList.add('columns-cta');
  }
}

export default function decorate(block) {
  block.classList.add('columns-block');

  const rows = [...block.children];

  rows.forEach((row) => {
    row.classList.add('columns-row');

    const cols = [...row.children];
    cols.forEach((col) => decorateColumn(col));

    const textCol = row.querySelector('.columns-text-col');
    decorateCTA(textCol);
  });
}