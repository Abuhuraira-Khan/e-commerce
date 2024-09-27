import express from "express";
import { MongoClient } from "mongodb";
import { config as configDotenv } from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadProduct,getProduct, searchProducts, getOneProduct } from "./controller.js";
import {
  signUpUser,
  loginUser,
  getCartProducts,
  getUserProfile,
  updateUserProfile,
  setUserAddress,
  removeUserAddress,
  setUserPayMethod,
  removePayMethod,
  userAddToCart,
  removeCart,
  getCartAmount,
  getUserSetAddress,
  userPlaceOrder
} from "./user.controller.js";

configDotenv();

const app = express();
const port = 3030;
const mongoUrl = process.env.MONGO_URI;
const dbName = process.env.DB;
const client = new MongoClient(mongoUrl);

const __dirname = fileURLToPath(import.meta.url);

app.use(cors(
  // {
  //   origin: "https://e-commerce-8tlx.onrender.com",
  //   credentials: true,
  // }
));
app.use(express.json({ limit: "20mb" }));

let db;

async function connectToMongo() {
  try {
    await client.connect();
    db = client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if unable to connect
  }
}

app.get("/", (req, res) => {
  res.send("<a href='/api'>api</a>");
});

app.get("/api", async (req, res) => {
  await getProduct(req, res);
});

app.post("/product-upload", async (req, res) => {
  await uploadProduct(req, res);
});

app.post("/user/signUp", async (req, res) => {
  await signUpUser(req, res);
});

app.post("/user/login", async (req, res) => {
  await loginUser(req, res);
});

app.get("/products/:search", async (req, res) => {
  await searchProducts(req, res);
});

app.get("/cart/:userId", async (req, res) => {
  await getCartProducts(req, res);
});

app.post("/cart/:id", async (req, res) => {
  await userAddToCart(req, res);
});

app.put("/removeCart/:id", async (req, res) => {
  await removeCart(req, res);
});

app.get("/getCartAmount/:id", async (req, res) => {
  await getCartAmount(req, res);
});

app.get("/user/:userName", async (req, res) => {
  await getUserProfile(req, res);
});

app.put("/user/:userId/edit", async (req, res) => {
  await updateUserProfile(req, res);
});

app.get("/product/:id", async (req, res) => {
  await getOneProduct(req, res);
});

app.post("/setUserAddress/:id", async (req, res) => {
  await setUserAddress(req, res);
});

app.put("/removeUserAddress/:id", async (req, res) => {
  await removeUserAddress(req, res);
});

app.post("/setUserPayMethod/:id", async (req, res) => {
  await setUserPayMethod(req, res);
});

app.put("/removePayMethod/:id", async (req, res) => {
  await removePayMethod(req, res);
});

app.get("/user/order/address/:id", async (req, res) => {
  await getUserSetAddress(req, res);
});

app.put("/order/user/:id", async (req, res) => {
  await userPlaceOrder(req, res);
});

app.listen(port, async () => {
  await connectToMongo();
  console.log(`Server is running on port ${port}`);
});
