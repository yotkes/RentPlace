import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const { categories } = require("../../globals");

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [phone, setPhone] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    let elems = document.querySelectorAll("select");
    let instances = M.FormSelect.init(elems, {});
  }, []);

  useEffect(() => {
    if (photo !== "") {
      uploadPhoto();
    }
  }, [photo]);

  const uploadPhoto = () => {
    const data = new FormData();
    data.append("file", photo);
    data.append("upload_preset", "rentPlaceProject");
    const cloudinaryURL =
      "https://api.cloudinary.com/v1_1/dxgyy6a6u/image/upload";
    fetch(cloudinaryURL, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getInterestsFromDocument = () => {
    const interests = {};
    const checkboxes = document.querySelectorAll(".category-checkboxes");
    const checked = [...checkboxes].filter((checkbox) => {
      const input = checkbox.children[0];
      return input.checked ? checkbox : undefined;
    });
    checked.map((item) => {
      const subCategoryName = item.children[1].childNodes[0].textContent;
      const megaCategoryName = item.children[2].childNodes[0].textContent;
      if (interests.hasOwnProperty(megaCategoryName)) {
        interests[megaCategoryName].push(subCategoryName);
      } else {
        interests[megaCategoryName] = [subCategoryName];
      }
    });
    return interests;
  };

  const uploadFields = () => {
    const interests = getInterestsFromDocument();

    if (!name) {
      M.toast({ html: "Invalid username", classes: "#b71c1c red darken-4" });
      return;
    }

    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({
        html: "Invalid email address",
        classes: "#b71c1c red darken-4",
      });
      return;
    }

    if (!password) {
      M.toast({ html: "Invalid password", classes: "#b71c1c red darken-4" });
      return;
    }

    if (!phone) {
      M.toast({
        html: "Invalid phone number",
        classes: "#b71c1c red darken-4",
      });
      return;
    }

    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        photo: url,
        phone: "+972" + parseInt(phone, 10),
        interests: interests,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
        } else {
          M.toast({
            html: data.message,
            classes: "#689f38 light-green darken-2",
          });
          history.push("./signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const PostData = () => {
    uploadFields();
  };

  const CategoryDropdown = ({ category }) => {
    return (
      <div>
        <h6>{category.label}</h6>
        <div>
          {category.subCategories
            .filter((subCategory) => subCategory.label !== "Select SubCategory")
            .map((subCategory) => {
              return (
                <label className={"category-checkboxes"}>
                  <input type="checkbox" className="filled-in" />
                  <span>{subCategory.label}</span>
                  <span style={{ display: "none" }}>{category.label}</span>
                  <p> </p>
                </label>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="mycard">
        <div className="card auth-card ">
          <img
            style={{ width: "150px" }}
            src="https://i.ibb.co/m8BzTYg/logo.png"
            alt="_blank"
          ></img>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Cellphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="validate"
          />
          <div className="file-field input-field">
            <div className="btn blue darken-1">
              <span>
                <i className="material-icons">add_a_photo</i>
              </span>
              <input
                type="file"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <h6>
            Choose your personal interests so we can get to know you better
          </h6>
          <div className="results">
            {categories
              .filter((item) => item.label !== "Select Category")
              .map((category) => (
                <div className="col">
                  <CategoryDropdown category={category} />
                </div>
              ))}
          </div>

          <button
            className="btn waves-effect  light-blue darken-4"
            onClick={() => PostData()}
          >
            Signup
          </button>
          <h5>
            <Link to="/signin">Do You Have An Acount?</Link>
          </h5>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signup;
