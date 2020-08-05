import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'


class EditProfile extends Component{
    
    constructor(props){
        super(props)

        this.state = {
            //username: ''
            first_name: '',
            last_name:'',
            email:'',
            phone:''
            //MUST ADD PHOTO AS WELL
        }

        
        this.handleFirstnameChange = this.handleFirstnameChange.bind(this)
        this.handleLastnameChange = this.handleLastnameChange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePhoneChange = this.handlePhoneChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }

    componentDidMount(){
        const {id} = this.props.match.params
        if (id !== this.props.app_state.user_primary_key){
            alert('You can only edit your own profile')
            this.props.history.push("/")
        }
        axios.get(`users/userList/${id}`).then( 
            response => {
                const res_user = response.data
                this.setState({
                    //username: '' password?,
                    first_name: res_user.first_name,
                    last_name: res_user.last_name,
                    email: res_user.email,
                    phone: res_user.telephone
                    //MUST ADD PHOTO AS WELL
                })
            }
        )
    }

    
    handleFirstnameChange = event => {
        const form_first_name = event.target.value
        this.setState({
            first_name: form_first_name
        })
    }

    handleLastnameChange = event => {
        const form_last_name = event.target.value
        this.setState({
            last_name: form_last_name
        })
    }
    
    handleEmailChange = event => {
        const form_email = event.target.value
        this.setState({
            email: form_email
        })
    }
    
    handlePhoneChange = event => {
        const form_phone = event.target.value
        this.setState({
            phone: form_phone
        })
    }
    
    
    handleFormSubmit = event => {
        event.preventDefault()


        const data = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            telephone: this.state.phone
        }
        //"{\"username\":[\"A user with that username already exists.\"]}"
        console.log(data)
        axios.patch(`users/userList/${this.props.app_state.user_primary_key}/`, JSON.stringify(data), {headers: {
            'Content-Type': 'application/json'
          }}).then(response => {alert('Your changes have been saved. ');  
            }).catch(error => {console.log(error.response);   
            })
    }

    render(){

        let login_check = this.props.app_state.isLoggedIn;
        if (login_check === true){
            return(

                <div>
                    <form onSubmit={this.handleFormSubmit}>
                        <h5> Update your first name here:<input name="fist_name" defaultValue={this.state.first_name} onChange={this.handleFirstnameChange} /></h5> 
                        <h5> Update your last name here:<input name="last_name" defaultValue={this.state.last_name} onChange={this.handleLastnameChange} /></h5>
                        <h5> Update your email here:<input type="email" name="email" size="30" defaultValue={this.state.email} onChange={this.handleEmailChange}/></h5> 
                        <h5> Update your phone here:<input type="tel" name="phone" size="30" defaultValue={this.state.phone} onChange={this.handlePhoneChange}/></h5> 
                        <button>Apply changes!</button>
                    </form>
                </div>

            )
            
        }else{
            return(
                <h1>You can't edit profile as an anonymous user!</h1>
            )
        }
    }

}

export default EditProfile