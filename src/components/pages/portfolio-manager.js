import React, { Component } from "react";
import axios from "axios";
import PortfolioSidebarList from "../portfolio/portfolio-sidebar-list";
import PortfolioForm from "../portfolio/portfolio-form";

export default class PortfolioManager extends Component {
  constructor() {
    super();

    this.state = {
      portfolioItems: [],
      portfolioToEdit: {},
    };

    this.handleNewFormSubmission = this.handleNewFormSubmission.bind(this);
    this.handleEditFormSubmission = this.handleEditFormSubmission.bind(this);
    this.handleSuccessfulFormSubmissionError = this.handleFormSubmissionError.bind(this);
    
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.clearPortfolioToEdit = this.clearPortfolioToEdit.bind(this);
  }

  clearPortfolioToEdit() {
    // returns portfolioToEdit state to an empty object
    this.setState({
      portfolioToEdit: {},
    });
  }

  handleEditClick(portfolioItem) {
    this.setState({
      portfolioToEdit: portfolioItem, // updating state from portfolioToEdit => portfolioItem
    });
  }

  handleDeleteClick(portfolioItem) {
    console.log("handleDeleteClick", portfolioItem);

    axios
      .delete(
        `https://api.devcamp.space/portfolio/portfolio_items/${portfolioItem.id}`,
        { withCredentials: true } // checking to see if you're allowed to delete portfolio items (withCredentials)
      )
      .then((response) => {
        this.setState({
          // clean up portfolioItems
          portfolioItems: this.state.portfolioItems.filter((item) => {
            // iterating through a collection, keeping all items except the one deleted
            return item.id !== portfolioItem.id; // keep all records except the one you want to delete
          }),
        });

        return response.data;
      })
      .catch((error) => {
        console.log("handleDeleteClick error", error);
      });
  }

  handleEditFormSubmission() {
    this.getPortfolioItems();
  }

  handleNewFormSubmission(portfolioItem) {
    // console.log("handleSuccessfulFormSubmission", portfolioItem);

    this.setState({
      portfolioItems: [portfolioItem].concat(this.state.portfolioItems), // adds records into application
    });
  }

  handleFormSubmissionError(error) {
    console.log("handleFormSubmissionError error", error);
  }

  getPortfolioItems() {
    axios
      .get(
        "https://kyledeguzman.devcamp.space/portfolio/portfolio_items?order_by=created_at&direction=desc",
        { withCredentials: true }
      )
      .then((response) => {
        // console.log("response from get portfolio items", response);
        this.setState({
          portfolioItems: [...response.data.portfolio_items], // grabbing all records
        });
      })
      .catch((error) => {
        console.log("an error occured", error);
      });
  }

  componentDidMount() {
    // will call getPortfolioItems everytime component mounts
    this.getPortfolioItems();
  }

  render() {
    return (
      <div className="portfolio-manager-wrapper">
        <div className="left-column">
          <PortfolioForm
            handleNewFormSubmission={this.handleNewFormSubmission}
            handleEditFormSubmission={this.handleEditFormSubmission} // resets all data from getPortfolioItems
            handleFormSubmissionError={this.handleFormSubmissionError}
            clearPortfolioToEdit={this.clearPortfolioToEdit} // passing in clearPortfolioEdit function
            portfolioToEdit={this.state.portfolioToEdit} // passing in portfolioToEdit object
          />
        </div>

        <div className="right-column">
          <PortfolioSidebarList
            handleDeleteClick={this.handleDeleteClick}
            data={this.state.portfolioItems}
            handleEditClick={this.handleEditClick}
          />
        </div>
      </div>
    );
  }
}
