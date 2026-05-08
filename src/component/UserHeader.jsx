import React, { useState } from "react";
import { HeaderMain, Logo, Menu, MenuToggle } from "../styles/HeaderStyle";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { RegisterButton } from "../styles/SignupStyle";
import { logout } from "../reducer/authSlice";
import { useDispatch, useSelector } from "react-redux";
import NaviButton from "./NavigateButton";

const UserHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <HeaderMain>
      <div style={{ display: "flex", columnGap: "30px", alignItems: "center" }}>
        <img src="src/assets/letter-s.png"  width={"50px"} alt="S" />
        
      </div>
      {isAuthenticated ? (
        <>
          <MenuToggle onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </MenuToggle>

          <Menu $isOpen={isOpen}>
            <NavLink to="/admin-home" onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/show-all-topic" onClick={() => setIsOpen(false)}>
              Manage Question
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
            <NavLink to="/add-admin">Add Admin</NavLink>
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
        </>
      ) : null}
    </HeaderMain>
  );
};

export default UserHeader;
