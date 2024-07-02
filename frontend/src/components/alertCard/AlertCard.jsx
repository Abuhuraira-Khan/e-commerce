// import React, { useState } from 'react';
// import { XCircleIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/solid';

// const AlertCard = ({ type, message, display }) => {
//   const [visible, setVisible] = useState(true);

//   const alertStyles = {
//     success: 'bg-green-100 border-green-500 text-green-700',
//     error: 'bg-red-100 border-red-500 text-red-700',
//     warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
//     info: 'bg-blue-100 border-blue-500 text-blue-700',
//   };

//   const iconStyles = {
//     success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
//     error: <XCircleIcon className="h-6 w-6 text-red-500" />,
//     warning: <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />,
//     info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
//   };

//   const handleClose = () => {
//     setVisible(false);
//   };

//   return (
//     visible && (
//       <div className={`fixed top-0 left-0 right-0 z-50 ${display} flex items-center justify-between p-4 ${alertStyles[type]}`}>
//         <div className="flex items-center">
//           <div className="mr-3">
//             {iconStyles[type]}
//           </div>
//           <div>
//             <p className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
//             <p>{message}</p>
//           </div>
//         </div>
//         <button className="text-gray-600 hover:text-gray-800" onClick={handleClose}>
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//           </svg>
//         </button>
//       </div>
//     )
//   );
// };

// export default AlertCard;
