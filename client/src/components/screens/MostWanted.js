import React, { useState, useEffect } from "react";

const MostWanted = () => {
  const [mostWantedList, setMostWantedList] = useState([]);

  useEffect(() => {
    fetch("/mostwanted", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setMostWantedList(result.result);
      });
  }, []);

  if (mostWantedList === []) {
    return (
      <React.Fragment>
        <div
          style={{
            maxWidth: "1000px",
            margin: "0px auto",
            verticalAlign: "top",
          }}
        >
          <thead>
            <th style={{ textAlign: "center" }}>No Data</th>
          </thead>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div
        style={{ maxWidth: "1000px", margin: "0px auto", verticalAlign: "top" }}
      >
        <h6>Top-5 Most Wanted Products</h6>
        <ul>
          {mostWantedList.map((product) => (
            <li key={product}>{product}</li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
};

export default MostWanted;
