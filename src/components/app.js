import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios"; // used to call outside API
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import NavigationContainer from "./navigation/navigation-container";
import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Blog from "./pages/blog";
import BlogDetail from "./pages/blog-detail";
import PortfolioManager from "./pages/portfolio-manager";
import PortfolioDetail from "./portfolio/portfolio-detail";
import Auth from "./pages/auth";
import NoMatch from "./pages/no-match";
import Icons from "../helpers/icons";

export default class App extends Component {
  constructor(props) {
    super(props);

    Icons();

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
    };

    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this); // must bind functions for it to work (no errors)
    this.handleUnsuccessfulLogin = this.handleUnsuccessfulLogin.bind(this); // must bind functions for it to work (no errors)
    this.handleSuccessfulLogout = this.handleSuccessfulLogout.bind(this); // must bind functions for it to work (no errors)
  }

  handleSuccessfulLogin() {
    this.setState({
      loggedInStatus: "LOGGED_IN", // changing state
    });
  }

  handleUnsuccessfulLogin() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN", // changing state
    });
  }

  handleSuccessfulLogout() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN", // changing state
    });
  }

  checkLoginStatus() {
    return axios
      .get("https://api.devcamp.space/logged_in", {
        // using credentials from devcamp space to login to application
        withCredentials: true,
      })
      .then((response) => {
        const loggedIn = response.data.logged_in;
        const loggedInStatus = this.state.loggedInStatus;

        if (loggedIn && loggedInStatus === "LOGGED_IN") {
          return loggedIn;
        } else if (loggedIn && loggedInStatus === "NOT_LOGGED_IN") {
          this.setState({ // updating state
            loggedInStatus: "LOGGED_IN", // changing state from NOT_LOGGED_IN => LOGGED_IN
          });
        } else if (!loggedIn && loggedInStatus === "LOGGED_IN") {
          this.setState({ // updating state
            loggedInStatus: "NOT_LOGGED_IN", // changing state from LOGGED_IN => NOT_LOGGED_IN
          });
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }

  componentDidMount() {
    // will automatically update state
    this.checkLoginStatus();
  }

  authorizedPages() {
    return [
      <Route
        key="portfolio-manager" // unique key prop
        path="/portfolio-manager"
        component={PortfolioManager}
      />,
    ];
  }

  render() {
    return (
      <div className="container">
        <Router>
          <div>
            <NavigationContainer
              loggedInStatus={this.state.loggedInStatus}
              handleSuccessfulLogout={this.handleSuccessfulLogout}
            />

            <Switch>
              <Route exact path="/" component={Home} />{" "}
              {/* exact path is the root location */}
              <Route
                path="/auth"
                render={(props) => (
                  <Auth
                    {...props} // getting access to all props given in auth.js
                    handleSuccessfulLogin={this.handleSuccessfulLogin}
                    handleUnsuccessfulLogin={this.handleUnsuccessfulLogin}
                  />
                )}
              />

              <Route path="/about-me" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="/blog" 
                render={props => (
                  <Blog {...props} loggedInStatus={this.state.loggedInStatus}/> // getting all props from Blog component
                )}
              />

              <Route 
                path="/b/:slug" 
                render={props => (
                  <BlogDetail 
                    {...props} 
                    loggedInStatus={this.state.loggedInStatus} 
                  />
                )}
              />

              {this.state.loggedInStatus === "LOGGED_IN" // shows any pages that only you can access
                ? this.authorizedPages()
                : null}
              <Route
                exact
                path="/portfolio/:slug"
                component={PortfolioDetail}
              />
              
              <Route component={NoMatch} />
              {/* will show if links do not exist */}
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
