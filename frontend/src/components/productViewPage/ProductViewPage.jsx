import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthProvider';
import { useParams } from 'react-router-dom';
import { MdArrowDropDown } from "react-icons/md";
import { CartContext } from '../../context/CartContext';

const ProductViewPage = () => {
  const { cartList, setCartList } = useContext(CartContext);
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState('');
  const [authUser] = useAuth(); // Assuming useAuth returns [authUser, setAuthUser]
  const [product, setProduct] = useState({});
  const [image, setImage] = useState([]);
  const [review, setReview] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [newOrder, setNewOrder] = useState({
    product: {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.gallery,
    },
    quantity: quantity,
    size: '',
    color:''
  });
  const navigate = useNavigate();

  useEffect(() => {
  async function getOneProduct() {
    try {
      const response = await fetch(`https://e-commerce-api-mu-blush.vercel.app/product/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      setProduct(data);
      setImage(data.gallery);
      setReview(data.reviews);
      setColor(data.color);
      setSize(data.size);
      setSelectedImage(data.gallery[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }
  getOneProduct();
}, [id])

  useEffect(() => {
    document.title = product.name || 'Product';
  }, [product]);

  const handleCartBtn = async () => {
    try {
      const res = await fetch(`https://e-commerce-api-mu-blush.vercel.app/cart/${authUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: product._id,
          quantity: quantity,
          name: product.name,
          price: product.price,
          image: product.gallery[0]
        }),
      });
      if (res.ok) {
        setCartList(parseInt(cartList)+parseInt(quantity));
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Failed to add to cart', error);
    }
  };

  const handleSizeChange = (event) => {
    setNewOrder(prevOrder => ({
      ...prevOrder,
      size: event.target.value
    }));
  };

  const handleColorChange = (event) => {
    setNewOrder(prevOrder => ({
      ...prevOrder,
      color: event.target.value
    }));
  };


  const handleBuyBtn = () => {
    const order = {
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.gallery
      },
      quantity: quantity,
      size:newOrder.size,
      color:newOrder.color
    }
    sessionStorage.setItem("order",JSON.stringify(order))
  authUser ? navigate("/placeOrder") : navigate("/login")
  };


  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 p-4">
          <img
            src={selectedImage}
            alt={selectedImage}
            className="w-full h-96 rounded-lg shadow-lg"
          />
          <div className="flex mt-4 space-x-1 overflow-x-auto">
            {image.map((i, idx) => (
              <img
                key={idx}
                src={i}
                alt={`Product thumbnail ${idx + 1}`}
                className="w-16 h-16 object-cover relative rounded-lg cursor-pointer border-2 border-gray-300"
                onClick={() => setSelectedImage(i)}
              />
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
          <p className="text-2xl text-second-color mb-4">${product.price}</p>
          <div className="mb-6 text-text2-color flex gap-5 capitalize">
            <p onClick={() => { location.href = "#product-review"; }} className="flex items-center cursor-pointer hover:underline">
              <span>review {review.length}</span><span><MdArrowDropDown size={25} /></span>
            </p>
            <p>
              <span><span className='text-text3-color'>brand: </span>{product.brand}</span>
            </p>
          </div>
          <div className="subD">
            <div className="size">
              <p className="text-xl font-bold mb-1 capitalize">size</p>
              <div className='flex space-x-4 mb-4'>
                {size.map((s, idx) => (
                  <div key={idx} className='capitalize'>
                    <input
                      id={"size" + idx}
                      type="radio"
                      name="size"
                      value={s}
                      checked={newOrder.size === s}
                      onChange={handleSizeChange}
                    />
                    <label htmlFor={"size" + idx}> {s}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="color">
              <p className="text-xl font-bold mb-1 capitalize">color</p>
              <div className='flex space-x-4 mb-4'>
                {color.map((c, idx) => (
                  <div key={idx} className='capitalize'>
                    <input
                      id={"color" + idx}
                      type="radio"
                      name="color"
                      value={c}
                      checked={newOrder.color === c}
                      onChange={handleColorChange}
                    />
                    <label htmlFor={"color" + idx}> {c}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className={`bg-gray-300 hover:bg-gray-400 ${quantity === 1 ? "cursor-not-allowed" : "cursor-pointer"} text-gray-800 px-3 py-2 rounded-lg`}
            >
              -
            </button>
            <span className="text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-lg"
            >
              +
            </button>
          </div>
          <div className="flex space-x-4 items-center">
            <button onClick={handleCartBtn} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg transition duration-300">
              Add to Cart
            </button>
            <button onClick={handleBuyBtn} className="bg-second-color text-white px-8 py-3 rounded-lg transition duration-300">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div id='product-review' className="reviews mb-6 bg-third-color p-5 max-h-[800px] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          <div className="flex flex-col gap-4">
            {review.map((r, idx) => (
              <div key={idx}>
                <p className='text-sm text-gray-600'>{r.name}</p>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="desc bg-third-color p-5">
          <h3 className="text-2xl font-semibold mb-4">Product Details</h3>
          <p className="text-gray-600">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;
