import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';

const OrderPlacePage = () => {
  const [shippingInfo, setShippingInfo] = useState({});

  const [addressList, setAddressList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState(null)

  const [authUser, setAuthUser] = useAuth();

  // get address
  const getUserSetAdress = async () => {
    const res = await fetch(`https://e-commerce-server-bwda.onrender.com/user/order/address/${authUser._id}`)
    const data = await res.json();
    setAddressList(data.addresses)
    setPaymentList(data.payment_methods)
  }
  getUserSetAdress();


    const handleAddressSelect = (address) => {
      setShippingInfo({
        fullName: address.full_name,
        street: address.street,
        city: address.city,
        stateProvince: address.state,
        zipCode: address.zip,
        country: address.country,
        fullAddress: address.full_address,
        phone: address.phone_num,
        email: address.email,
      });
    };

  const handlePaymentChange = (method) => {
    setPaymentMethod(()=>{
      if(method.type === "PayPal"){
        return ({
          type: method.type,
          email:method.paypalEmail
        })
      }
      else if(method.type === "Credit Card"){
        return ({
          type: method.type,
          cardNumber: method.cardNumber,
          cardName: method.cardName,
          cardExp: method.expiryDate,
          cardCVC: method.cvc,
          billingAddress:method.billingAddress
          })
          }
          else if(method.type === "Bank Transfer"){
            return ({
              type: method.type,
              accountNumber:method.accountNumber,
              routingNumber:method.routingNumber
            })
          }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send data to backend, etc.
    const userOrder ={
      order_date:new Date().toDateString(),
      item:order,
      total_amount:price,
      shippingInfo: shippingInfo,
      paymentMethod:paymentMethod,
      status:"pending"
      }

    const res = await fetch(`https://e-commerce-server-bwda.onrender.com/order/user/${authUser._id}`,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({userOrder})
    })

    const data = await res.json();
    if(!res.ok){
      alert(data.message)
    } else{
      alert(data.message)
    }

  };


  useEffect(() => {
    document.title = 'Order Summary';
  }, []);

  // Retrieve order summary from sessionStorage
  const orderString = sessionStorage.getItem('order');
  const order = orderString ? JSON.parse(orderString) : {};
  const price = order.product.price * order.quantity;

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Order Placement</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">

        {addressList.map((address, index) => {
          return (
            <div key={index} className="shadow-lg bg-third-color p-4 mb-6 relative">
              <input onChange={()=>handleAddressSelect(address)} type="radio" name="addres" id="addres" className='absolute top-2 right-2 p-1 px-2 capitalize text-sm bg-red-500 rounded-md text-text-color' />
              <label htmlFor="addres">
                <h3 className="text-lg font-semibold text-teal-500">{address.type} Address</h3>
                <p className=' font-semibold'>{address.full_name}</p>
                <p>{address.phone_num} <br /> {address.email}</p>
                <p className="text-text3-color">{`${address.street} , ${address.city} , ${address.state} , ${address.zip} , ${address.country}`}</p>
                <p className="text-gray-400 text-sm">{`${address.full_address}`}</p>
              </label>
            </div>
          )
        })}

        {/* Payment Information */}
        <h2 className="text-xl font-bold mt-8 mb-4">Payment Method</h2>
        {paymentList.map((method, index) => {
          if (method.type === "PayPal") {
            return (
              <div key={index} className="mb-6 p-4 bg-third-color shadow-lg rounded-lg relative">
                <input onChange={()=>handlePaymentChange(method)} type="radio" id='paypal' name='payMethod' className="absolute top-2 right-2 bg-four-color text-text-color py-1 px-2 rounded-md text-sm " />
                <label htmlFor="paypal">
                  <h3 className="text-lg font-semibold mb-2 text-text2-color">{method.type}</h3>
                  <div className="space-y-1">
                    <p className="text-text3-color">PayPal Email: {method.paypalEmail}</p>
                  </div>
                </label>
              </div>
            );
          }

          if (method.type === "Credit Card") {
            return (
              <div key={index} className="mb-6 p-4 bg-third-color shadow-lg rounded-lg relative">
                <input onChange={()=>handlePaymentChange(method)} type="radio" id='credit_card' name='payMethod' className="absolute top-2 right-2 bg-four-color text-text-color py-1 px-2 rounded-md text-sm " />
                <label htmlFor="credit_card">
                  <h3 className="text-lg font-semibold mb-2 text-text2-color">{method.type}</h3>
                  <div className="space-y-1">
                    <p className="text-text3-color">Card Number: {method.cardNumber}</p>
                    <p className="text-text3-color">Card Name: {method.cardName}</p>
                    <p className="text-text3-color">CVV: {method.cvv}</p>
                    <p className="text-text3-color">Expiry Date: {method.expiryDate}</p>
                    <p className="text-text3-color">Billing Address: {method.billingAddress}</p>
                  </div>
                </label>
              </div>
            );
          }

          if (method.type === "Bank Transfer") {
            return (
              <div key={index} className="mb-6 p-4 bg-third-color shadow-lg rounded-lg relative">
                <input onChange={()=>handlePaymentChange(method)} type="radio" id='bank_transfer' name='payMethod' className="absolute top-2 right-2 bg-four-color text-text-color py-1 px-2 rounded-md text-sm " />
                <label htmlFor="bank_transfer">
                  <h3 className="text-lg font-semibold mb-2 text-text2-color">{method.type}</h3>
                  <div className="space-y-1">
                    <p className="text-text3-color">Account Number: {method.accountNumber}</p>
                    <p className="text-text3-color">Routing Number: {method.routingNumber}</p>
                  </div>
                </label>
              </div>
            );
          }

          return null;
        })}

        {/* Order Summary */}
        <h2 className="text-xl font-bold mt-8 mb-4">Order Summary</h2>
        {/* Replace with actual order summary details */}
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700">Product Name: {order.product.name}</p>
          <p className="text-sm text-gray-700">Quantity: {order.quantity}</p>
          <p className="text-sm text-gray-700">Price: {price}</p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderPlacePage;
