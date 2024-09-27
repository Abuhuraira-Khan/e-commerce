import React, { useState } from 'react';
import { useRef, useEffect} from 'react';
import Navbar from '../navbar/Navbar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {ProductCard} from '../productCard/ProductCard';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: null, // Set nextArrow to null to remove the next arrow
  };

  const introVideoRef = useRef(null)

  function introVideoPlay() {
    if (introVideoRef.current){
      introVideoRef.current.play()
    }
  }
  useEffect(() => {
    introVideoPlay();
  },[])
  
  // new arrival
  const [newArrival,setNewArrival] = useState([]);
  const getNewArrival = async ()=>{
    const response = await fetch(`https://e-commerce-api-mu-blush.vercel.app/api`);
    const data = await response.json();
    const let10 = data.slice(0,10)
    setNewArrival(let10);
  }
  getNewArrival();


  return (
    <div className="home capitalize">
      <section className="hero relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 opacity-50">
          <video className='h-full w-full' ref={introVideoRef} muted={true} loop={true}><source src="/assets/intro-video.mp4" /></video>
          </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover the Future of Shopping</h1>
          <Link to="/all-products">
            <button className="bg-second-color text-third-color px-8 py-3 rounded-lg transition duration-300">
              Shop Now
            </button>
          </Link>
        </div>
        {/* Video goes here */}
      </section>

      <section className="featured-products py-12 px-5">
        <h2 className="text-2xl font-semibold">Featured Products</h2>
        <Slider {...sliderSettings} className="product-slider overflow-hidden">
          <div className="product-item p-4">
            <img src="https://as2.ftcdn.net/v2/jpg/03/51/09/29/1000_F_351092935_pOu0iS396drNWuY3P35h2Nz0A1KpiJkN.jpg" alt="Product Name" className="w-full h-[80vh] object-cover mb-4 rounded-lg" />
            {/* <h3 className="text-lg font-medium">Product Name</h3> */}
            {/* <p className="text-gray-600">$99.99</p> */}
          </div>
          <div className="product-item p-4">
            <img src="https://media.self.com/photos/599c997a774b667d3bbe1214/16:9/w_1279,h_719,c_limit/groceries-family-month.jpg" alt="Product Name" className="w-full h-[80vh] object-cover mb-4 rounded-lg" />
            {/* <h3 className="text-lg font-medium">Product Name</h3> */}
            {/* <p className="text-gray-600">$99.99</p> */}
          </div>
          <div className="product-item p-4">
            <img src="https://assets.bonappetit.com/photos/661d8c2492dc9b02590b71f5/16:9/w_2912,h_1638,c_limit/20240227-ANJU-1193_annotated.jpg" alt="Product Name" className="w-full h-[80vh] object-cover mb-4 rounded-lg" />
            {/* <h3 className="text-lg font-medium">Product Name</h3> */}
            {/* <p className="text-gray-600">$99.99</p> */}
          </div>
          <div className="product-item p-4">
            <img src="https://images.othoba.com/images/thumbs/0670405_elegant-doll-set-widow-box-toys-barbie.jpeg" alt="Product Name" className="w-full h-[80vh] object-cover mb-4 rounded-lg" />
            {/* <h3 className="text-lg font-medium">Product Name</h3> */}
            {/* <p className="text-gray-600">$99.99</p> */}
          </div>
          {/* Repeat for other products */}
        </Slider>
      </section>

     {/* new arrivals */}
      <section className="new-arrivals py-12 px-5">
        <h2 className="text-2xl font-semibold mb-6">New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {newArrival.map((product,index)=>{
            return(
              <Link key={index} to={`/product/${product._id}`}>
              <ProductCard 
               img={product.gallery[0]}
               title={product.name}
               price={product.price}
              />
              </Link>
            )
          })}
        </div>
      </section>

      {/* popular product */}
      <section className="popular-product py-12 px-5">
        <h2 className="text-2xl font-semibold mb-6">popular product</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        </div>
      </section>

      
      
    </div>
  );
}

export default HomePage;
