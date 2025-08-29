const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const SHOP_DOMAIN = process.env.SHOP_DOMAIN;

app.post('/create-customer', async (req, res) => {
  const { email, firstName } = req.body;
  if (!email) return res.status(400).json({ error: "Missing email" });

  try {
    const response = await axios.post(
      `https://${SHOPIFY_API_KEY}:${SHOPIFY_API_SECRET}@${SHOP_DOMAIN}/admin/api/2024-07/customers.json`,
      {
        customer: {
          email,
          first_name: firstName || '',
          tags: "google-login",
          verified_email: true,
          send_email_welcome: false
        }
      }
    );

    res.json({ status: 'success', customer: response.data.customer });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
