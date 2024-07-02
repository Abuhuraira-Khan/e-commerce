import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import { configDotenv } from "dotenv";

configDotenv();

const client = new MongoClient(process.env.MONGO_URI);

export async function uploadProduct(req,res){
  const {p} = req.body;
  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("products");
    const result = await coll.insertOne(p)

    res.status(201).json({message: "Product uploaded successfully", result: result})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"error"})
  }
}

export async function getProduct(req, res) {
  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("products");

    const result = await coll.find().toArray();
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}

export async function searchProducts(req, res) {
  const searchQuery = req.params.search;
  console.log(searchQuery);
  
  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("products");
    
    // Use a regular expression for partial matches
    const result = await coll.find({ name: { $regex: searchQuery, $options: 'i' } }).toArray();
    
    res.json(result);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}


export async function getOneProduct(req, res) {
  const searchQuery = req.params.id;

  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("products");

    const result = await coll.findOne({_id:new ObjectId(searchQuery)});
    res.json(result);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}
