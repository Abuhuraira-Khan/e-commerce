import React, { useEffect, useState } from 'react'
import {ProductCard} from '../productCard/ProductCard'
import { Link, useParams } from 'react-router-dom';

const SearchProducts = () => {


  const [productList, setProductList] = useState([]);

  const {search} = useParams();

useEffect(() => {
  async function getSearchProduct(){
    const response = await fetch(`https://e-commerce-server-bwda.onrender.com/products/${search}`);
    const data = await response.json();
    console.log(data)
    setProductList(data);
  }
  getSearchProduct();
}, [search])




  return (
    <div className='productPage container xl:mx-auto flex gap-3 p-1 capitalize'>
      <div className="sideBar w-[27%] py-5">
        <div className="sideBar-wrapper border border-second-color rounded-md p-2">
          <section className='sec-1 mb-3'>
            <h2 className=' border-b-2 text-xl font-medium p-1'>category</h2>
            <div className=''>
              <ul>
                <li><label htmlFor="c-1"><input id='c-1' type='checkbox'/> fashion</label></li>
                <li><label htmlFor="c-2"><input id='c-2' type='checkbox'/> gadget</label></li>
                <li><label htmlFor="c-3"><input id='c-3' type='checkbox'/> gym</label></li>
                <li><label htmlFor="c-4"><input id='c-4' type='checkbox'/> grocery</label></li>
              </ul>
            </div>
          </section>

          <section className='sec-2 mb-3'>
            <h2 className=' border-b-2 text-xl font-medium p-1'>Price</h2>
            <div className=''>
              <ul>
                <li><label htmlFor="p-1"><input id='p-1' type='checkbox'/> $100</label></li>
                <li><label htmlFor="p-2"><input id='p-2' type='checkbox'/> $500</label></li>
                <li><label htmlFor="p-3"><input id='p-3' type='checkbox'/> $1000</label></li>
              </ul>
            </div>
          </section>

          <section className='sec-3 '>
            <h2 className=' border-b-2 text-xl font-medium p-1'>Brand</h2>
            <div className=''>
              <ul>
                <li><label htmlFor="b-1"><input id='b-1' type='checkbox'/> zara </label></li>
                <li><label htmlFor="b-2"><input id='b-2' type='checkbox'/> easy</label></li>
                <li><label htmlFor="b-3"><input id='b-3' type='checkbox'/> adidas</label></li>
                <li><label htmlFor="b-4"><input id='b-4' type='checkbox'/> puma</label></li>
              </ul>
            </div>
          </section>
        </div>
      </div>
      <div className="section w-full p-2">
        <div className="section-wrapper grid grid-cols-2 md:grid-cols-3 gap-4">
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

export default SearchProducts
