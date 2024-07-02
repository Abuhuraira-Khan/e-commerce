import React, { useRef } from 'react';

const LoginPage = () => {

  // signUp code

  const sUserNameRef = useRef(null);
  const sEmailRef = useRef(null);
  const sPasswordRef = useRef(null);

  const handleSignUp = async () => {
    // Validate inputs before making the request
    if (sUserNameRef.current.value.length === 0 || sEmailRef.current.value.length === 0 || sPasswordRef.current.value.length === 0) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const response = await fetch("https://e-commerce-server-bwda.onrender.com/user/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: sUserNameRef.current.value,
          email: sEmailRef.current.value,
          password: sPasswordRef.current.value
        }),
      });

      const result = await response.json();
      console.log(result)
      console.log(response.data)

      if (response.ok) {
        alert("User created successfully");
        sUserNameRef.current.value = "";
        sEmailRef.current.value = "";
        sPasswordRef.current.value = "";

        localStorage.setItem("User", JSON.stringify(result.data))
        history.back()

      } else {
        alert(`User creation failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during user creation");
    }
  };


  // login code
  const lEmailRef = useRef(null)
  const lPasswordRef = useRef(null)
  const handleLogin = async ()=>{

   const response = await fetch("https://e-commerce-server-bwda.onrender.com/user/login",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: lEmailRef.current.value,
              password: lPasswordRef.current.value
            })
      });
      const data = await response.json();
        if(response.ok){
          alert(`logged in successfully ${data.message}`)
          localStorage.setItem("User", JSON.stringify(data.user))
          history.back()

        }
        else{
          alert(`wrong credentials ${ data.message}`)
        }
    }




  return (
    <div className="container mx-auto my-10 flex flex-col gap-5 lg:flex-row lg:gap-0">
      {/* Left Side - Login */}
      <div className="w-full bg-third-color flex flex-col justify-center items-center p-8 duration-200 hover:bg-second-color">
        <h2 className="text-3xl font-bold mb-4">Login</h2>
        <form className="w-full max-w-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Lemail">
              Email
            </label>
            <input 
            ref={lEmailRef}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="Lemail" 
              type="email" 
              placeholder="Enter your email" 
              required={true}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Lpassword">
              Password
            </label>
            <input 
            ref={lPasswordRef}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
              id="Lpassword" 
              type="password" 
              placeholder="Enter your password"
              required={true}
            />
          </div>
          <div className="flex items-center justify-between">
            <button onClick={handleLogin}
              className=" bg-gray-600 border border-gray-600 hover:bg-transparent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="button"
            >
              Login
            </button>
          </div>
        </form>
      </div>

      {/* Right Side - Sign Up */}
      <div className="w-full bg-third-color flex flex-col justify-center items-center p-8 duration-200 hover:bg-second-color">
        <h2 className="text-3xl font-bold mb-4">Sign Up</h2>
        <form className="w-full max-w-md">
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input 
            ref={sUserNameRef}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline" 
              id="username" 
              type="text" 
              placeholder="Enter your username"
              required={true} 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input 
            ref={sEmailRef}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline" 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              required={true}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input 
            ref={sPasswordRef}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              required={true}
            />
          </div>
          <div className="flex items-center justify-between">
            <button onClick={handleSignUp}
              className="hover:bg-gray-600 border border-gray-600 bg-transparent text-black hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="button"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
