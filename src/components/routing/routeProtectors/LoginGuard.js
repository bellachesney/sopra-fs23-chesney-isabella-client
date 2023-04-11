import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

/**
 *
 * Another way to export directly your functional component.
 */
export const LoginGuard = (props) => {
  if (localStorage.getItem("token") === null) {
    return props.children;
  } else if (typeof localStorage.getItem("token") === String) {
    if (localStorage.getItem("token") === "null") {
      return props.children;
    }
  }
  // if user is already logged in, redirects to the main /app
  return <Redirect to="/game" />;
};

LoginGuard.propTypes = {
  children: PropTypes.node,
};
