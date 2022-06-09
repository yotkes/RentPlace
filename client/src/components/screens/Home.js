import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Recommendations from "./Recommendations";
import Search from "./Search";
import MostWanted from "./MostWanted";

const Home = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState("");
  const { state } = useContext(UserContext);

  useEffect(() => {
    setLoader("indeterminate");
    var elems = document.querySelectorAll("select");
    M.FormSelect.init(elems, {});

    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
        setLoader("determinate");
      });
  }, []);

  return (
    <div className="row">
      <div className="col s3" direction="vertical">
        <div>
          <img
            style={{ width: "350px", marginBlock: "20px" }}
            src="https://i.ibb.co/CKB067Z/homeLogo.png"
            alt="_blank"
          ></img>
        </div>
        <div className="divider"></div>
        <div
          className="card header"
          style={{ marginLeft: "5%", marginRight: "5%" }}
        >
          <div className="card">
            <div className="card-content main-header">
              <MostWanted></MostWanted>
              <h5
                className="headerText"
                style={{ direction: "ltr", marginBottom: "5%" }}
              ></h5>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div>
          <Link to="/createrequest">
            <button
              className="btn waves-effect blue darken-1"
              style={{ left: "35%" }}
            >
              Request
            </button>
          </Link>
        </div>
      </div>
      <div className="col s9">
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className="card header" style={{ marginBlock: "20px" }}>
                <Recommendations />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Search />
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default Home;
