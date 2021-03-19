import React, {Component} from 'react';
import Login from '../auth/login';
import loginImg from '../../../static/assets/images/auth/login.jpg';

export default class Auth extends Component {
    constructor(props) {
        super(props);

        this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
        this.handleUnsuccessfulAuth = this.handleUnsuccessfulAuth.bind(this);
    }

    handleSuccessfulAuth() { // updating props received; changing the state to LOGGED_IN
        this.props.handleSuccessfulLogin();
        this.props.history.push("/"); // re-routing user to homepage after login; pushing users to root route (homepage)
    }

    handleUnsuccessfulAuth() {
        this.props.handleUnsuccessfulLogin();
    }

    render() {
        return (
           <div className="auth-page-wrapper">
                <div 
                    className="left-column"
                    style={{
                        backgroundImage: `url(${loginImg})`
                    }}
                />

                <div className="right-column">
                    <Login
                        handleSuccessfulAuth={this.handleSuccessfulAuth} // data flow
                        handleUnsuccessfulAuth={this.handleUnsuccessfulAuth} // data flow
                    />
                </div>
           </div> 
        );
    }
}