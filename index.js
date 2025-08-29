// index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('✅ Google → Shopify customer backend is live!');
});

// Create customer in Shopify
app.post('/create-customer', async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    const response = await axios.post(
      `https://${process.env.SHOP_DOMAIN}/admin/api/2023-07/customers.json`,
      {
        customer: {
          email,
          first_name: firstName,
          last_name: lastName,
          verified_email: true
        }
      },
      {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({ success: true, customer: response.data.customer });
  } catch (error) {
    console.error('Customer creation failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Customer creation failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
