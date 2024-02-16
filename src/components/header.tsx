import { useState } from "react";
import {  FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";



interface PropsType{
   user:User|null
}

const Header = ({user}:PropsType) => {

  const [isOpen, setIsOpen] = useState(false);
   
  const handleToggleDiaglog = () => {
       setIsOpen((prev) => !prev);
  }
  const handleCloseDialog =() =>{
    setIsOpen(false);
  }
  const logoutHandler = async () => {
//    temp
      try {
          await signOut(auth);
          toast.success("Sign Out Successfully");
          setIsOpen(false);
      } catch (error) {
          toast.error("Something went wrong");
      }
  }
  return ( 
 <nav className="header">
     <Link onClick={handleCloseDialog} to = "/"> Home </Link>
     <Link onClick={handleCloseDialog} to = "/search"> <FaSearch /> </Link>
     <Link onClick={handleCloseDialog} to = "/cart"> <FaShoppingBag /> </Link>
     {
        user?._id ?(
        <>
         <button onClick={handleToggleDiaglog}>
            <FaUser />
         </button>
         <dialog open={isOpen}>
            <div>
                {
                    user.role === "admin" && (
                        <Link onClick={handleCloseDialog} to ="/admin/dashboard"> Admin</Link>
                    )
                }
                <Link onClick={handleCloseDialog} to ="/orders">
                 Orders
                </Link>
                <button onClick={logoutHandler} ><FaSignOutAlt /></button>
            </div>
         </dialog>
        </>
             )  : (
                <Link onClick={handleCloseDialog} to = "/login"> <FaSignInAlt /> </Link>
             )
     }
  </nav>
  );
};

export default Header;
