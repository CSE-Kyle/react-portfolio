import React, {Component} from 'react';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default class RichTextEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty()
        };

        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.getBase64 = this.getBase64.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    componentWillMount() {
        if (this.props.editMode && this.props.contentToEdit) {
            const blocksFromHtml = htmlToDraft(this.props.contentToEdit); // returns object
            const {contentBlocks, entityMap} = blocksFromHtml; // destructuring

            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);

            this.setState({editorState});
        }
    }

    onEditorStateChange(editorState) { // passed to editor as a prop
        this.setState(
          { editorState },
          this.props.handleRichTextEditorChange( // does not run until local state is updated (draftToHtml)
            draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())) // take html code and converts to strings within the text editor; convertToRaw takes text converting to something you can work with
          )
        );
    }

    getBase64(file, callback) {
        let reader = new FileReader();
        reader.readAsDataURL(file); // file being placed inside readAsDataUrl
        reader.onload = () => callback(reader.result); // when whole process starts up runs the callback (calling the promise in uploadFile)
        reader.onerror = error => {};
    }

    uploadFile(file) { // handles the process of when an image is picked; creating and returning a promise
        return new Promise((resolve, reject) => {
            this.getBase64(file, data => resolve({data: {link: data}}));
        });
    }

    render() {
        return (
            <div>
                <Editor 
                    editorState={this.state.editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{ // two curly brackets whenever passing an object into a prop
                        inline: {inDropdown: true}, // part of documentation
                        list: {inDropdown: true},
                        textAlign: {inDropdown: true},
                        link: {inDropdown: true},
                        history: {inDropdown: true},
                        image: {
                            uploadCallback: this.uploadFile, // calling a function whenever an image is dropped inside of it
                            alt: {present: true, mandatory: false},
                            previewImage: true,
                            inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg"
                        }
                    }}
                />
            </div>
        )
    };
}