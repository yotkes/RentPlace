import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

const Recommendations = () => {
  const [data, setData] = useState([]);
  const history = useHistory();
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetch("/get-recommendations", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);

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
      <div>
        <div className="flex-container">
          <div className="card-content main-header">
            <h5
              className="headerText"
              style={{ direction: "ltr", marginBottom: "1%" }}
            >
              Recommendations
            </h5>
            <h6
              className="headerText"
              style={{ direction: "ltr", marginBottom: "1%" }}
            >
              Products that you may be interested in
            </h6>
          </div>
          <div className="content">
            <section className="content">
              <div className="recommendations">
                {data.map((item) => {
                  return item ? (
                    <div
                      className="card recommendations-card z-depth-5"
                      key={item._id}
                    >
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
                        <div direction="horizontal">
                          <h6 style={{ float: "left" }}>
                            ₪{item.price ? item.price : 0}
                          </h6>
                          <span
                            className={
                              item.status === "Available"
                                ? "new badge green"
                                : "new badge red"
                            }
                            data-badge-caption={item.status}
                          ></span>
                        </div>

                        <h6>{item.title}</h6>
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
                            <i className="material-icons left">add</i>
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    ""
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Recommendations;
