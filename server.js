require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Port = process.env.PORT || 7000;

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
    success_url: "https://ecommerce-bhanups09.netlify.app/success",
    cancel_url: "https://ecommerce-bhanups09.netlify.app/failure",
  });

  res.json({ id: session.id });
});

app.listen(Port, () => {
  console.log("Server is running on port 7000");
});
