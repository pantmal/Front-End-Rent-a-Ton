import React from 'react';
import {Component} from 'react';

import {Link, Route} from 'react-router-dom';

import axios from '../AXIOS_conf'

class UserDetail extends Component{

    constructor(props){
        super(props)

        this.state = {
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            host: false,
            approval: false
            //MUST ADD PHOTO AS WELL
        }

        this.handleApprovalChange = this.handleApprovalChange.bind(this)
    }


    componentDidMount(){

        const {id} = this.props.match.params
        axios.get(`users/userList/${id}`, {
            headers: {
              Authorization: `JWT ${localStorage.getItem('storage_token')}`
            }}).then( 
            response => {
                const res_user = response.data
                //if (this._isMounted){
                this.setState({
                    username: res_user.username,
                    first_name: res_user.first_name,
                    last_name: res_user.last_name,
                    email: res_user.email,
                    phone: res_user.telephone,
                    host: res_user.is_host,
                    approval: res_user.approved
                    //MUST ADD PHOTO AS WELL
                })
            }
        )
    }

    handleApprovalChange(){

        
        const id_match = this.props.match.params.id
        const data_send = {ID: id_match, activation: !this.state.approval}
        axios.post(
            'users/approveUser/', JSON.stringify(data_send), {headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${localStorage.getItem('storage_token')}`
            }}
        ).then( response => {
            alert('Successfully approved the current host!')
        }).catch(error => {
            console.log(error.response)
            alert('Some kind of error occured...')
        }).finally(this.setState(prevState =>{
            return{
                approval: !prevState.approval
            }
        }))

        

    }
    
    render(){

        let permission = false
        
        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){
            if (this.props.app_state.isAdmin){
             permission = true
            }
        }

        let button_string 
        let button_obj
        
        if(this.state.host){
            button_string = this.state.approval ? "Deactivate" : "Approve"
            button_obj = <button onClick={this.handleApprovalChange}>{button_string}</button>
        }
        
        if (!permission){
            return(
                <h1>You can't access this page!</h1>
            )
        }else{
            return(
                <div>
                <div>{this.state.username}</div>    
                <div>{this.state.first_name}</div>    
                <div>{this.state.last_name}</div>    
                <div>{this.state.email}</div>    
                <div>{this.state.phone}</div>    
                {button_obj}        
                </div>
            )
        }

        
    }

}

export default UserDetail