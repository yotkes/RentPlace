import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { Link, useHistory } from "react-router-dom";
import {
  getProductsOfSubCategory,
  getSubcategories,
} from "../../utils/getGlobalsData";
const { categories, cities } = require("../../globals");

const CreatePost = () => {
  const history = useHistory();
  const [body, setBody] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState("");
  const [category, setCategory] = useState("");
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [city, setCity] = useState("");

  const [loader, setLoader] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems, {});
  }, []);

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title: selectedProductName,
          body,
          photo: url,
          price,
          category,
          subCategory: selectedSubCategory,
          city,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
          } else {
            M.toast({
              html: "Product added to the system",
              classes: "#689f38 light-green darken-2",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const postDetail = () => {
    setLoader("indeterminate");
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

  useEffect(() => {
    // computes new sub categories based on category
    const newSubCategories = getSubcategories(category);
    setAvailableSubCategories(newSubCategories);
    if (newSubCategories.length > 0) {
      setSelectedSubCategory(newSubCategories[0]?.label);
    }
  }, [category]);

  useEffect(() => {
    // computes products based on subcategory
    const newProducts = getProductsOfSubCategory(category, selectedSubCategory);
    setAvailableProducts(newProducts);
    if (newProducts.length > 0) {
      setSelectedProductName(newProducts[0]?.label);
    }
  }, [selectedSubCategory]);

  return (
    <div
      className="card input-file"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div className="input-field col s20 m6">
        <select
          className="browser-default"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          {categories.map((category) => (
            <option value={category.label} key={category.label}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      <div className="input-field col s20 m6">
        <select
          className="browser-default"
          value={selectedSubCategory}
          onChange={(e) => setSelectedSubCategory(e.target.value)}
        >
          {availableSubCategories.map((category) => {
            return (
              <option value={category.label} key={category.label}>
                {category.label}
              </option>
            );
          })}
        </select>
      </div>
      <div className="input-field col s20 m6">
        <select
          className="browser-default"
          value={selectedProductName}
          onChange={(e) => setSelectedProductName(e.target.value)}
        >
          {availableProducts.map((item) => {
            return (
              <option value={item.label} key={item.label}>
                {item.label}
              </option>
            );
          })}
        </select>
        <input
          type="text"
          placeholder="Description"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="input-field col s20 m6">
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          {cities.map((option) => (
            <option value={cities.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="file-field input-field">
        <div className="btn blue darken-1">
          <span>
            <i className="material-icons">add_a_photo</i>
          </span>
          <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect blue darken-1"
        onClick={() => postDetail()}
      >
        Confirm
      </button>
      <div className="progress" style={{ margin: "4% auto" }}>
        <div className={loader}></div>
      </div>
      <div className="divider"></div>
      <div
        style={{ position: "relative", margin: "10px auto", padding: "10px" }}
      >
        <div style={{ position: "absolute", top: "2px", left: "42.8%" }}>
          <Link to="/">
            <button className="btn waves-effect blue darken-1">Back</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
