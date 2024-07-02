import React, { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Link} from "react-router-dom"

const CartPage = () => {

  const [cartList, setCartList] = useState([])
  const [quantity, setQuantity] = useState(0)
  const [authUser,setAuthUser] =useAuth();

  async function getCartProducts(){
    try {

      const res = await fetch(`http://localhost:3030/cart/${authUser._id}`);

      const result = await res.json();
      setCartList(result.cart)
    } catch (error) {
      console.log(error)
    }
  }

  getCartProducts();
  
  const getTotalPrice = () => {
    return cartList.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRemoveCart = async (pId) =>{
    const response = await fetch(`http://localhost:3030/removeCart/${authUser._id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({pId})
    })
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="flex flex-col space-y-4">
        {cartList.map((item,index) => (
          <div key={index} className="flex items-center p-4 bg-white shadow-md rounded-lg">
            <Link to={`/product/${item.product}`}> 
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-32 h-32 object-cover rounded-lg"
            />
            </Link>
            <div className="ml-4 flex-1">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-600">${item.price}</p>
              <div className="flex items-center mt-2">
                <button className="px-3 py-1 bg-gray-200 rounded-lg">-</button>
                <span className="px-3">{item.quantity}</span>
                <button className="px-3 py-1 bg-gray-200 rounded-lg">+</button>
              </div>
            </div>
            <div className="ml-4">
              <button onClick={()=>handleRemoveCart(item._id)} className="px-3 py-1 bg-red-500 text-white rounded-lg">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Total: ${getTotalPrice()}</h2>
        <button className="mt-4 px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition duration-300">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
