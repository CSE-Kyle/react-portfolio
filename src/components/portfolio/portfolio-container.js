import React, { Component } from "react";
import axios from "axios";

import PortfolioItem from "./portfolio-item";

export default class PortfolioContainer extends Component {
  constructor() {
    // used to set data, etc.
    super();

    this.state = {
      // creating a state in react (initial state (something your component will get when it's called))
      pageTitle: "welcome to my portfolio",
      pageDescription: "here are my personal projects",
      isLoading: false,
      data: [],
    };

    this.handleFilter = this.handleFilter.bind(this); // activates filter function
  }

  handleFilter(filter) { // filter function
    if (filter === "CLEAR_FILTERS") {
      this.getPortfolioItems(); // calling API to bring all portfolio items back
    } else {
      this.getPortfolioItems(filter); // only showing items based on category selected
    }
  }

  getPortfolioItems(filter = null) { // filter is optional
    axios
      .get("https://kyledeguzman.devcamp.space/portfolio/portfolio_items")
      .then((response) => {
        if (filter) {
          console.log("response data", response); // returns response data in the browser console
          this.setState({
            // updating states value
            data: response.data.portfolio_items.filter((item) => {
              return item.category === filter;
            })
          });
        } else {
          console.log("response data", response);
          this.setState({
            data: response.data.portfolio_items,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .then(function () {});
  }

  portfolioItems() {
    // ["thumb_image_url", "banner_image_url", "logo_url", "column_names_merged_with_images"]
    return this.state.data.map((item) => {
      // map - used to loop over data; parameter can be called anything
      // console.log("item date", item); // prints out data items from devcamp space into browser console
      return (
        <PortfolioItem
          key={item.id}
          item={item} // linked to destructuring in portfolio-item
        />
      );
      // return <h1>{item}</h1>
    });
  }

  componentDidMount() {
    this.getPortfolioItems(); // update state (what's holding the data)
  }

  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="homepage-wrapper">
        <div className="filter-links">
          {/* <h2>{this.state.pageTitle}</h2> 
          <h3>{this.state.pageDescription} :</h3> */}
          <button
            className="btn"
            onClick={() => this.handleFilter("education")}
          >
            Education
          </button>

          <button
            className="btn"
            onClick={() => this.handleFilter("Enterprise")}
          >
            Enterprise
          </button>

          <button
            className="btn"
            onClick={() => this.handleFilter("CLEAR_FILTERS")}
          >
            All
          </button>
        </div>
        
        <div className="portfolio-items-wrapper">{this.portfolioItems()}</div>
      </div>
    );
  }
}
