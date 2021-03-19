import React, {Component} from 'react';
import ReactModal from 'react-modal';

import BlogForm from '../blog/blog-form';

ReactModal.setAppElement(".app-wrapper"); // must know if there's a class(.) or id(#); class name for entire application in index.html

export default class BlogModal extends Component {
    constructor(props) {
        super(props);

        this.customStyles = { // styles for react-modal
            content: {
               top: "50%", 
               left: "50%",
               right: "auto",
               marginRight: "-50%",
               transform: "translate(-50%, -50%)",
               width: "800px"
            },

            overlay: {
                backgroundColor: "rgba(1, 1, 1, 0.75)" // dark overlay around modal
            }
        };

        this.handleSuccessfulFormSubmission = this.handleSuccessfulFormSubmission.bind(this);
    }

    handleSuccessfulFormSubmission(blog) {
        // console.log("blog from blog form", blog); // returns input of both input forms from blog-form.js
        this.props.handleSuccessfulNewBlogSubmission(blog); // take API data response and pass it to its parent (BlogModal prop in blog.js)
    };

    render() {
        return (
            <ReactModal 
                onRequestClose={() => {
                // console.log("testing modal close");
                this.props.handleModalClose(); // will run when you want it to
            }} 
                style={this.customStyles}
                isOpen={this.props.modalIsOpen}>

                <BlogForm handleSuccessfulFormSubmission={this.handleSuccessfulFormSubmission}/>
            </ReactModal>
        )
    }
}