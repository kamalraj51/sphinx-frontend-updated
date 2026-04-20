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
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role);

  return (
    <HeaderMain>
      <div style={{ display: "flex", columnGap: "30px", alignItems: "center" }}>
        {/* FIX: correct path */}
        <img src="/apple-touch-icon.png" width="50px" alt="" />
        <NaviButton />
      </div>

      {isAuthenticated ? (
        role === "admin" ? (
          <>
            <MenuToggle onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </MenuToggle>

            <Menu $isOpen={isOpen}>
              <NavLink to="/adminhome" onClick={() => setIsOpen(false)}>
                Home
              </NavLink>

              <NavLink to="/show-all-topic" onClick={() => setIsOpen(false)}>
                Manage Question
              </NavLink>

              <NavLink to="/create-user" onClick={() => setIsOpen(false)}>
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
        ) : (
          <UserHeader />
        )
      ) : null}
    </HeaderMain>
  );
};

export default Header;