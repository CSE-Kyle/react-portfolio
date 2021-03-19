import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import BlogItem from "../blog/blog-item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BlogModal from "../modals/blog-modal";

class Blog extends Component {
  constructor() {
    super();

    this.state = {
      blogItems: [],
      totalCount: 0,
      currentPage: 0,
      isLoading: true, // will be in loading state when component mounts
      blogModalIsOpen: false, // modal shouldn't be showing when blog page is loaded, only when a user clicks on modal
    };

    this.getBlogItems = this.getBlogItems.bind(this);
    this.onScroll = this.onScroll.bind(this);

    window.addEventListener("scroll", this.onScroll, false);

    this.handleNewBlogClick = this.handleNewBlogClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleSuccessfulNewBlogSubmission = this.handleSuccessfulNewBlogSubmission.bind(
      this
    );
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick(blog) {
    console.log("deleted", blog);
    axios
      .delete(
        `https://api.devcamp.space/portfolio/portfolio_blogs/${blog.id}`,
        { withCredentials: true }
      )
      .then((response) => {
        console.log("response from delete", response);
      })
      .catch((error) => {
        console.log("delete blog error", error);
      });
  }

  handleSuccessfulNewBlogSubmission(blog) {
    this.setState({
      blogModalIsOpen: false,
      blogItems: [blog].concat(this.state.blogItems), // taking current blog list and add item to front of list
    });
  }

  handleNewBlogClick() {
    this.setState({
      blogModalIsOpen: true, // opens modal as it's being clicked
    }); // this belongs within the main branch
  }

  handleModalClose() {
    this.setState({
      blogModalIsOpen: false, // will close modal when clicked outside of modal
    });
  }

  onScroll() {
    // console.log("onscroll"); // will track how many times you scroll
    // console.log("window.innerHeight", window.innerHeight); // will print out once you start scrolling
    // console.log("document.documentElement.scrollTop", document.documentElement.scrollTop); // will print out once you start scrolling
    // console.log("document.documentElement.offsetHeight", document.documentElement.offsetHeight); // will print out once you start scrolling

    if (
      this.state.isLoading ||
      this.state.blogItems.length === this.state.totalCount
    ) {
      return; // skips everything else below if blogItems is equal to totalCount
    }

    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      // console.log("get more posts"); // prints out once you reach bottom of page
      this.getBlogItems();
    }
  }

  getBlogItems() {
    // getting blogs from API
    this.setState({
      currentPage: this.state.currentPage + 1, // starts at page 0, as soon as getBlogItems is called will be updated to page 1 and so on...
    });

    axios
      .get(
        `https://kyledeguzman.devcamp.space/portfolio/portfolio_blogs?page=${this.state.currentPage}`,
        { withCredentials: true }
      )
      .then((response) => {
        // console.log("response data", response);
        console.log("getting", response.data);

        this.setState({
          blogItems: this.state.blogItems.concat(response.data.portfolio_blogs), // sets new data to the top/front with concat
          totalCount: response.data.meta.total_records,
          isLoading: false, // change to displaying records once items are loaded
        });
      })
      .catch((error) => {
        console.log("getBlogItems error", error);
      });
  }

  componentWillMount() {
    this.getBlogItems();
  }

  componentWillUnmount() {
    // when component goes away, this component will be triggered
    window.removeEventListener("scroll", this.onScroll, false);
  }

  render() {
    const blogRecords = this.state.blogItems.map((blogItem) => {
      if (this.props.loggedInStatus === "LOGGED_IN") {
        return (
          <div key={blogItem.id} className="admin-blog-wrapper">
            <BlogItem blogItem={blogItem} />
            <a onClick={this.handleDeleteClick}>Delete</a>
          </div>
        );
      } else {
        return <BlogItem key={blogItem.id} blogItem={blogItem} />;
      }
    });

    return (
      <div className="blog-container">
        <BlogModal
          handleSuccessfulNewBlogSubmission={
            this.handleSuccessfulNewBlogSubmission
          }
          handleModalClose={this.handleModalClose}
          modalIsOpen={this.state.blogModalIsOpen}
        />

        {this.props.loggedInStatus === "LOGGED_IN" ? (
          <div className="new-blog-link">
            <a onClick={this.handleNewBlogClick}>
              <div className="add-new-blog">
                <FontAwesomeIcon
                  icon="plus-square"
                  style={{ marginRight: "9px" }}
                />{" "}
                <p>add new blog</p>
              </div>
            </a>
          </div>
        ) : null}

        {this.state.isLoading ? (
          <div className="content-loader">
            <FontAwesomeIcon icon="spinner" spin />
          </div>
        ) : null}

        <div className="content-container">
          {blogRecords}{" "}
          {/* not needing to use "this" because blogRecords is in local scope and within a function */}
        </div>
      </div>
    );
  }
}

export default Blog;
