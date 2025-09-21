// Simple catalog data (client-side). You can move this to server later.
const catalog = [
  { id: 'dress1', title: 'Floral Summer Dress', price: 1200, img: 'floral.jpg' },
  { id: 'dress2', title: 'Elegant Evening Gown', price: 3500, img: 'elegant.jpg' },
  { id: 'dress3', title: 'Casual Shirt Dress', price: 900, img: 'casuals.webp' },
  { id: 'dress4', title: 'Denim Midi Dress', price: 1500, img: 'denim.jpg' }
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

async function submitOrder(formData) {
  // client-side basic validation
  const minFields = ['name','phone','address','dressId','size','quantity'];
  for (const f of minFields) {
    if (!formData.get(f)) throw new Error('Please fill all required fields.');
  }

  const resp = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData.entries()))
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error || 'Failed to place order.');
  return data;
}

function showMessage(text, ok = true) {
  const el = $('#message');
  el.style.color = ok ? 'green' : 'crimson';
  el.textContent = text;
  setTimeout(()=>{ el.textContent = ''; }, 5000);
}

async function fetchOrders() {
  const resp = await fetch('/api/orders');
  if (!resp.ok) throw new Error('Unable to fetch orders');
  return resp.json();
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();

  // select button behavior: pick dress in select
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.selectBtn');
    if (!btn) return;
    const id = btn.dataset.id;
    const sel = $('#dressSelect');
    sel.value = id;
    sel.scrollIntoView({behavior:'smooth', block:'center'});
  });

  $('#orderForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    try {
      const result = await submitOrder(fd);
      showMessage('Order placed! Order ID: ' + result.order.id);
      form.reset();
    } catch (err) {
      showMessage(err.message, false);
    }
  });

  $('#viewOrdersBtn').addEventListener('click', async () => {
    try {
      const list = await fetchOrders();
      const wrap = $('#ordersList');
      wrap.innerHTML = '';
      if (!list.length) wrap.innerHTML = '<em>No orders yet.</em>';
      list.slice().reverse().forEach(o => {
        const div = document.createElement('div');
        div.className = 'orderItem';
        div.innerHTML = `
          <div><strong>${o.name}</strong> — ${o.phone} — <small>${new Date(o.createdAt).toLocaleString()}</small></div>
          <div>${o.dressId} | Size: ${o.size} | Qty: ${o.quantity} | Status: ${o.status}</div>
          <div>Address: ${o.address}</div>
          ${o.notes ? `<div>Notes: ${o.notes}</div>` : ''}
        `;
        wrap.appendChild(div);
      });
      $('#ordersListSection').classList.remove('hidden');
    } catch (err) {
      showMessage('Failed to load orders', false);
    }
  });

  $('#closeOrders').addEventListener('click', () => {
    $('#ordersListSection').classList.add('hidden');
  });

});