import React from 'react';
import {Component} from 'react';

import {Link} from 'react-router-dom';

class AdminPage extends Component{

    
    render(){

        let permission = false
        
        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){
            if (this.props.app_state.isAdmin){
             permission = true
            }
        }

        
        if (!permission){
            return(
                <h1>You can't access this page!</h1>
            )
        }else{
            return(
                <div>
                <h1>Welcome admin. You make click <Link to={'/userList/'}><span>here</span> </Link>  to manage users. If you want to export data choose between XML or JSON format.</h1>   
                </div>
            )
        }

        
    }

}

export default AdminPage