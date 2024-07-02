import React from 'react'

export const ProductCard = ({img,title,price,}) => {

    return (
        <div>
            <div className="new-item p-4 hover:scale-105 duration-200">
                    <img src={img} alt="New Product" className="w-full h-64 object-cover mb-4 rounded-lg" />
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="text-gray-600"><span>$</span>{price}</p>
            </div>
        </div>
    )
}




// /assets/Images/i-1.jpeg