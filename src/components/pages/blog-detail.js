import React, {Component} from 'react';
import axios from 'axios';
import ReactHtmlParser from "react-html-parser";
import BlogFeaturedImage from '../blog/blog-featured-image';
import BlogForm from '../blog/blog-form';

export default class BlogDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentId: this.props.match.params.slug,
            blogItem: {},
            editMode: false
        };

        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleFeaturedImageDelete = this.handleFeaturedImageDelete.bind(this);
        this.handleUpdateFormSubmission = this.handleUpdateFormSubmission.bind(this);
    }

    handleUpdateFormSubmission(blog) { // will update any data within blog once edited
        this.setState({
            blogItem: blog,
            editMode: false
        })
    }

    handleFeaturedImageDelete() {
        this.setState({
            blogItem: {
                featured_image_url: ""
            }
        });
    }

    handleEditClick() {
        // console.log("handle edit clicked");
        if (this.props.loggedInStatus === "LOGGED_IN") {
            this.setState({
              editMode: true
            });
        }
    }

    getBlogItem() {
        axios.get(`https://kyledeguzman.devcamp.space/portfolio/portfolio_blogs/${this.state.currentId}`
        ).then(response => {
            // console.log("response data", response);

            this.setState({
                blogItem: response.data.portfolio_blog
            });

        }).catch(error => {
            console.log("getBlogItem error occoured", error);
        });
    }

    componentDidMount() { // getBlogItem triggered when component uploads
        this.getBlogItem();
    }

    render() {
        // console.log("currentId", this.state.currentId);

        const {
            title,
            content,
            featured_image_url,
            blog_status
        } = this.state.blogItem;

        const contentManager = () => {
            if (this.state.editMode) { // if true, return BlogForm
                return <BlogForm 
                    editMode={this.state.editMode} 
                    blog={this.state.blogItem}
                    handleFeaturedImageDelete={this.handleFeaturedImageDelete}
                    handleUpdateFormSubmission={this.handleUpdateFormSubmission}
                />;
            } else { // if editMode is false, return content
                return (
                    <div className="content-container">
                        <h1 onClick={this.handleEditClick}>{title}</h1>

                        <BlogFeaturedImage img={featured_image_url} />

                        <div className="content">{ReactHtmlParser(content)}</div>
                    </div>
                );
            }
        }

        return <div className="blog-container">{contentManager()}</div>;
    }
}