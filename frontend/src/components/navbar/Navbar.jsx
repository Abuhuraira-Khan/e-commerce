import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useAuth } from "../../context/AuthProvider";

const Navbar = () => {
  const [authUser, setAuthUser] = useAuth();
  const [cartAmount, setCartAmount] = useState(0);  // Initialize as a number

  const search = useParams();
  const sideRef = useRef(null);

  if (sideRef.current) {
    sideRef.current.style.right = "-100%";
  }

  function handleSideBar() {
    if (sideRef.current.style.right === "-100%") {
      sideRef.current.style.right = "0";
    } else {
      sideRef.current.style.right = "-100%";
    }
  }

  // search product code
  const [searchValue, setSearchValue] = useState(search);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  // get cart amount
useEffect(() => {
  async function getCart() {
    try {
      const res = await fetch(`https://e-commerce-server-bwda.onrender.com/getCartAmount/${authUser._id}`);
      const data = await res.json();
      const totalQuantity = data.cart.reduce((acc, item) => acc + item.quantity, 0);  // Sum quantities
      setCartAmount(totalQuantity);
    } catch (error) {
      console.log(error)
    }
  };
  getCart();
}, [cartAmount])

// handleSearch
const handleSearch = (e) => {
  e.preventDefault();
  if(typeof searchValue === "string" && searchValue.trim().length > 0){
    navigate(`/search-products/${searchValue}`)
  }
}

  return (
    <div className="capitalize sticky top-0 z-50">
      <header className="navbar relative w-full bg-third-color h-14 p-2 grid grid-cols-4 items-center gap-0">
        <div className="logo w-full h-full">
          <div className="logo-wrapper w-full h-full flex justify-around items-center">
            <Link to="/">
              <img className="w-20 h-18" src="/assets/Images/logo-2.png" alt="ultra shop" />
            </Link>
          </div>
        </div>
        <div className="searchBar w-full h-full flex items-center col-span-2 ">
          <div className="search flex items-center bg-white py-1 px-3 rounded-md">
            <input
              ref={searchRef}
              onChange={(e) => setSearchValue(e.target.value)}
              className="py-1 px-2 w-full md:w-96 lg:w-96 rounded-md focus:outline-none"
              type="text"
              placeholder="Find Product.."
            />
              <button onClick={handleSearch} className="bg-second-color py-1 px-4 ml-1 rounded-md">
                <IoSearchOutline size={25} />
              </button>
          </div>
        </div>
        <div onClick={handleSideBar} className="sideMenu lg:hidden z-50 flex justify-end">
          <IoMenu size={30} />
        </div>
        <div ref={sideRef} className="users rounded-lg z-10 duration-300 lg:flex lg:items-center lg:py-0 lg:px-0 lg:static lg:right-0 lg:top-0 lg:h-full lg:w-full lg:bg-transparent bg-second-color p-5 py-10 absolute right-[-100%] top-[10%] h-[100vh] w-1/2">
          <div className="users-wrapper flex gap-5 lg:gap-10 lg:flex-row lg:items-center lg:justify-center flex-col items-left justify-left">
            <Link to="/cart">
              <span className="relative duration-300 flex items-center gap-2 lg:p-0 lg:bg-transparent lg:hover:right-0 bg-second-color hover:right-10 p-1 rounded-lg">
                <span className="w-5 h-5 absolute lg:bottom-4 lg:left-4 bottom-5 left-5 bg-red-500 lg:bg-second-color text-third-color p-1 text-sm flex justify-center items-center rounded-full outline outline-2 outline-second-color lg:outline-third-color">
                  {cartAmount}
                </span>
                <BsCart4 size={30} />
                <span>cart</span>
              </span>
            </Link>
            <Link to={authUser ? `/profile/${authUser.userName}` : "/login"}>
              <span className=" relative duration-300 flex gap-2 items-center lg:hover:right-0 lg:p-0 lg:bg-transparent bg-second-color hover:right-10 p-1  rounded-lg ">
                <FaRegUser size={30} />
                <span className="normal-case">{authUser ? authUser.userName : "login"}</span>
              </span>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
