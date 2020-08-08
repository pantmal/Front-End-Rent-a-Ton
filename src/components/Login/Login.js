import React from 'react';
import {Component} from 'react';


class Login extends Component{

    constructor(props){
        super(props)

        this.state = {
            username: '',
            password: '',
            errors: {}
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

    handleValidation(){
        
        let errors = {};
        let formIsValid = true;

        if(this.state.username == ''){
           formIsValid = false;
           errors["name"] = "\u2757Cannot be empty";
        }

        if(this.state.password == ''){
            formIsValid = false;
            errors["pswd"] = "\u2757Cannot be empty";
        }

        this.setState({errors: errors});

        return formIsValid;
    }

    handleFormSubmit = event => {
        event.preventDefault()

        if(this.handleValidation()){
            this.props.app_state.handleLoginSubmission(event, this.state)
        }

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
                        <h2 className="message"> Enter your name here:<input name="username" onChange={this.handleUsernameChange} /></h2> <br/>
                        <span style={{color: "red"}}>{this.state.errors["name"]}</span>
                        <h2 className="message"> Enter your password here:<input name="pswd" type="password" onChange={this.handlePasswordChange} /></h2>
                        <span style={{color: "red"}}>{this.state.errors["pswd"]}</span>
                        <br/>
                        <button className="apply">Login now!</button>
                    </form>
                </div>

            )
        }
    }

}

export default Login