import React, { useState, useEffect } from "react";
import {
  Route,
  Switch,
  withRouter,
  useHistory,
  Redirect,
} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import AroundUs from "./AroundUs";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth.js";
import InfoToolTip from "./InfoToolTip";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authPopupState, setAuthPopupState] = React.useState(false);
  const [mode, setMode] = useState(false);
  const [message, setMessage] = useState({ message: "" });

  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");

  const [registered, setRegistered] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const history = useHistory();

  //resetForm
  function resetForm() {
    setUserEmail("");
    setUserPassword("");
  }

  //login
  function closePopup() {
    setAuthPopupState(false);
  }

  function renderSuccess() {
    setMode(true);
    setAuthPopupState(true);
    setMessage({ message: "¡Correcto! Ya estás registrado." });
  }

  function renderFailure() {
    setMode(false);
    setAuthPopupState(true);
    setMessage({
      message: "Uy, algo salió mal. Por favor, inténtalo de nuevo.",
    });
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function authorize(e) {
    auth
      .authorize(userEmail, userPassword)
      .then((data) => {
        if (data && data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          handleLogin();
          history.push("/main");
        } else {
          resetForm();
          if (!userEmail || !userPassword) {
            renderFailure();
            throw new Error(
              "400 - one or more of the fields were not provided"
            );
          }
          if (!data) {
            renderFailure();
            throw new Error(
              "401 - the user with the specified email not found"
            );
          }
        }
      })
      .catch((err) => console.log(err.message));
  }

  function register(e) {
    auth
      .register(userEmail, userPassword)
      .then((res) => {
        //  if (!(res.data && res.data._id)) {
        if (!(res && res._id)) {
          renderFailure();
          // throw new Error(`400 - ${res.message ? res.message : res.error}`);
          // throw new Error(
          //   `409(Conflict)  - ${res.message ? res.message : res.error}`
          // );
          if (res.status === 409) {
            return Promise.reject(new Error("(Conflict) - User already taken"));
          }
        } else {
          renderSuccess();
        }
      })
      .then((res) => {
        setRegistered(true);
        history.push("/signin");
        return res;
      })
      .then(resetForm)
      .catch((err) => console.log(err));
  }

  function signOut() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUserEmail("");
    history.push("/signin");
  }

  return (
    <div class="page">
      <Switch>
        <ProtectedRoute
          path="/main"
          loggedIn={loggedIn}
          email={userEmail}
          component={AroundUs}
          signOut={signOut}
          closePopup={closePopup}
          message={message}
          mode={mode}
          setUserEmail={setUserEmail}
        />
        <Route exact path="/signin">
          <div className="loginContainer">
            <Login
              loggedIn={loggedIn}
              title="Iniciar Sesión"
              value="¿Aún no eres miembro? Regístrate aquí"
              link="/signup"
              redirect="Regístrate"
              setLoggedIn={setLoggedIn}
              signOut={signOut}
              renderFailure={renderFailure}
              renderSuccess={renderSuccess}
              authorize={authorize}
              userEmail={userEmail}
              userPassword={userPassword}
              setUserEmail={setUserEmail}
              setUserPassword={setUserPassword}
            />
            <InfoToolTip
              popupState={authPopupState}
              closePopup={closePopup}
              message={message}
              mode={mode}
            />
          </div>
        </Route>
        <Route path="/signup">
          <div className="registerContainer">
            <Register
              loggedIn={loggedIn}
              title="Regístrate"
              value="¿Ya eres miembro? Inicia sesión aquí"
              link="/signin"
              redirect="Inicia sesión"
              setLoggedIn={setLoggedIn}
              signOut={signOut}
              renderFailure={renderFailure}
              renderSuccess={renderSuccess}
              register={register}
              userEmail={userEmail}
              userPassword={userPassword}
              setUserEmail={setUserEmail}
              setUserPassword={setUserPassword}
            />
            <InfoToolTip
              popupState={authPopupState}
              closePopup={closePopup}
              message={message}
              mode={mode}
            />
          </div>
        </Route>
        <Route exact path="/">
          {loggedIn ? <Redirect to="/main" /> : <Redirect to="/signin" />}
        </Route>
        <Redirect from="*" to="/" />
      </Switch>
    </div>
  );
}

export default withRouter(App);
