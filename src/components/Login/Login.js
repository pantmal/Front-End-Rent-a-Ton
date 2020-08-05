import React from 'react';
import {Component} from 'react';


class Login extends Component{

    constructor(props){
        super(props)

        this.state = {
            username: '',
            password: '',
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }

    handleUsernameChange = event => {
        const form_name = event.target.value
        this.setState({
            username: form_name
        })
    }

    handlePasswordChange = event => {
        const form_pswd = event.target.value
        this.setState({
            password: form_pswd
        })
    }

    handleFormSubmit = event => {
        event.preventDefault()
        this.props.app_state.handleLoginSubmission(event, this.state)
    }

    render(){

        let login_check = this.props.app_state.isLoggedIn;
        if (login_check === true){
            return(
                <h1>You are already logged in!</h1>
            )
        }else{
            return(

                <div>
                    <form onSubmit={this.handleFormSubmit}>
                        <h2> Enter your name here:<input name="username" onChange={this.handleUsernameChange} /></h2> <br/>
                        <h2> Enter your password here:<input name="pswd" type="password" onChange={this.handlePasswordChange} /></h2>
                        <button>Login now!</button>
                    </form>
                </div>

            )
        }
    }

}

export default Login