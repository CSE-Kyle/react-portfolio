import React, {Component} from 'react';
import axios from 'axios';
import RichTextEditor from '../forms/rich-text-editor';
import DropzoneComponent from 'react-dropzone-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class BlogForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            title: "",
            blog_status: "",
            content: "",
            featured_image: "",
            apiUrl: "https://kyledeguzman.devcamp.space/portfolio/portfolio_blogs",
            apiAction: "post"
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRichTextEditorChange = this.handleRichTextEditorChange.bind(this);

        this.componentConfig = this.componentConfig.bind(this);
        this.djsConfig = this.djsConfig.bind(this);
        this.handleFeaturedImageDrop = this.handleFeaturedImageDrop.bind(this);
        this.deleteImage = this.deleteImage.bind(this);

        this.featuredImageRef = React.createRef();
    }

    deleteImage(imageType) {
        console.log("delete image", imageType);

        axios.delete(`https://api.devcamp.space/portfolio/delete-portfolio-blog-image/${this.props.blog.id}?image_type=${imageType}`, {withCredentials: true} // deleting image
        ).then(response => {
            // console.log("deleteImage", response);

            // TODO 
            this.props.handleFeaturedImageDelete();
            console.log("response from blog image delete", response);

        }).catch(error => {
            console.log("error: unable to delete image", error);
        });
    }

    componentWillMount() {
        if (this.props.editMode) { // if true, pre-populate some data
            this.setState({
                id: this.props.blog.id,
                title: this.props.blog.title,
                blog_status: this.props.blog.blog_status,
                content: this.props.blog.content,
                apiUrl: `https://kyledeguzman.devcamp.space/portfolio/portfolio_blogs/${this.props.blog.id}`,
                apiAction: "patch" // anytime you want to edit something, the correct verb (http) is patched
            });
        }
    }

    componentConfig() {
        return {
            iconFiletypes: [".jpg", ".png"],
            showFiletypeIcon: true,
            postUrl: "https://httpbin.org/post"
        }
    }

    djsConfig() {
        return {
            addRemoveLinks: true,
            maxFiles: 1
        }
    }

    handleFeaturedImageDrop() {
        return {
            addedfile: file => this.setState({featured_image: file})
        }
    }

    handleRichTextEditorChange(content) {
        this.setState({ content });
    }

    buildForm() {
        let formData = new FormData(); // instantiating form data object 

        formData.append("portfolio_blog[title]", this.state.title); // adding to object created above; taking title from devcamp space API
        formData.append("portfolio_blog[blog_status]", this.state.blog_status); // taking blog_status from devcamp space API
        formData.append("portfolio_blog[content]", this.state.content); // taking content 

        if (this.state.featured_image) {
          formData.append("portfolio_blog[featured_image]", this.state.featured_image); 
        }
        console.log(formData)
        return formData;
    }

    handleChange(event) {
        // console.log("handleChange", event);
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        axios({
          method: this.state.apiAction, // will be post if no portfolio record to edit; will be patch if records to edit
          url: this.state.apiUrl,
          data: this.buildForm(),
          withCredentials: true
        }).then(response => {
            if (this.state.featured_image) {
              this.featuredImageRef.current.dropzone.removeAllFiles();
            }

            this.setState({ // clearing form out for modal
                title: "",
                blog_status: "",
                content: "",
                featured_image: ""
            });

            if (this.props.editMode) {
                // update blog-detail component
                this.props.handleUpdateFormSubmission(response.data.portfolio_blog);
            } else {
                this.props.handleSuccessfulFormSubmission(response.data.portfolio_blog); // passing to blog-modal (as a prop) (communicating)
            }

        }).catch(error => {
            console.log("handleSubmit for blog error", error);
        });

        event.preventDefault();
    };

    render() {
        return (
          <form onSubmit={this.handleSubmit} className="blog-form-wrapper">
            <div className="two-column">
                <input
                    type="text"
                    onChange={this.handleChange}
                    name="title"
                    placeholder="Blog Title"
                    value={this.state.title}
                />

                <input
                    type="text"
                    onChange={this.handleChange}
                    name="blog_status"
                    placeholder="Blog status"
                    value={this.state.blog_status}
                />
            </div>

            <div className="one-column">
                <RichTextEditor 
                    handleRichTextEditorChange={this.handleRichTextEditorChange}
                    editMode={this.props.editMode}
                    contentToEdit={this.props.editMode && this.props.blog.content ? this.props.blog.content : null} // not wanting to pass any details if not in edit mode
                />
            </div>

            <div className="image-uploaders">
                {this.props.editMode && this.props.blog.featured_image_url ? (
                    <div className="portfolio-manager-image-wrapper">
                        <img src={this.props.blog.featured_image_url} />

                        <div className="image-removal-link">
                            <a onClick={() => this.deleteImage("featured_image")}>
                                Remove File
                                <FontAwesomeIcon icon="ban" style={{ marginLeft: "8px" }} />
                            </a>
                        </div>
                    </div>
                ) : (   
                    <DropzoneComponent 
                        ref={this.featuredImageRef} // if you have an image, it will be cleared off the right way, nothing left over in state, dropzone state, etc.
                        config={this.componentConfig()} // adding parens() for function to run right away; invoking a function
                        djsConfig={this.djsConfig()} // invoked right away 
                        eventHandlers={this.handleFeaturedImageDrop()} // invoked right away
                    >
                        <div className="dz-message">Featured image</div>
                    </DropzoneComponent>
                )}
            </div>

            <button className="btn">Save</button>
          </form>
        );
    }
}