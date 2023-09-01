import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import Login from "./pages/Login";

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/client">
            <Switch>
              <Route path="/client/login" exact component={Login} />
              <Route
                exact
                path="/client"
                render={() => <Redirect to="/client/login" />}
              />
            </Switch>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
