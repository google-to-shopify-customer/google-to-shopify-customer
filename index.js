const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ENV vars from Render
const SHOP_DOMAIN = process.env.SHOP_DOMAIN;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

// Root test route
app.get('/', (req, res) => {
  res.send("✅ Google → Shopify customer backend is live!");
});

// Customer creation route
app.post('/create-customer', async (req, res) => {
  const { email, firstName } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const response = await axios.post(
      `https://${SHOP_DOMAIN}/admin/api/2024-07/customers.json`,
      {
        customer: {
          email,
          first_name: firstName || '',
          verified_email: true,
          tags: 'google-login',
          send_email_welcome: false
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN
        }
      }
    );

    res.json({ status: 'success', customer: response.data.customer });
  } catch (err) {
    console.error("❌ Shopify Error:", err.response?.data || err.message);
    res.status(500).json({
      status: 'error',
      message: err.response?.data?.errors || err.message
    });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
