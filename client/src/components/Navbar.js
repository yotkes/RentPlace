import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

const NavBar = () => {
  const searchModel = useRef(null);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  
  useEffect(() => {
    let sidenav = document.querySelector(".sidenav");
    M.Sidenav.init(sidenav, {});
    M.Modal.init(searchModel.current);
  }, []);

  const renderList = () => {
    if (state) {
      return [
        <li  key={1}>
          <Link to="/profile">Profile</Link>
        </li>,
        <li  key={2}>
          <Link to="/createpost">Add New Product</Link>
        </li>,
        <li  key={3}>
        <Link to="/createrequest">Request New Product</Link>
      </li>,
        <li  key={4}>
          <Link to="/reset">Reset Password</Link>
        </li>,
        <li  key={5}>
          <button
            className="btn waves-effect"
            
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key={4}>
          <Link to="/signin">Login</Link>
        </li>,
        <li key={5}>
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper blue-grey  lighten-1">
        <Link
          to={state ? "/" : "/signin"}
          className="brand-logo right"
          style={{ marginRight: "3%",
                  merginBottom: "20%"}}
        >
          <img style={{width:"130px"}} src="https://i.ibb.co/Xj7gG50/logoBG.png" alt="_blank" ></img>
        </Link>
        <a href="#" className="sidenav-trigger" data-target="mobile-links">
          <i className="material-icons">menu</i>
        </a>
        <ul id="nav-mobile" className="left hide-on-med-and-down">
          {renderList()}
        </ul>
        <ul id="mobile-links" className="sidenav">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
