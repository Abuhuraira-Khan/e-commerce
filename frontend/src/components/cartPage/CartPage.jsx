import React, { useEffect, useState,useContext } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Link} from "react-router-dom";
import {CartContext} from "../../context/CartContext";

const CartPage = () => {

  const { cartList:quantity, setCartList:setQuantity } = useContext(CartContext);
  const [cartList, setCartList] = useState([])
  const [authUser,setAuthUser] =useAuth();

  useEffect(() => {
    
    async function getCartProducts(){
      try {
  
        const res = await fetch(`https://e-commerce-api-mu-blush.vercel.app/cart/${authUser._id}`);
  
        const result = await res.json();
        console.log(result.cart)
        setCartList(result.cart)
      } catch (error) {
        console.log(error)
      }
    }
  
    getCartProducts();
    return () => {
      setCartList([]);
    }
  }, [])
  

  
  const getTotalPrice = () => {
    return cartList.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRemoveCart = async (pId,ProductQuantity) =>{
    const response = await fetch(`https://e-commerce-api-mu-blush.vercel.app/removeCart/${authUser._id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({pId})
    });
    if(response.ok){
      setCartList(cartList.filter(cart => cart._id !== pId));
      setQuantity(parseInt(quantity) - parseInt(ProductQuantity));
    }
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
              <button onClick={()=>handleRemoveCart(item._id,item.quantity)} className="px-3 py-1 bg-red-500 text-white rounded-lg">Remove</button>
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
