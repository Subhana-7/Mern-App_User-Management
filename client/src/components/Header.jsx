import React from "react";
import { Link } from "react-router-dom";
import {useSelector} from 'react-redux'

const Header = () => {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <div className="bg-cyan-300">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-5">
        <Link to="/">
          <h1 className="main-heading">User Management</h1>
        </Link>
        <ul className="flex gap-4">
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/about">
            <li>About</li>
          </Link>
          {currentUser ? (
            <Link to='/profile' >
            <img src={currentUser.profilePicture} alt="profile"  className="h-7 w-7 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2 transition-all duration-200 hover:ring-purple-500" />
            </Link>
          )
          :(
            <Link to="/sign-in">
            <li>Sign in</li>
          </Link>
          )}
          
        </ul>
      </div>
    </div>
  );
};

export default Header;
