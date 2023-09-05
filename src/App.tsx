// import "antd/dist/antd.less";
import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import BasicLayout from "./layouts/BasicLayout";
import BidListAll from "./pages/Bid/All";
import BidDetail from "./pages/Bid/Detail";
import BidListFinished from "./pages/Bid/Finished";
import BidListInPreparation from "./pages/Bid/InPreparation";
import BidListInProgress from "./pages/Bid/InProgress";
import BidListTerminated from "./pages/Bid/Terminated";
import Contact from "./pages/Contact";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterResult from "./pages/RegisterResult";

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/client">
            <Switch>
              <Route path="/client/login" exact component={Login} />
              <Route path="/client/register" exact component={Register} />
              <Route
                path="/client/register-result"
                exact
                component={RegisterResult}
              />
              <BasicLayout>
                <Switch>
                  <Route path="/client/home" exact component={Home} />
                  <Route path="/client/contact" exact component={Contact} />
                  <Route
                    path="/client/edit-profile"
                    exact
                    component={EditProfile}
                  />
                  <Route path="/client/bid/all" exact component={BidListAll} />
                  <Route
                    path="/client/bid/in_preparation"
                    exact
                    component={BidListInPreparation}
                  />
                  <Route
                    path="/client/bid/in_progress"
                    exact
                    component={BidListInProgress}
                  />
                  <Route
                    path="/client/bid/finished"
                    exact
                    component={BidListFinished}
                  />
                  <Route
                    path="/client/bid/terminated"
                    exact
                    component={BidListTerminated}
                  />
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
