import React, {Component} from 'react';
import axios from 'axios'; // communicating with outside API
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            errorText: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ // set email and value/updating form and state
            [event.target.name]: event.target.value,
            errorText: "" // error text going away when entering credentials again
        });
    }

    handleSubmit(event) {
        // console.log("Handle submit", this.state.email, this.state.password);
        axios.post("https://api.devcamp.space/sessions",
            {
                client: { // client object; log in with devcamp space credentials
                    email: this.state.email,
                    password: this.state.password
                }
            },
            {withCredentials: true}
        ).then(response => {
        //   console.log("response", response);  
            if (response.data.status === 'created') {
                this.props.handleSuccessfulAuth();
            } else { // if wrong credentials are entered
                this.setState({
                    errorText: "wrong email or password"
                });
                this.props.handleUnsuccessfulAuth();
            };
        }).catch(error => {
            // console.log("an error occured", error);
            this.setState({
                errorText: "An error occured"
            });
            this.props.handleUnsuccessfulAuth();
        });
        
        event.preventDefault(); // prevents showing email and password in DOM
    }

    render() {
        return (
            <div>
                <h1>LOGIN TO ACCESS YOUR DASHBOARD</h1>

                <div>{this.state.errorText}</div>
                <form onSubmit={this.handleSubmit} className="auth-form-wrapper">
                    <div className="form-group">
                    <FontAwesomeIcon icon="envelope"/>
                        <input 
                            type="email"
                            name="email"
                            placeholder="your email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <FontAwesomeIcon icon="lock"/>
                
                        <input 
                            type="password"
                            name="password"
                            placeholder="your password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                    </div>
                    
                    <button className="btn" type="submit">Login</button> { /* type="submit" - automatically submit form */}
                </form>
            </div>
        );
    }
}