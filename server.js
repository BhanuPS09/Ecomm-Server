require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post("/api/create-checkout-session", async (req, res) => {
  const { products } = req.body;
  console.log(products);

  const products_details = products.map((element) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: element.name,
      },
      unit_amount: element.price * 100,
    },
    quantity: element.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: products_details,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/failure",
  });

  res.json({ id: session.id });
});

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});