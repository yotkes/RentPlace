import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { Link, useHistory } from "react-router-dom";
import {
  getProductsOfSubCategory,
  getSubcategories,
} from "../../utils/getGlobalsData";

const { categories, cities } = require("../../globals");

const CreateRequest = () => {
  const history = useHistory();
  const [loader, setLoader] = useState("");
  const [category, setCategory] = useState("");
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState("");

  useEffect(() => {
    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems, {});
  }, []);

  const postDetail = () => {
    setLoader("indeterminate");
    fetch("/createrequest", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        productName: selectedProductName,
        category,
        subcategory: selectedSubCategory,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
        } else {
          M.toast({
            html: "A new request has been added to the system",
            classes: "#689f38 light-green darken-2",
          });
          history.push("/");
        }
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
      </div>
      <button
        className="btn waves-effect blue darken-1"
        onClick={() => postDetail()}
      >
        Request
      </button>
      <div className="progress" style={{ margin: "4% auto" }}>
        <div className={loader}></div>
      </div>
      <div className="divider"></div>
      <div
        style={{ position: "relative", margin: "10px auto", padding: "10px" }}
      >
        <div style={{ position: "absolute", top: "2px", left: "43%" }}>
          <Link to="/">
            <button className="btn waves-effect blue darken-1">Back</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
