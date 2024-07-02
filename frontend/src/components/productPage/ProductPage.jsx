import React, { useEffect, useState } from 'react'
import Navbar from "../navbar/Navbar"
import {ProductCard} from '../productCard/ProductCard'
import { Link, useParams } from 'react-router-dom'

const ProductPage = () => {


  const [productList, setProductList] = useState([]);


useEffect(() => {
  async function getProduct(){
    const response = await fetch(`https://e-commerce-server-bwda.onrender.com/api`);
    const data = await response.json();
    setProductList(data);
  }
  getProduct();
}, [])




  

  return (
    <div className='productPage container xl:mx-auto flex gap-3 p-1 capitalize'>
      <div className="section w-full p-2">
        <div className="section-wrapper grid grid-cols-2 md:grid-cols-4 gap-4">
        {productList.map((product,index)=>{
          return(
            <Link key={index} to={`/product/${product._id}`}>
              <ProductCard key={index} img={product.gallery[0]} title={product.name} price={product.price} currency="$" />
            </Link>
          )
        })}         
        </div>
      </div>
    </div>
  )
}

export default ProductPage
