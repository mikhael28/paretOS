import { I18n } from "@aws-amplify/core";
import React from "react";
import { Link } from "react-router-dom";
import { quotes } from "../libs/quotes";
import logo from "../assets/Pareto_Lockup-01.png";

const randomIndex = Math.floor(Math.random() * Math.floor(quotes.length));

export default function NotFound() {
  return (
    <div className="NotFound">
      <img src={logo} alt="Pareto" height="90" width="360" />
      <h2>Error 404: Component Not Found</h2>
      <br />
      <h4>{quotes[randomIndex].quote}</h4>
      <p>{quotes[randomIndex].author}</p>
      <br />
      <p>
        Click <Link to="/">here</Link> {I18n.get("returnToHome")}
      </p>
    </div>
  );
}
