import React, { useState } from "react";
import { HeaderMain, Logo, Menu, MenuToggle } from "../styles/HeaderStyle";
import { useDispatch, useSelector } from "react-redux";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { logout } from "../reducer/authSlice";

const UserHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const userId = useSelector((state) => state.auth.user);
  return (
    <HeaderMain>
      <Logo>
        <img src="src/assets/letter-s.png"  width="50px" alt="logo" />
      </Logo>

      {isAuthenticated ? (
        <>
          <MenuToggle onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </MenuToggle>

          <Menu $isOpen={isOpen}>
            <NavLink to="/userdashboard" onClick={() => setIsOpen(false)}>
              Home
            </NavLink>

            <NavLink
              to={`/examreport/${userId}`}
              onClick={() => setIsOpen(false)}
            >
              Report
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

export default UserHeader;
