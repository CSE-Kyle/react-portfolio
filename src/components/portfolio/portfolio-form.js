import React, { Component } from "react";
import axios from "axios";

import DropzoneComponent from "react-dropzone-component";
import "../../../node_modules/dropzone/dist/min/dropzone.min.css";
import "../../../node_modules/react-dropzone-component/styles/filepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class PortfolioForm extends Component {
  constructor(props) {
    super(props); // passing functions as props from portfolio-manager

    this.state = {
      name: "",
      description: "",
      category: "Enterprise", // will set category as default value (but will change depending on category)
      position: "",
      url: "",
      thumb_image: "",
      banner_image: "",
      logo: "",
      editMode: false,
      apiUrl: "https://kyledeguzman.devcamp.space/portfolio/portfolio_items",
      apiAction: "post"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.componentConfig = this.componentConfig.bind(this);
    this.djsConfig = this.djsConfig.bind(this);
    this.handleThumbDrop = this.handleThumbDrop.bind(this);
    this.handleBannerDrop = this.handleBannerDrop.bind(this);
    this.handleLogoDrop = this.handleLogoDrop.bind(this);
    this.deleteImage = this.deleteImage.bind(this);

    this.thumbRef = React.createRef(); // create reference object and store inside of thumbRef; access to call in JSX and other functions
    this.bannerRef = React.createRef();
    this.logoRef = React.createRef();
  }

  deleteImage(imageType) {
    console.log("delete image", imageType);

    axios.delete(`https://api.devcamp.space/portfolio/delete-portfolio-image/${this.state.id}?image_type=${imageType}`, {withCredentials: true} // deleting image
    ).then(response => {
      // console.log("deleteImage", response);

      this.setState({
        [`${imageType}_url`]: "" // will remove file and set as an empty file
      })

    }).catch(error => {
      console.log("error: unable to delete image", error);
    });
  }

  componentDidUpdate() {
    // checking to see if object has keys or not
    if (Object.keys(this.props.portfolioToEdit).length > 0) {
      // grab all of data out if length > 0
      {
        /* loop will be skipped of object is empty */
      }

      const {
        id,
        name,
        description,
        category,
        position,
        url,
        thumb_image_url,
        banner_image_url,
        logo_url,
      } = this.props.portfolioToEdit; // take the object passed in, spread out each element and store it in a variable

      this.props.clearPortfolioToEdit(); // goes into portfolio-manager.js and call out the clearPortfolioToEdit function (setting state back to empty object)

      this.setState({
        // populating state
        id: id,
        name: name || "", // if it has name (or) doesn't have name
        description: description || "",
        category: category || "Enterprise",
        position: position || "",
        url: url || "",
        editMode: true,
        apiUrl: `https://kyledeguzman.devcamp.space/portfolio/portfolio_items/${id}`, // getting id from portfolioToEdit
        apiAction: "patch", // http verb for creating an update action
        thumb_image_url: thumb_image_url || "",
        banner_image_url: banner_image_url || "",
        logo_url: logo_url || ""
      });
    }
  }

  handleThumbDrop() {
    // part of dropzone.js
    return {
      addedfile: (file) => this.setState({ thumb_image: file }), // checking to what methods you have access to and updates state
    };
  }

  handleBannerDrop() {
    // part of dropzone.js
    return {
      addedfile: (file) => this.setState({ banner_image: file }), // checking to what methods you have access to and updates state
    };
  }

  handleLogoDrop() {
    // part of dropzone.js
    return {
      addedfile: (file) => this.setState({ logo: file }), // checking to what methods you have access to and updates state
    };
  }

  componentConfig() {
    // part of dropzone.js
    return {
      iconFiletypes: [".jpg", ".png"], // connecting to dropzone.js
      showFiletypeIcon: true,
      postUrl: "https://httpbin.org/post", // special url (allows you to call different types of http verbs always returning true)
    };
  }

  djsConfig() {
    // part of dropzone.js
    return {
      addRemoveLinks: true, // ability to add files into application
      maxFiles: 1, // ability to add files into application
    };
  }

  buildForm() {
    // displays data within DOM
    let formData = new FormData(); // creating a new form data object
    formData.append("portfolio_item[name]", this.state.name); // API expecting an object
    formData.append("portfolio_item[description]", this.state.description); // API expecting an object
    formData.append("portfolio_item[url]", this.state.url); // API expecting an object
    formData.append("portfolio_item[category]", this.state.category); // API expecting an object
    formData.append("portfolio_item[position]", this.state.position); // API expecting an object

    if (this.state.thumb_image) {
      formData.append("portfolio_item[thumb_image]", this.state.thumb_image); // append data if an image file is uploaded
    } // adding into API

    if (this.state.banner_image) {
      formData.append("portfolio_item[banner_image]", this.state.banner_image); // append data if an image file is uploaded
    } // adding into API

    if (this.state.logo) {
      formData.append("portfolio_item[logo]", this.state.logo); // append data if an image file is uploaded
    } // adding into API

    return formData;
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value, // update state for name (able to type in values)
    });
  }

  handleSubmit(event) {
    axios({
      method: this.state.apiAction, // will be post if no portfolio record to edit; will be patch if records to edit
      url: this.state.apiUrl,
      data: this.buildForm(),
      withCredentials: true,
    })
      .then((response) => {
        console.log("response", response);

        if (this.state.editMode) {
          this.props.handleEditFormSubmission(); // call handleEditFormSubmission if in edit mode
        } else {
          this.props.handleNewFormSubmission(response.data.portfolio_item); // adding records to API; updating sidebar list
        }

        this.setState({ // returning to base state
          name: "",
          description: "",
          category: "Enterprise",
          position: "",
          url: "",
          thumb_image: "",
          banner_image: "",
          logo: "",
          editMode: false,
          apiUrl: "https://kyledeguzman.devcamp.space/portfolio/portfolio_items",
          apiAction: "post"
        });

        [this.thumbRef, this.bannerRef, this.logoRef].forEach((ref) => {
          ref.current.dropzone.removeAllFiles(); // giving current state (dropzone documentation on removing files)
        }); // storing elements within an array (ability to loop over)
      })
      .catch((error) => {
        console.log("portfolio form handleSubmit error", error);
      });

    console.log("event", event);
    event.preventDefault(); // won't refresh page when save button is clicked
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="portfolio-form-wrapper">
        <div className="two-column">
          <input
            type="text"
            name="name"
            placeholder="Portfolio Item Name"
            value={this.state.name}
            onChange={this.handleChange}
          />

          <input
            type="text"
            name="url"
            placeholder="URL"
            value={this.state.url}
            onChange={this.handleChange}
          />
        </div>

        <div className="two-column">
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={this.state.position}
            onChange={this.handleChange}
          />

          <select
            name="category"
            value={this.state.category}
            onChange={this.handleChange}
            className="select-element"
          >
            <option value="eCommerce">eCommerce</option>
            <option value="Automotive">Automotive</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        <div className="one-column">
          <textarea
            type="text"
            name="description"
            placeholder="Description"
            value={this.state.description}
            onChange={this.handleChange}
          />
        </div>

        <div className="image-uploaders three-column">
          {this.state.thumb_image_url && this.state.editMode ? (
            <div className="portfolio-manager-image-wrapper">
              <img src={this.state.thumb_image_url} />

              <div className="image-removal-link">
                <a onClick={() => this.deleteImage("thumb_image")}>
                  Remove File
                  <FontAwesomeIcon icon="ban" style={{ marginLeft: "8px" }} />
                </a>
              </div>
            </div>
          ) : (
            <DropzoneComponent
              ref={this.thumbRef}
              config={this.componentConfig()} // props
              djsConfig={this.djsConfig()} // props
              eventHandlers={this.handleThumbDrop()} // props
            >
              <div className="dz-message">Thumbnail</div>
            </DropzoneComponent>
          )}

          {this.state.banner_image_url && this.state.editMode ? (
            <div className="portfolio-manager-image-wrapper">
              <img src={this.state.banner_image_url} />

              <div className="image-removal-link">
                <a onClick={() => this.deleteImage("banner_image")}>
                  Remove File
                  <FontAwesomeIcon icon="ban" style={{ marginLeft: "8px" }} />
                </a>
              </div>
            </div>
          ) : (
            <DropzoneComponent
              ref={this.bannerRef}
              config={this.componentConfig()} // props
              djsConfig={this.djsConfig()} // props
              eventHandlers={this.handleBannerDrop()} // props
            >
              <div className="dz-message">Banner</div>
            </DropzoneComponent>
          )}

          {this.state.logo_url && this.state.editMode ? (
            <div className="portfolio-manager-image-wrapper">
              <img src={this.state.logo_url} />

              <div className="image-removal-link">
                <a onClick={() => this.deleteImage("logo")}>
                  Remove File
                  <FontAwesomeIcon icon="ban" style={{ marginLeft: "8px" }} />
                </a>
              </div>
            </div>
          ) : (
            <DropzoneComponent
              ref={this.logoRef}
              config={this.componentConfig()} // props
              djsConfig={this.djsConfig()} // props
              eventHandlers={this.handleLogoDrop()} // props
            >
              <div className="dz-message">Logo</div>
            </DropzoneComponent>
          )}
        </div>

        <div className="center-btn">
          <button className="btn" type="submit">
            Save
          </button>
        </div>
      </form>
    );
  }
}
