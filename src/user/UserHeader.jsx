import React, { useState } from 'react'
import { HeaderMain, Logo, Menu, MenuToggle } from '../styles/HeaderStyle'
import { useDispatch, useSelector } from 'react-redux';
import { FaBars, FaTimes } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { logout } from '../reducer/authSlice';


const UserHeader = () => {
     const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role);
  console.log("role",role);
  return (
    <HeaderMain>
        <Logo>
                
                <img src="/public/apple-touch-icon.png" width={"50px"} alt="" />
              </Logo>
              <MenuToggle onClick={() => setIsOpen(!isOpen)}>
                          {isOpen ? <FaTimes /> : <FaBars />}
                        </MenuToggle>
           <Menu $isOpen={isOpen}>
      <NavLink to="/userdashboard" onClick={() => setIsOpen(false)}>
              Home
      </NavLink>
     <NavLink to="" onClick={() => setIsOpen(false)}>
        Manage Question
      </NavLink>
      <NavLink to="" onClick={() => setIsOpen(false)}>
        Add User
      </NavLink>
     <NavLink
              to="/"
              onClick={async (e) => {
                setIsOpen(false);
                e.preventDefault();
                setLoading(true);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setLoading(false);
                dispatch(logout());
              }}
            >
              {loading ? "Signing out..." : "Sign Out"}
        </NavLink>
  </Menu>               
    </HeaderMain>
  )
}

export default UserHeader
