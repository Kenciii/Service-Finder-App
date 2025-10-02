import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Login } from "../assets";
import { SignUp } from "../components";

const Auth = () => {
  const {user} = useSelector((state)=> state.user) 
  const [open,setOpen] = useState(true);  
  const location = useLocation()

  let from = location?.state?.from?.path?.pathname || "/";


  return (
    
    <div className='w-full'>
      <img src ={Login} alt ='Login' className ='object-contain' />
    <SignUp open={open} setOpen={setOpen} />
    
    </div>
  )
}

export default Auth