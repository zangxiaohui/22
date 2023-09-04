// import "antd/dist/antd.less";
import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import BasicLayout from "./layouts/BasicLayout";
import Bid from "./pages/Bid";
import BidDetail from "./pages/Bid/Detail";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/client">
            <Switch>
              <Route path="/client/login" exact component={Login} />
              <Route path="/client/login" exact component={Login} />
              <BasicLayout>
                <Switch>
                  <Route path="/client/home" exact component={Home} />
                  <Route
                    path="/client/edit-profile"
                    exact
                    component={EditProfile}
                  />
                  <Route path="/client/bid" exact component={Bid} />
                  <Route
                    path="/client/bid/detail/:id"
                    exact
                    component={BidDetail}
                  />
                </Switch>
              </BasicLayout>
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
