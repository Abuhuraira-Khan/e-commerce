import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import { configDotenv } from "dotenv";

configDotenv();

const client = new MongoClient(process.env.MONGO_URI);

//signUp code
export async function signUpUser(req, res) {
    try {
        await client.connect();
        const db = client.db(process.env.DB);
        const coll = db.collection("users");

        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            res.status(400).json({ message: "Please fill all the fields" });
            console.log("Validation Error: Missing fields");
            return;
        }

        // Check if the user already exists
        const existingUser = await coll.findOne({$or: [{ email }, { userName }]});
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            console.log("Conflict Error: User already exists");
            return;
        }

        const user = {
            userName,
            email,
            password,
            personal_info: {
              full_name:"",
              dob: "",
              gender: "",
              email:"",
              phone_num: "",
              profile_pic:""
            },
            addresses: [
              {
                _id: new ObjectId(),
                type: "",
                street: "",
                city: "",
                state: "",
                zip: "",
                country: "",
                full_address:"",
                is_default: true
              },
              {
                _id: new ObjectId(),
                type: "",
                street: "",
                city: "",
                state: "",
                zip: "",
                country: "",
                full_address:"",
                is_default: false
              }
            ],
            orders: [
              {
                _id: new ObjectId(),
                order_date: new Date(""),
                status:["processing","out of delivery","delivered",],
                items: [
                  {
                    _id: new ObjectId(),
                    name: "Product 1",
                    image:"",
                    quantity: 2,
                    price: 19.99,
                    product_id:"",
                  },
                  {
                    _id: new ObjectId(),
                    name: "Product 2",
                    image:"",
                    quantity: 1,
                    price: 99.99,
                    product_id:"",
                  }
                ],
                total_amount: 139.97,
                shipping_address: {
                  _id: new ObjectId(),
                  street: "456 Elm St",
                  city: "Gotham",
                  state: "NY",
                  zip: "54321",
                  country: "USA",
                  full_address:""
                }
              }
            ],
            wishlist: [
              {
                _id: new ObjectId(),
                name: "Product 3",
                image:"",
                added_date: new Date("2024-05-20")
              }
            ],
            cart: [
              {
                _id: new ObjectId(),
                name: "Product 4",
                image:"",
                quantity: 1,
                price: 49.99,
                product_id:"",
              }
            ],
            payment_methods: [
              {
                _id: new ObjectId(),
                type: "",
                card_number: "",
                expiration_date: "2025-12",
                billing_address: {
                  address_id: new ObjectId(),
                  street: "123 Main St",
                  city: "Metropolis",
                  state: "NY",
                  zip: "12345",
                  country: "USA",
                  full_address:""
                }
              }
            ],
            created_at: new Date("2023-01-01T00:00:00Z"),
            updated_at: new Date("2024-06-24T12:34:56Z")
          };
        await coll.insertOne(user);
        res.status(201).json({ message: "Sign up success", data:user });
        console.log("Sign up success");
    } catch (error) {
        console.error("Error during user sign up:", error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        if (client) {
            await client.close();
        }
    }
}

// login code
export async function loginUser(req,res){
    try {
        await client.connect();
        const db = client.db(process.env.DB);
        const coll = db.collection("users")

        const {email,password} = req.body;
        const user = await coll.findOne({email,password})
        if(user){
            console.log("succes")
            res.status(200).json({message:"login success",user:{_id:user._id,userName:user.userName,email:user.email,password:user.password}})
            }else{
                console.log("fail")
                res.status(401).json({message:"invalid email or password"})
                }

    } catch (error) {
        console.log(error)
    }
}

// cart products

export async function getCartProducts(req,res){
  const id = req.params.userId;
  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("users")

    const result = await coll.findOne({_id:new ObjectId(id)})
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// add to cart product 
export async function userAddToCart(req,res){
  const id = req.params.id;
  const {product,quantity,name,price,image} = req.body;
  const cart = {
    product,
    quantity,
    image,
    price,
    _id: new ObjectId(),
    name,
  }
  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("users")
    const result = await coll.updateOne({_id: new ObjectId(id)},{$push:{ cart:cart}})
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// user remove cart
export async function removeCart(req,res){
  const id = req.params.id;
  const {pId} = req.body;
  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("users")
    const result = await coll.updateOne({_id: new ObjectId(id)},{ $pull: {cart:{_id:new ObjectId(pId)}} })
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }  
}

// get cart amount
export async function getCartAmount(req,res){
  const id = req.params.id;
  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("users")
    const result = await coll.findOne({_id: new ObjectId(id)})
    res.json(result)
  } catch (error) {
    console.log(error)
  }
}

// user profile 
export async function getUserProfile(req, res) {
  const userName = req.params.userName;
  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("users")
    const result = await coll.findOne({ userName: userName })
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// user profile update
export async function updateUserProfile(req, res){
  const id = req.params.userId;
  const {profile_pic, full_name, email, phone_num} = req.body;
  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("users")
    const result = await coll.updateOne({_id: new ObjectId(id)},{$set:{
      personal_info:{
        profile_pic: profile_pic,
        full_name: full_name,
        email: email,
        phone_num: phone_num
      }
    }})
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// set user address
export async function setUserAddress(req, res) {
    const id = req.params.id;
    const{full_name,street,city,state,country,zip,full_address,phone_num,email,type,} = req.body;

    if (!street || !city || !state || !country || !zip || !full_address || !type) {
      return res.status(400).json({ message: "Address is required and cannot be empty" });
    }

    const address = {
       full_name,
       street,
       city,
       state,
       country,
       zip,
       full_address,
       phone_num,
       email,
       type
    }

    try {
      await client.connect();
      const db = client.db(process.env.DB);
      const coll = db.collection("users")
      const result = await coll.updateOne({_id: new ObjectId(id)},{$push:{ addresses:{ _id:new ObjectId(),...address}}})
      res.status(200).json({ message: "address succesfully added", data:result });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Internal Server Error" });
    }
}

// delete address
export async function removeUserAddress(req, res) {
  const id = req.params.id;
  const {pId} = req.body;
  console.log(pId)
  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("users")
    const result = await coll.updateOne({_id: new ObjectId(id)},{ $pull: {addresses:{_id:new ObjectId(pId)}} })
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// set payment method
export async function setUserPayMethod(req, res) {
    const id = req.params.id;
    const {type,cardNumber,cardName,expiryDate,cvv,billingAddress,paypalEmail,accountNumber,routingNumber,} = req.body;

  if (type === "PayPal") {
    if (!paypalEmail) {
      return res.status(400).json({ message: "Paypal email is required and cannot be empty" });
    }
  }
 
  if (type === "Credit Card") {
    if (!cardNumber || !cardName || !expiryDate || !cvv || !billingAddress) {
      return res.status(400).json({ message: "Card number is required and cannot be empty" });
    }
  }

  if (type === "Bank Transfer") {
    if (!accountNumber || !routingNumber) {
      return res.status(400).json({ message: "Account number and routing number are required and cannot be empty" });
    }
  }

    const method = {
      type,
      cardNumber,
      cardName,
      expiryDate,
      cvv,
      billingAddress,
      paypalEmail,
      accountNumber,
      routingNumber,
    }
    try {
      await client.connect();
      const db = client.db(process.env.DB);
      const coll = db.collection("users")
      const result = await coll.updateOne({_id: new ObjectId(id)},{$push:{ payment_methods:{_id:new ObjectId() ,...method}}})
      res.status(200).json({ message: "payment method succesfully added", data:result });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Internal Server Error" });
    }
}

// remove payment method
export async function removePayMethod(req,res){
  const id = req.params.id;
  const {mId} = req.body;
  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("users")
    const result = await coll.updateOne({_id: new ObjectId(id)},{$pull:{ payment_methods:{_id:new ObjectId(mId)}}});
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// get user set address
export async function getUserSetAddress(req,res){
  const id = req.params.id;
  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("users")
    const result = await coll.findOne({_id: new ObjectId(id)});
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// user place order
export async function userPlaceOrder(req,res){
  const id = req.params.id;
  const {userOrder} = req.body;
  if(!userOrder.shippingInfo || !userOrder.paymentMethod){
    return res.status(400).json({message:"Please Select Address & Payment Method" })
  }

  try {
    await client.connect();
    const db = client.db(process.env.DB);
    const coll = db.collection("users")
    const result = await coll.updateOne({_id: new ObjectId(id)},{$push:{ orders:{
      _id:new ObjectId(),...userOrder
      }}});
      res.status(200).json({message:"your order has been successfully placed", data:result})
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
}