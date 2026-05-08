import React, { useState } from "react";
import { HeaderMain, Menu, MenuToggle } from "../styles/HeaderStyle";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { logout } from "../reducer/authSlice";
import { useDispatch, useSelector } from "react-redux";
import NaviButton from "./NavigateButton";
import UserHeader from "../user/UserHeader";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  console.log("role ", role);

  if (role !== "SPX_ADMIN") {
    return <UserHeader />;
  }

  return (
    <HeaderMain>
      <div style={{ display: "flex", columnGap: "30px", alignItems: "center" }}>
        <img src="/letter-s.png" width="50px" alt="S" />
      </div>

      {isAuthenticated ? (
        <>
          {" "}
          <MenuToggle onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </MenuToggle>
          <Menu $isOpen={isOpen}>
            <NavLink to="/admin-home" onClick={() => setIsOpen(false)}>
              Home
            </NavLink>

            <NavLink to="/show-all-topic" onClick={() => setIsOpen(false)}>
              Manage Questions
            </NavLink>

            <NavLink to="/add-user" onClick={() => setIsOpen(false)}>
              Add User
            </NavLink>

            <NavLink to="/creat-exam" onClick={() => setIsOpen(false)}>
              Create Assessment
            </NavLink>

            <NavLink to="/topic-master" onClick={() => setIsOpen(false)}>
              Topic Master
            </NavLink>

             <NavLink to="/add-admin" onClick={() => setIsOpen(false)}>
              Add Admin
            </NavLink> 
            <NavLink to="/users" onClick={() => setIsOpen(false)}>
              Users
            </NavLink> 

            <NavLink
              to="/"
              onClick={async (e) => {
                e.preventDefault();
                setIsOpen(false);
                setLoading(true);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setLoading(false);
                dispatch(logout());
              }}
            >
              {loading ? "Signing out..." : "Sign Out"}
            </NavLink>
          </Menu>
        </>
      ) : null}
    </HeaderMain>
  );
};

export default Header;
