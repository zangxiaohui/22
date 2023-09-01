import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Login} />
          <Route exact path="/" render={() => <Redirect to="/login" />} />

          <Route path="/">
            <Switch>
              {/* <Route
                  exact
                  path="/"
                  render={() => <Redirect to="/dashboard" />}
                /> */}
              <Route path="/login" exact component={Dashboard} />
            </Switch>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
