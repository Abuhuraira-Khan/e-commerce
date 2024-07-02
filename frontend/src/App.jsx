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
import ProductUploadPage from "./admin/productUpload/ProductUpload";
import ProtectedRoute from "./ProtectedRoute ";
import Preloader from "./Preloader";

function App() {

  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    // Simulate a delay for demonstration purposes
    const timeout = setTimeout(() => {
      setLoading(false); // Set loading to false after delay
    }, 2000); // Adjust delay as needed or replace with actual data fetching logic

    return () => clearTimeout(timeout); // Cleanup timeout on component unmount
  }, []);

  if (loading) {
    return <Preloader />; // Show preloader while content is loading
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
          <Route
            path="/admin/product-upload"
            element={
              <ProtectedRoute>
                <ProductUploadPage />
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
