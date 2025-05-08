let ALLOW_MULTIPLE_SELECTION = false;
let CONFIG = {
  size: "small",
  position: "right",
  multiple: false,
  maxWidth: null,
  maxHeight: null,
  backgroundImage: "paper.webp",
  fontStyle: "Caveat"
};
let options = [];
const selected = new Set();
let isVisible = false;
function applyConfig() {
  document.body.classList.remove('size-small', 'size-medium', 'size-large');
  document.body.classList.add(`size-${CONFIG.size}`);
  document.body.classList.remove('position-left', 'position-right', 'position-center');
  document.body.classList.add(`position-${CONFIG.position}`);
  document.body.classList.remove('font-Caveat', 'font-Rye', 'font-Fondamento');
  document.body.classList.add(`font-${CONFIG.fontStyle}`);
  const paper = document.getElementById('paper');
  if (CONFIG.maxWidth) {
    paper.style.maxWidth = `${CONFIG.maxWidth}px`;
  } else {
    paper.style.maxWidth = '';
  }
  if (CONFIG.maxHeight) {
    paper.style.maxHeight = `${CONFIG.maxHeight}px`;
    paper.style.overflowY = 'auto';
  } else {
    paper.style.maxHeight = '';
    paper.style.overflowY = '';
  }
  paper.style.backgroundImage = `url('./assets/${CONFIG.backgroundImage}')`;
  ALLOW_MULTIPLE_SELECTION = CONFIG.multiple;
}
function getInputTemplate(opt) {
  switch(opt.inputType) {
    case 'text':
      return `
        <input type="text"
          class="input-text"
          value="${opt.value || ''}"
          placeholder="${opt.placeholder || ''}"
          ${opt.maxLength ? `maxlength="${opt.maxLength}"` : ''}
          onchange="updateValue(${opt.id}, this.value)"
        >`;
    case 'number':
      return `
        <input type="number"
          class="input-number"
          value="${opt.value || ''}"
          min="${opt.min || '0'}"
          max="${opt.max || '100'}"
          step="${opt.step || '1'}"
          onchange="updateValue(${opt.id}, this.value)"
        >`;
    case 'range':
      return `
        <div class="range-container">
          <input type="range"
            class="input-range"
            value="${opt.value || '0'}"
            min="${opt.min || '0'}"
            max="${opt.max || '100'}"
            step="${opt.step || '1'}"
            oninput="updateValue(${opt.id}, this.value); this.nextElementSibling.textContent = this.value;"
          >
          <span class="range-value">${opt.value || '0'}</span>
        </div>`;
    case 'select':
      return `
        <select class="input-select" onchange="updateValue(${opt.id}, this.value)">
          ${opt.options.map(o => `
            <option value="${o.value}" ${o.value === opt.value ? 'selected' : ''}>
              ${o.label}
            </option>
          `).join('')}
        </select>`;
    case 'radio':
      return `
        <div class="radio-group">
          ${opt.options.map(o => `
            <label class="radio-label">
              <input type="radio"
                name="radio_${opt.id}"
                value="${o.value}"
                ${o.value === opt.value ? 'checked' : ''}
                onchange="updateValue(${opt.id}, this.value)"
              >
              <span class="radio-custom"></span>
              ${o.label}
            </label>
          `).join('')}
        </div>`;
    default:
      return '';
  }
}
function updateValue(id, value) {
  const option = options.find(opt => opt.id === id);
  if (option) {
    option.value = value;
  }
}
function renderOptions() {
  const container = document.getElementById('menu-options');
  container.innerHTML = '';
  options.forEach(opt => {
    const el = document.createElement('div');
    el.className = 'option';
    if (opt.inputType) {
      el.innerHTML = `
        <div class="option-content">
          <p class="option-title">${opt.title}</p>
          <p class="option-desc">${opt.description || ''}</p>
          ${getInputTemplate(opt)}
        </div>
      `;
    } else {
      el.innerHTML = `
        <div class="checkbox" data-id="${opt.id}">
          <div class="checkmark">✓</div>
        </div>
        <div class="option-content">
          <p class="option-title">${opt.title}</p>
          <p class="option-desc">${opt.description || ''}</p>
        </div>
        <div class="option-image">
          ${opt.image ? `<img src="${opt.image}" alt="${opt.title}"/>` : ''}
        </div>
      `;
      el.onclick = () => toggleOption(opt.id, el);
    }
    container.appendChild(el);
  });
}
function toggleOption(id, el) {
  const checkbox = el.querySelector('.checkbox');
  const checkmark = checkbox.querySelector('.checkmark');
  if (!ALLOW_MULTIPLE_SELECTION) {
    document.querySelectorAll('.checkbox .checkmark').forEach(c => {
      c.style.display = 'none';
    });
    selected.clear();
    checkmark.style.display = 'block';
    checkmark.style.animation = 'drawCheck 0.3s ease';
    selected.add(id);
    return;
  }
  if (selected.has(id)) {
    checkmark.style.display = 'none';
    selected.delete(id);
  } else {
    checkmark.style.display = 'block';
    checkmark.style.animation = 'drawCheck 0.3s ease';
    selected.add(id);
  }
}
function send() {
  const result = {
    cancelled: false,
    value: Array.from(selected),
    inputs: options
      .filter(opt => opt.inputType)
      .reduce((acc, opt) => ({
        ...acc,
        [opt.id]: opt.value
      }), {})
  };
  fetch(`https://${GetParentResourceName()}/menuResult`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(result)
  })
  .then(() => {
    hideMenu();
  })
  .catch((error) => {
    console.error('Failed to send menu result:', error);
  });
}
function cancel() {
  selected.clear();
  document.querySelectorAll('.checkbox .checkmark').forEach(c => {
    c.style.display = 'none';
  });
  fetch(`https://${GetParentResourceName()}/menuResult`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ cancelled: true })
  }).then(() => {
    hideMenu();
  });
}
function showMenu() {
  document.body.style.display = 'flex';
  isVisible = true;
}
function hideMenu() {
  document.body.style.display = 'none';
  isVisible = false;
}
window.addEventListener('message', function(event) {
  const data = event.data;
  if (data.type === 'openMenu') {
    console.log(JSON.stringify(data))
    if (data.defaults) {
      CONFIG = {
        ...CONFIG,
        ...data.defaults
      };
    }
      console.log('CONFIG', JSON.stringify(CONFIG))
    if (data.menu) {
      if (Array.isArray(data.menu)) {
        options = data.menu;
      } else {
        options = Object.entries(data.menu).map(([id, item]) => ({
          id,
          title: item.title || item.label || item.name || "Option",
          description: item.description || item.desc || "",
          image: item.image || item.img || item.icon || "",
          inputType: item.inputType || null,
          value: item.value || null,
          placeholder: item.placeholder || null,
          maxLength: item.maxLength || null,
          min: item.min || null,
          max: item.max || null,
          step: item.step || null,
          options: item.options || []
        }));
      }
    }
    applyConfig();
    renderOptions();
    selected.clear();
    showMenu();
  } else if (data.type === 'closeMenu') {
    hideMenu();
  }
});
document.addEventListener('DOMContentLoaded', function() {
  hideMenu();
  document.addEventListener('keyup', function(e) {
    if (e.key === 'Escape' && isVisible) {
      cancel();
    }
  });
  const style = document.createElement('style');
  style.textContent = `
    @keyframes flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  document.head.appendChild(style);
});
