import React, { useEffect, useRef, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState('account');
  const [editMode, setEditMode] = useState(false);
  const [userProfile, setUserProfile] = useState({})
  const [userDetails, setUserDetails] = useState({})
  const [orderDetails, setOrderDetails] = useState([])
  const [addressDetails, setAddressDetails] = useState([])
  const [paymentDetails, setpaymentDetails] = useState([])

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setEditMode(false);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'account':
        return <AccountDetails editMode={editMode} setEditMode={setEditMode} userDetails={userDetails} />;
      case 'orders':
        return <OrderHistory orderdetails={orderDetails} />;
      case 'addresses':
        return <Addresses addressDetails={addressDetails}/>;
      case 'payment':
        return <PaymentMethods paymentDetails={paymentDetails} />;
      default:
        return <AccountDetails editMode={editMode} setEditMode={setEditMode} />;
    }
  };

  // user from databse

  const {userName} = useParams();
  const [authUser,setAuthUser] = useAuth();

  useEffect(() => {
    const getDetailsUser = async () => {
      try {
        if(authUser.userName === userName){
          const response = await fetch(`https://e-commerce-api-mu-blush.vercel.app/user/${authUser.userName}`);
          const data = await response.json();
          setUserProfile(data);
          setUserDetails(data.personal_info)
          setOrderDetails(data.orders)
          setAddressDetails(data.addresses)
          setpaymentDetails(data.payment_methods)
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    getDetailsUser();
  }, []);

  // sign out
  const handleSignOut = ()=>{
    localStorage.removeItem('User')
    alert("user signed out")
    setAuthUser(null)
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-3">{userDetails.full_name}</h1>
      <button onClick={handleSignOut} className="border p-2 bg-second-color rounded-md text-third-color hover:bg-[#554afa] mb-6">Sign out</button>
      <div className="flex mb-6">
        <button 
          onClick={() => handleTabChange('account')} 
          className={`flex-1 p-4 ${selectedTab === 'account' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Account Details
        </button>
        <button 
          onClick={() => handleTabChange('orders')} 
          className={`flex-1 p-4 ${selectedTab === 'orders' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Order History
        </button>
        <button 
          onClick={() => handleTabChange('addresses')} 
          className={`flex-1 p-4 ${selectedTab === 'addresses' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Manage Addresses
        </button>
        <button 
          onClick={() => handleTabChange('payment')} 
          className={`flex-1 p-4 ${selectedTab === 'payment' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Payment Methods
        </button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

const AccountDetails = ({ editMode, setEditMode, userDetails }) => {
  const [user, setUser] = useState({
    profile_pic: '',
    full_name: '',
    email: '',
    phone_num: '',
    ...userDetails
  });

  useEffect(() => {
    setUser({
      profile_pic: '',
      full_name: '',
      email: '',
      phone_num: '',
      ...userDetails
    });
  }, [userDetails]);
  
  // edit user

  const [authUser,setAuthUser] = useAuth();


  const handleEditClick = async () => {
    setEditMode(!editMode);
    if(editMode){
      try {
        const response = await fetch(`https://e-commerce-api-mu-blush.vercel.app/user/${authUser._id}/edit`,{
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error)
      }
    }
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log(reader.result)
        setUser((prevUser) => ({ ...prevUser, profile_pic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Account Details</h2>
        <button 
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition duration-300"
          onClick={handleEditClick}
        >
          {editMode ? 'Save' : 'Edit'}
        </button>
      </div>
      <div className="flex items-center mb-6">
        <div className="w-32 h-32 mr-4">
          <img 
            src={user.profile_pic} 
            alt="Profile" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        {editMode && (
          <input 
            type="file" 
            accept="image/*" 
            className="mb-4"
            onChange={handleProfilePictureChange}
          />
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input 
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`} 
          id="name" 
          type="text" 
          value={user.full_name}
          readOnly={!editMode}
          onChange={(e) => setUser({ ...user, full_name: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input 
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`} 
          id="email" 
          type="email" 
          value={user.email}
          readOnly={!editMode}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Phone
        </label>
        <input 
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editMode ? 'bg-gray-100' : ''}`} 
          id="phone" 
          type="text" 
          value={user.phone_num}
          readOnly={!editMode}
          onChange={(e) => setUser({ ...user, phone_num: e.target.value })}
        />
      </div>
    </div>
  );
};

const OrderHistory = ({orderdetails}) => {
  const [orderList, setOrderList] = useState(orderdetails);

  useEffect(() => {
    setOrderList(orderdetails)
  }, [orderdetails])

  return (
    <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Order History</h2>
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Date
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Total
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order,index) => (
            <tr key={index}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {order._id}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {order.order_date}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {order.total_amount}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Addresses = ({addressDetails}) => {
  const [addresses, setAddresses] = useState(addressDetails);
  const [addNewAddress, setAddNewAddress] = useState(
    {
      full_name:'',
      street:'',
      city: '',
      state: '',
      country: '',
      zip: '',
      full_address:'',
      phone_num:'',
      email:'',
      type:'',
    }
  );


  const addressesInputRef= useRef(null);
  const messageRef= useRef(null);

  useEffect(() => {
    setAddresses(addressDetails)
  }, [addressDetails])

  const [authUser,setAuthUser] = useAuth();

  // add new address
  const handleAddNewAddress = async () => {
    const response = await fetch(`https://e-commerce-api-mu-blush.vercel.app/setUserAddress/${authUser._id}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(addNewAddress)
    });
    const data = await response.json();

    if(!response.ok){
      alert(data.message)
    } else{
        alert(data.message)
        setAddresses((prevAddresses) =>[...prevAddresses,addressDetails]);
        setAddNewAddress('')
        addressesInputRef.current.classList.add("hidden")
    }
  }

  //delet address
  const removeAddress = async (pId) =>{
    const response = await fetch(`https://e-commerce-api-mu-blush.vercel.app/removeUserAddress/${authUser._id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({pId})
    })
    setAddresses(addresses.filter(address => address._id !== pId));
  }

  // type
  const handleAddressType = (e) => {
    setAddNewAddress({...addNewAddress, type: e.target.textContent})
  }

  return (
    <>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Manage Addresses</h2>
        {addresses.map((address, index) => (
          <div key={index} className="shadow-lg bg-third-color p-4 mb-6 relative">
            <h3 className="text-lg font-semibold text-teal-500">{address.type} Address</h3>
            <button onClick={()=>removeAddress(address._id)} className='absolute top-2 right-2 p-1 px-2 capitalize text-sm bg-red-500 rounded-md text-text-color'>remove</button>
            <p className=' font-semibold'>{address.full_name}</p>
            <p>{address.phone_num} <br /> {address.email}</p>
            <p className="text-text3-color">{`${address.street} , ${address.city} , ${address.state} , ${address.zip} , ${address.country}`}</p>
            <p className="text-gray-400 text-sm">{`${address.full_address}`}</p>
          </div>
        ))}
        <button onClick={()=>{addressesInputRef.current.classList.add("block"); addressesInputRef.current.classList.remove("hidden")}}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Add New Address
        </button>
      </div>

      {/* add new address input field */}
      <div ref={addressesInputRef} className=' bg-third-color hidden absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-full h-96 lg:w-1/2 rounded-lg '>
      <button onClick={()=>{addressesInputRef.current.classList.add("hidden")}} className=' fixed top-2 right-5'><RxCross2 size={25} color="rgb(75 85 99)" /></button>
        <div className="wrapper capitalize p-6 h-full overflow-y-auto">
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
              full name
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
              id="fullName"
              type="text"
              onChange={(e)=>{setAddNewAddress({...addNewAddress, full_name: e.target.value})}}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="street">
              street
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
              id="street"
              type="text"
              onChange={(e)=>{setAddNewAddress({...addNewAddress, street: e.target.value})}}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
              city
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
              id="city"
              type="text"
              onChange={(e)=>{setAddNewAddress({...addNewAddress, city: e.target.value})}}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
              state / Province
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
              id="state"
              type="text"
              onChange={(e)=>{setAddNewAddress({...addNewAddress, state: e.target.value})}}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zip-code">
              zip code
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
              id="zip-code"
              type="text"
              onChange={(e)=>{setAddNewAddress({...addNewAddress, zip: e.target.value})}}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
              country
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
              id="country"
              type="text"
              onChange={(e)=>{setAddNewAddress({...addNewAddress, country: e.target.value})}}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="full-address">
              full address
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
              id="full-address"
              type="text"
              placeholder='house no. / building / street / city'
              onChange={(e)=>{setAddNewAddress({...addNewAddress, full_address: e.target.value})}}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_num">
              phone number
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
              id="phone_num"
              type="text"
              onChange={(e)=>{setAddNewAddress({...addNewAddress, phone_num: e.target.value})}}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              email
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
              id="email"
              type="email"
              onChange={(e)=>{setAddNewAddress({...addNewAddress, email: e.target.value})}}
            />
          </div>
          <div className="mb-4 flex gap-2 flex-wrap">
          <label className="block text-gray-700 text-sm font-bold mb-2 w-full capitalize">
              type
            </label> 
            <div onClick={handleAddressType} className={`p-3 px-5 border ${addNewAddress.type === "Shipping" ? 'border-second-color':'border-first-color'} shadow rounded-md text-gray-600 cursor-pointer`}>
              Shipping
            </div>
            <div onClick={handleAddressType}  className={`p-3 px-5 border ${addNewAddress.type === "Billing" ? 'border-second-color':'border-first-color'} shadow rounded-md text-gray-600 cursor-pointer`}>
              Billing
            </div>
          </div>
          <div className='relative w-full p-5'>
            <button onClick={handleAddNewAddress} className='bg-second-color p-3 px-10 text-third-color rounded-md capitalize absolute right-0 bottom-0'>add</button>
          </div>
        </div>
      </div>
    </>
  );
};

const PaymentMethods = ({paymentDetails}) => {
  const [paymentMethods, setPaymentMethods] = useState(paymentDetails);
  const [addNewMethods, setAddNewMethods] = useState(
    {
      type: 'Credit Card',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      billingAddress:'',
      paypalEmail: '',
      accountNumber: '',
      routingNumber: '',
    }
  );

  useEffect(() => {
    setPaymentMethods(paymentDetails)
  }, [paymentDetails])

  const paymentInputRef = useRef(null);

  const creditCardRef = useRef(null);
  const paypalRef = useRef(null);
  const bankTransferRef = useRef(null);

  const [activeMethod,setActiveMethod] = useState("Credit Card")

  const handleMethodSwitch = (value) => {
    setActiveMethod(value)
    setAddNewMethods({...addNewMethods, type: value})
  }

  useEffect(() => {
    const inputs = document.querySelectorAll("#credit-card-section input");
    const inputs2 = document.querySelectorAll("#paypal-section input");
    const inputs3 = document.querySelectorAll("#bank-transfer-section input");

    switch (activeMethod) {
      case "Credit Card":
        inputs.forEach((input) => {
          input.value = "";
        });
        break;
      case "PayPal":
        inputs2.forEach((input) => {
          input.value = "";
        });
        break;
      case "Bank Transfer":
        inputs3.forEach((input) => {
          input.value = "";
        });
        break;
      default:
        break;
    }
    
  }, [activeMethod])

  useEffect(() => {

    const inputs = document.querySelectorAll("#credit-card-section input");
    const inputs2 = document.querySelectorAll("#paypal-section input");
    const inputs3 = document.querySelectorAll("#bank-transfer-section input");
    console.log(paymentInputRef.current.style.display)
    if(paymentInputRef.current.style.display === "none"){
      inputs.forEach((input)=>{
        input.value = "";
      })
      inputs2.forEach((input)=>{
        input.value = "";
      })
      inputs3.forEach((input)=>{
        input.value = "";
        })
    }
  }, [paymentInputRef.current])
  
  

  // add new payment method

  const [authUser,setAuthUser] = useAuth();

  const handleAddNewMethod = async () =>{
    const res = await fetch(`https://e-commerce-api-mu-blush.vercel.app/setUserPayMethod/${authUser._id}`,{
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(addNewMethods)
    })

    const data = await res.json();

    if(!res.ok){
      alert(data.message)
    }  else{
        alert(data.message)
        setPaymentMethods((prevAddresses) =>[...prevAddresses,paymentMethods]);
        setActiveMethod('')
        paymentInputRef.current.classList.add("hidden")
    }
  }

  // remove method
  const handleRemove = async (mId) => {
    const res = await fetch(`https://e-commerce-api-mu-blush.vercel.app/removePayMethod/${authUser._id}`,{
      method:"PUT",
      headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({mId})
    });
    const data = await res.json();
    setPaymentMethods(paymentMethods.filter(method=>method._id !== mId))
  }  


  return (
    <>
      <div className="w-full max-w-4xl bg-text-color shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
        {paymentMethods.map((method, index) => {
        if (method.type === "PayPal") {
          return (
            <div key={index} className="mb-6 p-4 bg-third-color shadow-lg rounded-lg relative">
              <button
                onClick={() => handleRemove(method._id)}
                className="absolute top-2 right-2 bg-four-color text-text-color py-1 px-2 rounded-md text-sm "
              >
                Remove
              </button>
              <h3 className="text-lg font-semibold mb-2 text-text2-color">{method.type}</h3>
              <div className="space-y-1">
                <p className="text-text3-color">PayPal Email: {method.paypalEmail}</p>
              </div>
            </div>
          );
        }

        if (method.type === "Credit Card") {
          return (
            <div key={index} className="mb-6 p-4 bg-third-color shadow-lg rounded-lg relative">
              <button
                onClick={() => handleRemove(method._id)}
                className="absolute top-2 right-2 bg-four-color text-text-color py-1 px-2 rounded-md text-sm"
              >
                Remove
              </button>
              <h3 className="text-lg font-semibold mb-2 text-text2-color">{method.type}</h3>
              <div className="space-y-1">
                <p className="text-text3-color">Card Number: {method.cardNumber}</p>
                <p className="text-text3-color">Card Name: {method.cardName}</p>
                <p className="text-text3-color">CVV: {method.cvv}</p>
                <p className="text-text3-color">Expiry Date: {method.expiryDate}</p>
                <p className="text-text3-color">Billing Address: {method.billingAddress}</p>
              </div>
            </div>
          );
        }

        if (method.type === "Bank Transfer") {
          return (
            <div key={index} className="mb-6 p-4 bg-third-color shadow-lg rounded-lg relative">
              <button
                onClick={() => handleRemove(method._id)}
                className="absolute top-2 right-2 bg-four-color text-text-color py-1 px-2 rounded-md text-sm"
              >
                Remove
              </button>
              <h3 className="text-lg font-semibold mb-2 text-text2-color">{method.type}</h3>
              <div className="space-y-1">
                <p className="text-text3-color">Account Number: {method.accountNumber}</p>
                <p className="text-text3-color">Routing Number: {method.routingNumber}</p>
              </div>
            </div>
          );
        }

        return null;
      })}
        <button onClick={()=>{paymentInputRef.current.style.display="block"; paymentInputRef.current.classList.remove("hidden")}}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Add New Payment Method
        </button>
      </div>

      {/* add payment method */}
      <div ref={paymentInputRef} className='bg-third-color hidden absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-full h-96 lg:w-1/2 rounded-lg '>
  <button onClick={() => { paymentInputRef.current.style.display="none" }} className='fixed right-5 top-2'>
    <RxCross2 size={25} color="rgb(75 85 99)" />
  </button>
  <div className="wrapper capitalize p-6 h-full overflow-y-auto">
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment-method">
        Payment Method
      </label>
      <div className="flex gap-4">
        <div onClick={()=>handleMethodSwitch("Credit Card")} className={`p-3 px-5 border ${activeMethod === "Credit Card" ? "border-second-color" : "border-first-color"}  shadow rounded-md text-gray-600 cursor-pointer`}>
          Credit Card
        </div>
        <div onClick={()=>handleMethodSwitch("PayPal")} className={`p-3 px-5 border ${activeMethod === "PayPal" ? "border-second-color" : "border-first-color"} shadow rounded-md text-gray-600 cursor-pointer`}>
          PayPal
        </div>
        <div onClick={()=>handleMethodSwitch("Bank Transfer")}className={`p-3 px-5 border ${activeMethod === "Bank Transfer" ? "border-second-color" : "border-first-color"} shadow rounded-md text-gray-600 cursor-pointer`}>
          Bank Transfer
        </div>
      </div>
    </div>
    <div ref={creditCardRef} id="credit-card-section" className={`${activeMethod === "Credit Card" ? "block" : "hidden"} mb-4`}>
      <div className="mb-4">
        <label className=' text-gray-700 text-sm font-bold mb-2' htmlFor="card-number">
          Card Number
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
          id="card-number"
          type="text"
          placeholder="1234 5678 9012 3456"
          onChange={(e)=>{setAddNewMethods({...addNewMethods, cardNumber: e.target.value})}}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="card-name">
          Name on Card
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
          id="card-name"
          type="text"
          placeholder="John Doe"
          onChange={(e)=>{setAddNewMethods({...addNewMethods, cardName: e.target.value})}}
        />
      </div>
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiry-date">
            Expiry Date
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
            id="expiry-date"
            type="text"
            placeholder="MM/YY"
            onChange={(e)=>{setAddNewMethods({...addNewMethods, expiryDate: e.target.value})}}
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cvv">
            CVV
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
            id="cvv"
            type="text"
            placeholder="123"
            onChange={(e)=>{setAddNewMethods({...addNewMethods, cvv: e.target.value})}}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="billing-address">
          Billing Address
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
          id="billing-address"
          type="text"
          placeholder="1234 Main St, City, State, ZIP"
          onChange={(e)=>{setAddNewMethods({...addNewMethods, billingAddress: e.target.value})}}
        />
      </div>
    </div>
    <div ref={paypalRef} id="paypal-section" className={`mb-4 ${activeMethod === "PayPal" ? "block" : "hidden"}`}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paypal-email">
          PayPal Email
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
          id="paypal-email"
          type="email"
          placeholder="example@paypal.com"
          onChange={(e)=>{setAddNewMethods({...addNewMethods, paypalEmail: e.target.value})}}
        />
      </div>
    </div>
    <div ref={bankTransferRef} id="bank-transfer-section" className={`mb-4 ${activeMethod === "Bank Transfer" ? "block" : "hidden"}`}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bank-account">
          Bank Account Number
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
          id="bank-account"
          type="text"
          placeholder="1234567890"
          onChange={(e)=>{setAddNewMethods({...addNewMethods, accountNumber: e.target.value})}}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bank-routing">
          Routing Number
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
          id="bank-routing"
          type="text"
          placeholder="987654321"
          onChange={(e)=>{setAddNewMethods({...addNewMethods, routingNumber: e.target.value})}}
        />
      </div>
    </div>
    <div className='relative w-full p-5'>
      <button onClick={handleAddNewMethod} className='bg-second-color p-3 px-10 text-third-color rounded-md capitalize absolute right-0 bottom-0'>
        Add
      </button>
    </div>
  </div>
</div>

    </>
  );
};

export default ProfilePage;
