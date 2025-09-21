// Simple catalog data (client-side). You can move this to server later.
const catalog = [
  { id: 'dress1', title: 'Floral Summer Dress', price: 1200, img: "img/floral.jpg" },
  { id: 'dress2', title: 'Elegant Evening Gown', price: 3500, img: "img/elegant.jpg" },
  { id: 'dress3', title: 'Casual Shirt Dress', price: 900, img: "img/casuals.jpg" },
  { id: 'dress4', title: 'Denim Midi Dress', price: 1500, img: "img/denim.jpg" }
];

function $(sel) { return document.querySelector(sel); }
function $all(sel) { return document.querySelectorAll(sel); }

function renderCatalog() {
  const container = $('#items');
  const select = $('#dressSelect');
  container.innerHTML = '';
  select.innerHTML = '';
  catalog.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.img}" alt="${item.title}" />
      <div class="title">${item.title}</div>
      <div class="price">₹ ${item.price.toLocaleString()}</div>
      <div style="display:flex;gap:8px;margin-top:6px">
        <button data-id="${item.id}" class="selectBtn">Select</button>
      </div>
    `;
    container.appendChild(card);

    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = `${item.title} — ₹${item.price}`;
    select.appendChild(opt);
  });
}