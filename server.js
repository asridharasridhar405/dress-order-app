const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const ORDERS_FILE = path.join(__dirname, 'orders.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper: read orders
async function readOrders() {
  try {
    const txt = await fs.readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (err) {
    // If file missing or invalid, return empty array
    return [];
  }
}

// Helper: write orders
async function writeOrders(orders) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

// API: create order
app.post('/api/orders', async (req, res) => {
  try {
    const { name, phone, address, dressId, size, quantity, notes } = req.body;

    // Basic server-side validation
    if (!name || !phone || !address || !dressId || !size || !quantity) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const orders = await readOrders();
    const newOrder = {
      id: Date.now().toString(),
      name: String(name),
      phone: String(phone),
      address: String(address),
      dressId: String(dressId),
      size: String(size),
      quantity: Number(quantity),
      notes: notes ? String(notes) : '',
      createdAt: new Date().toISOString(),
      status: 'received'
    };

    orders.push(newOrder);
    await writeOrders(orders);

    return res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error('Order save error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// API: list orders (simple admin)
app.get('/api/orders', async (req, res) => {
  const orders = await readOrders();
  return res.json(orders);
});

// Fallback to index.html for client routing (if needed)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});