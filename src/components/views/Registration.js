import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { Link, useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Registration.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <div className="registration field">
      <label className="registration label">{props.label}</label>
      <input
        className="registration input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onKeyDown={(e) => {
          props.onKeyDown(e);
        }}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Registration = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);

  const doRegistration = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);
      localStorage.setItem("userId", user.userId);

      // Registration successfully worked --> navigate to the route /game in the GameRouter
      history.push("/game");
    } catch (error) {
      alert(
        `Something went wrong during the registration: \n${handleError(error)}`
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && password && username) {
      doRegistration();
    }
  };

  return (
    <BaseContainer>
      <div className="registration container">
        <div className="registration form">
          <h1 className="registration title">Welcome to 2-10</h1>
          <h2 className="registration subtitle">Registration</h2>
          <FormField
            label="Username"
            value={username}
            onChange={(un) => setUsername(un)}
            onKeyDown={handleKeyDown}
          />
          <FormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
            onKeyDown={handleKeyDown}
          />
          <div className="registration button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doRegistration()}>
              Register
            </Button>
          </div>
          <div className="registration button-container">
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Registration;
