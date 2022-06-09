import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  getProductsOfSubCategory,
  getSubcategories,
} from "../../utils/getGlobalsData";

const { categories, cities, priceRange } = require("../../globals");

const Search = () => {
  const [category, setCategory] = useState("");
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [city, setCity] = useState("");
  const [price, setPriceRange] = useState("");
  const [data, setData] = useState([]);

  const [loader, setLoader] = useState("");
  const history = useHistory();
  const { state } = useContext(UserContext);

  useEffect(() => {
    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems, {});
    M.FormSelect.init(elems, {});
  }, []);

  useEffect(() => {
    setLoader("indeterminate");

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

  const fetchPosts = () => {
    setLoader("indeterminate");

    fetch("/search-post", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        userId: state._id,
        category,
        subcategory: selectedSubCategory,
        productName: selectedProductName,
        priceRange,
        city,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.results);
        setLoader("determinate");
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

  const isItemFiltered = (val) => {
    if (!priceRange) {
      return true;
    } else {
      return true;
    }
  };

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  const clickOnImage = (id) => {
    var elem = document.getElementById(id);
    var instance = M.Materialbox.init(elem, {});
    instance.open();
  };

  const addProductToBag = (item) => {
    fetch(`/addtobag/${state._id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        item,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
        } else {
          M.toast({
            html: "Added to cart",
            classes: "#689f38 light-green darken-2",
          });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      <h5
        className="headerText"
        style={{ direction: "ltr", marginBottom: "2%" }}
      >
        What would you like to rent?
      </h5>
      <div className="flex-container" direction="vertical">
        <section className="content" height="30px">
          <div
            className="input-field col s2.5"
            style={{ margin: "0%", display: "inline-block" }}
          >
            <select
              className="browser-default"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((category) => {
                return (
                  <option value={category.label} key={category.label}>
                    {category.label}
                  </option>
                );
              })}
            </select>
          </div>
          <div
            className="input-field col s2.5"
            style={{ margin: "0%", display: "inline-block" }}
          >
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
          <div
            className="input-field col s2.5"
            style={{ margin: "0%", display: "inline-block" }}
          >
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
          <div
            className="input-field col s1.5"
            style={{ margin: "0%", display: "inline-block" }}
          >
            <select
              className="browser-default"
              value={price}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              {priceRange.map((option) => (
                <option value={priceRange.value} key={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div
            className="input-field col s2"
            style={{ margin: "0%", display: "inline-block" }}
          >
            <select
              className="browser-default"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {cities.map((option) => (
                <option value={cities.value} key={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="btn-floating">
            <i className="material-icons" onClick={() => fetchPosts()}>
              search
            </i>
          </div>
        </section>

        <div className={loader === "determinate" ? "" : "progress"}>
          <div className={loader}></div>
        </div>
        <section className="content">
          <div className="results">
            {data.map((item) => {
              return item && isItemFiltered(item) ? (
                <div className="card results-card z-depth-5" key={item._id}>
                  <div className="cart-title">
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50px",
                        margin: "7px",
                      }}
                      src={item.postedBy ? item.postedBy.photo : ""}
                      alt=""
                      className="circle"
                    />
                    <h5>{item.postedBy.name}</h5>
                    {item.postedBy._id === state._id && (
                      <i
                        className="material-icons"
                        style={{ float: "right", marginRight: "80px" }}
                        onClick={() => deletePost(item._id)}
                      >
                        delete
                      </i>
                    )}
                  </div>
                  <div className="card-image">
                    <img
                      id={item._id}
                      className="materialboxed"
                      src={item.photo}
                      alt="_blank"
                      onClick={() => {
                        clickOnImage(item._id);
                      }}
                    />
                  </div>
                  <div className="card-content">
                    <h5 style={{ float: "right" }}>
                      ₪{item.price ? item.price : 0}
                    </h5>
                    <span
                      className={
                        item.status === "Available"
                          ? "new badge green"
                          : "new badge red"
                      }
                      data-badge-caption={item.status}
                    ></span>
                    <h5>{item.title}</h5>
                    <p>
                      {item.category} / {item.subCategory}
                    </p>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        addProductToBag(item);
                      }}
                    >
                      <button
                        className="btn waves-effect waves-light"
                        type="submit"
                        name="action"
                      >
                        Add to Bag
                        <i className="material-icons left">add</i>
                      </button>
                    </form>
                    <div>
                      <i
                        className="material-icons"
                        style={{ float: "left", merginLeft: "10px" }}
                      >
                        star
                      </i>
                      <h5>{item.popularityScore.toFixed(2)}</h5>
                      <p style={{ marginRight: "10px" }}>{item.city}</p>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              );
            })}
          </div>
        </section>
      </div>
    </React.Fragment>
  );
};

export default Search;
