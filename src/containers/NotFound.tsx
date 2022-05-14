import { I18n } from "@aws-amplify/core";
import { Link } from "react-router-dom";
import getRandomQuote from "../libs/quotes";
import logo from "../assets/Pareto_Lockup-01.png";

const { quote, author } = getRandomQuote();

export default function NotFound() {
  return (
    <div className="NotFound">
      <img src={logo} alt="Pareto" height="90" width="360" />
      <h2>Error 404: Component Not Found</h2>
      <br />
      <h4>{quote}</h4>
      <p>{author}</p>
      <br />
      <p>
        Click <Link to="/">here</Link> {I18n.get("returnToHome")}
      </p>
    </div>
  );
}
