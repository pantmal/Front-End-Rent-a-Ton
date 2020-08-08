import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'


class HostPage extends Component{

    constructor(props){
        super(props)

        this.state = {
            approved: false
        };
    }

    componentDidMount(){
        const id = this.props.app_state.user_primary_key
        axios.get(`users/userList/${id}`/*,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('storage_token')}`
        }}*/).then(response => { const user = response.data;
          this.setState({
            approved: user.approved
          })}).catch(error => {console.log(error.response);})
    }

    
    render(){

        let disapproved_msg
        let approved_msg
        let denial
    
        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){

            if(this.props.app_state.isHost){
                if(this.state.approved){
                    approved_msg = <h1 className="message">Coming soon...</h1>
                }else{
                    disapproved_msg = <h1 className="message">You don't have permission to access this page yet, please be patient</h1>
                }
            }


        }

        if(login_check === false || !this.props.app_state.isHost){
            denial = <h1 className="message">You can't access this page!</h1>
        }

        return(
            <div>
                {approved_msg}
                {disapproved_msg}
                {denial}
                
            </div>
        )
    }

}

export default HostPage