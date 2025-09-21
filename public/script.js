// ✅ Corrected catalog with img property + <img> tag
const catalog = [
  { id: 'dress1', title: 'Floral Summer Dress', price: 1200, img: 'img/floral.jpg' },
  { id: 'dress2', title: 'Elegant Evening Gown', price: 3500, img: 'img/elegant.jpg' },
  { id: 'dress3', title: 'Casual Shirt Dress', price: 900, img: 'img/casuals.jpg' },
  { id: 'dress4', title: 'Denim Midi Dress', price: 1500, img: 'img/denim.jpg' }
];

function $(sel) { return document.querySelector(sel); }

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
      <div><button data-id="${item.id}" class="selectBtn">Select</button></div>
    `;
    container.appendChild(card);

    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = `${item.title} — ₹${item.price}`;
    select.appendChild(opt);
  });
}

async function submitOrder(fd) {
  const resp = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(fd.entries()))
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error || 'Order failed');
  return data;
}

function showMessage(msg, ok = true) {
  const el = $('#message');
  el.style.color = ok ? 'green' : 'red';
  el.textContent = msg;
}

async function fetchOrders() {
  const resp = await fetch('/api/orders');
  return resp.json();
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();

  document.addEventListener('click', e => {
    const btn = e.target.closest('.selectBtn');
    if (!btn) return;
    $('#dressSelect').value = btn.dataset.id;
  });

  $('#orderForm').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const result = await submitOrder(fd);
      showMessage('Order placed! ID: ' + result.order.id);
      e.currentTarget.reset();
    } catch (err) {
      showMessage(err.message, false);
    }
  });

  $('#viewOrdersBtn').addEventListener('click', async () => {
    const orders = await fetchOrders();
    const wrap = $('#ordersList');
    wrap.innerHTML = '';
    orders.slice().reverse().forEach(o => {
      const div = document.createElement('div');
      div.className = 'orderItem';
      div.innerHTML = `
        <div><strong>${o.name}</strong> — ${o.phone} — <small>${new Date(o.createdAt).toLocaleString()}</small></div>
        <div>${o.dressId} | Size: ${o.size} | Qty: ${o.quantity}</div>
        <div>Address: ${o.address}</div>
      `;
      wrap.appendChild(div);
    });
    $('#ordersListSection').classList.remove('hidden');
  });

  $('#closeOrders').addEventListener('click', () => {
    $('#ordersListSection').classList.add('hidden');
  });
});