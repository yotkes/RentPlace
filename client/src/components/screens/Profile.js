import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const [cart, setCart] = useState([]);
  const [loader, setLoader] = useState("");
  let [sum, setSum] = useState(Number);
  const { state, dispatch } = useContext(UserContext);

  const interestsDict = state ? state.interests : {};

  const getValues = () => {
    const v = Object.keys(interestsDict).map((key) => interestsDict[key]);
    const interests = [].concat.apply([], v);
    return interests;
  };

  useEffect(() => {
    setSum(0);
    var elems = document.querySelector("#collapsible");
    M.Collapsible.init(elems, {});
    var elem = document.querySelector(".tabs");
    M.Tabs.init(elem, {});

    fetch("/mypost", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
      });
  }, []);

  useEffect(() => {
    fetch("/mycart", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        var total = 0;
        result.cart.map((item) => {
          total += item && !item.isPurchased ? item.price : 0;
        });
        setSum(total);
        setCart(result.cart);
      });
  }, []);

  const helpNewRentHistory = () => {
    const newCart = cart.filter((item) => {
      return item.isPurchased === false;
    });
    newCart.map((item) => {
      newRentHistory(item);
    });
    pay();
  };

  const newRentHistory = (item) => {
    setLoader("indeterminate");
    fetch("/create-rent-history", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        renterId: item.postedBy,
        renteeId: state._id,
        productName: item.title,
        subcategory: item.subCategory,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status !== "Success") {
          M.toast({ html: result.error, classes: "#b71c1c red darken-4" });
        } else {
          M.toast({
            html: "rentHistory updated",
            classes: "#689f38 light-green darken-2",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeItem = (item) => {
    _removeItem(item, "The product has been removed from cart");
  };

  const returnItem = (item) => {
    _removeItem(item, "Rent has been ended successfully");
  };

  const _removeItem = (item, successMsg) => {
    fetch(`/removeitem/${state._id}`, {
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
            html: successMsg,
            classes: "#689f38 light-green darken-2",
          });
          const newCart = cart.filter((item) => {
            return item._id !== data;
          });
          setCart(newCart);
          var total = 0;
          newCart.map((item) => {
            total += item.isPurchased ? 0 : item.price;
          });
          setSum(total);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const reviewProduct = (item) => {
    let select = document.getElementById("productRank" + item._id);
    let rank = select.options[select.selectedIndex].value;
    fetch(`/review-post`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        productId: item.productId,
        rank,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== "Success") {
          M.toast({ html: res.error, classes: "#b71c1c red darken-4" });
        } else {
          M.toast({
            html: "Product has been ranked",
            classes: "#689f38 light-green darken-2",
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const reviewRenter = (item) => {
    let select = document.getElementById("renterRank" + item._id);
    let rank = select.options[select.selectedIndex].value;
    fetch(`/review-renter`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        userId: item.postedBy,
        rank,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== "Success") {
          M.toast({ html: res.error, classes: "#b71c1c red darken-4" });
        } else {
          M.toast({
            html: "Renter has been ranked",
            classes: "#689f38 light-green darken-2",
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const pay = () => {
    setLoader("indeterminate");
    fetch(`/pay/${state._id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "Success") {
          setSum(0);
          setCart([]);
          window.location.reload();
        } else {
          console.log(result);
        }
        setLoader("determinate");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadImage = (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "rentPlaceProject");
    data.append("cloud_name", "dxgyy6a6u");
    const cloudinaryURL =
      "https://api.cloudinary.com/v1_1/dxgyy6a6u/image/upload";
    fetch(cloudinaryURL, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        fetch("/updatephoto", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            photo: data.url,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            localStorage.setItem(
              "user",
              JSON.stringify({ ...state, photo: result.photo })
            );
            dispatch({ type: "UPDATEPHOTO", payload: result.photo });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div>
          <div
            className="card header"
            style={{ marginLeft: "5%", marginRight: "5%" }}
          >
            <div className="card-content main-header">
              <h5
                className="header"
                style={{ direction: "ltr", marginBottom: "5%" }}
              >
                My Interests
              </h5>
              <ul>
                {getValues().map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div style={{ flexGrow: "1" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <form action="#">
                <div className="file-field input-field add-profile-image">
                  <div className="btn-floating">
                    <i className="material-icons">add</i>
                    <input
                      type="file"
                      onChange={(e) => uploadImage(e.target.files[0])}
                    />
                  </div>
                </div>
              </form>
              <img
                style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "90px",
                }}
                src={
                  state
                    ? state.photo
                    : "https://www.regionalsan.com/sites/main/files/imagecache/lightbox/main-images/vacant_placeholder.gif"
                }
                alt="_blank"
              />
            </div>
            <div>
              <h5>{state ? state.name : "loading"}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>Posts: {mypics.length} </h6>
                <h6>
                  My Score:{" "}
                  {state
                    ? state.renterScore
                      ? state.renterScore.toFixed(2)
                      : "0"
                    : "0"}
                </h6>
              </div>
            </div>
          </div>

          <ul id="tabs-swipe-demo" className="tabs tabs-fixed-width">
            <li className="tab col s3">
              <a className="active" href="#test-swipe-1">
                My Products
              </a>
            </li>
            <li className="tab col s3">
              <a href="#test-swipe-2">Shopping Cart</a>
            </li>
            <li className="tab col s3">
              <a href="#test-swipe-3">Purchased Products</a>
            </li>
          </ul>
          <div id="test-swipe-1" className="col s12">
            <div className="gallery">
              {mypics.map((item) => {
                return (
                  <div key={item._id} className="card profile hoverable">
                    <div className="card-image waves-effect waves-block waves-light">
                      <img
                        className="activator"
                        src={item.photo}
                        alt={item.title}
                      />
                    </div>
                    <div className="card-content">
                      <span className="card-title activator">
                        {item.title}
                        <i className="material-icons right">more_vert</i>
                      </span>
                      <p>
                        <a
                          href={item.photo}
                          target="_blank"
                          className="btn waves-effect waves-light"
                        >
                          photo
                        </a>
                      </p>
                    </div>
                    <div className="card-reveal">
                      <span className="card-title">
                        {item.title}
                        <i className="material-icons right">close</i>
                      </span>
                      <p>{item.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div id="test-swipe-2" className="col s12">
            <div id="cardPanel" className="card-panel right black-text">
              <div id="collapsible" className="collapsible-header right ">
                <i className="material-icons">shopping_cart</i>
                Shopping Cart
                <span className="new badge green">{cart.length}</span>
              </div>
              <table className="centered">
                <thead>
                  <tr>
                    <th>Price</th>
                    <th>Product Name</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    if (!item.isPurchased)
                      return (
                        <tr key={item._id}>
                          <td>₪{item ? item.price : 0}</td>
                          <td>{item ? item.title : ""}</td>
                        </tr>
                      );
                  })}
                </tbody>
              </table>
              <p style={{ direction: "rtl" }}>
                Total to pay: ₪{sum}
                <br />
              </p>
              <div className={loader === "determinate" ? "" : "progress"}>
                <div className={loader}></div>
              </div>
              <button
                className="btn waves-effect  light-blue darken-4"
                onClick={() => helpNewRentHistory()}
              >
                Pay
              </button>
            </div>
            <div className="gallery">
              {cart.map((item) => {
                if (item && !item.isPurchased) {
                  sum += item.price;
                  return (
                    <div key={item._id} className="card profile hoverable">
                      <a className="btn-floating halfway-fab waves-effect waves-light red absolute">
                        <i
                          className="material-icons"
                          onClick={() => {
                            removeItem(item);
                          }}
                        >
                          remove
                        </i>
                      </a>
                      <div className="card-image waves-effect waves-block waves-light">
                        <img
                          className="activator"
                          src={item.photo}
                          alt={item.title}
                        />
                      </div>
                      <div className="card-content">
                        <span className="card-title activator grey-text text-darken-4">
                          {item.title}
                          <i className="material-icons right">more_vert</i>
                        </span>
                        <p>
                          <a href={item.photo}>photo</a>
                        </p>
                        <h6 style={{ float: "left" }}>
                          ₪{item.price ? item.price : 0}
                        </h6>
                      </div>
                      <div className="card-reveal">
                        <span className="card-title grey-text text-darken-4">
                          {item.title}
                          <i className="material-icons right">close</i>
                        </span>
                        <p>{item.body}</p>
                      </div>
                    </div>
                  );
                } else {
                  return "";
                }
              })}
            </div>
          </div>
          <div id="test-swipe-3" className="col s12">
            <div className="gallery">
              {cart.map((item) => {
                if (item && item.isPurchased)
                  return (
                    <div key={item._id} className="card profile hoverable">
                      <div className="card-image waves-effect waves-block waves-light">
                        <img
                          className="activator"
                          src={item.photo}
                          alt={item.title}
                        />
                      </div>
                      <div className="card-content">
                        <span className="card-title activator">
                          {item.title}
                          <i className="material-icons right">more_vert</i>
                        </span>

                        <div
                          className="input-field col s1.5"
                          style={{ margin: "0%", display: "inline-block" }}
                        >
                          <select
                            id={"productRank" + item._id}
                            className="browser-default"
                          >
                            <option value="1"> 1 </option>
                            <option value="2"> 2 </option>
                            <option value="3"> 3 </option>
                            <option value="4"> 4 </option>
                            <option value="5"> 5 </option>
                            <option value="6"> 6 </option>
                            <option value="7"> 7 </option>
                            <option value="8"> 8 </option>
                            <option value="9"> 9 </option>
                            <option value="9"> 10 </option>
                          </select>
                        </div>
                        <button
                          style={{ lineHeight: "normal" }}
                          className="btn waves-effect waves-light"
                          onClick={() => reviewProduct(item)}
                        >
                          Rank Product
                        </button>
                        <div
                          className="input-field col s1.5"
                          style={{ margin: "0%", display: "inline-block" }}
                        >
                          <select
                            id={"renterRank" + item._id}
                            className="browser-default"
                          >
                            <option value="1"> 1 </option>
                            <option value="2"> 2 </option>
                            <option value="3"> 3 </option>
                            <option value="4"> 4 </option>
                            <option value="5"> 5 </option>
                            <option value="6"> 6 </option>
                            <option value="7"> 7 </option>
                            <option value="8"> 8 </option>
                            <option value="9"> 9 </option>
                            <option value="9"> 10 </option>
                          </select>
                        </div>
                        <button
                          style={{ lineHeight: "normal" }}
                          className="btn waves-effect waves-light"
                          onClick={() => reviewRenter(item)}
                        >
                          Rank Renter
                        </button>
                        <br></br>
                        <br></br>
                        <button
                          className="btn waves-effect waves-light red absolute"
                          style={{ lineHeight: "normal" }}
                          onClick={() => {
                            returnItem(item);
                          }}
                        >
                          End Rent
                        </button>
                      </div>

                      <div className="card-reveal">
                        <span className="card-title">
                          {item.title}
                          <i className="material-icons right">close</i>
                        </span>
                        <p>{item.body}</p>
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
