import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import HomePage from "./components/homePage/HomePage";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import ProductPage from "./components/productPage/ProductPage";
import OrderPlacePage from "./components/orderPlacePage/OrderPlacePage";
import ProductViewPage from "./components/productViewPage/ProductViewPage";
import CartPage from "./components/cartPage/CartPage";
import LoginPage from "./components/loginPage/LoginPage";
import ProfilePage from "./components/profilePage/ProfilePage";
import SearchProducts from "./components/searchProducts/SearchProducts";
import ProtectedRoute from "./ProtectedRoute ";
import Preloader from "./Preloader";

function App() {

  const [loader, setLoader] = useState(true)

  useEffect(() => {
    window.addEventListener("DOMContentLoaded",()=>{
      setLoader(false)
    })
  }, []);

  if(loader){
    return <Preloader/>
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search-products/:search" element={<SearchProducts />} />
          <Route path="/all-products" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductViewPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route
            path="/placeOrder"
            element={
              <ProtectedRoute>
                <OrderPlacePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userName"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
