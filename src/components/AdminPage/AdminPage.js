import React from 'react';
import {Component} from 'react';

import {Link} from 'react-router-dom';

import './adminPage.css'

import axios from '../AXIOS_conf'

class AdminPage extends Component{


    constructor(props){
        super(props)


        this.handleXMLClick = this.handleXMLClick.bind(this)
        this.handleJSONClick = this.handleJSONClick.bind(this)
    }

    handleXMLClick = event =>{

        alert('You have chosen to export data to XML format. You will be notified upon completion.')

        const data = {type:'xml'}

        axios.post('/rooms/exportData/',JSON.stringify(data), {headers: { 
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('storage_token')}`
          }}).then(response => {alert('The data has been exported.');  
            }).catch(error => {
                console.log(error.response);   
                alert('Some kind of error occured, please try again.')
            })

    }

    handleJSONClick = event =>{

        alert('You have chosen to export data to JSON format. You will be notified upon completion.')

        const data = {type:'json'}

        axios.post('/rooms/exportData/',JSON.stringify(data), {headers: { 
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('storage_token')}`
          }}).then(response => {alert('The data has been exported.');  
            }).catch(error => {
                console.log(error.response);   
                alert('Some kind of error occured, please try again.')
            })

    }



    
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
                <h1 className="message">You can't access this page!</h1>
            )
        }else{
            return(
                <div>
                <h1 className="message">Welcome dear admin. You make click <Link to={'/userList/'}><span>here</span> </Link> to manage users. </h1>
                <h1 className="message">If you want to export data choose between <button className="apply" onClick={this.handleXMLClick}>XML</button> or <button className="apply" onClick={this.handleJSONClick}>JSON</button> format. </h1>
                </div>
            )
        }

        
    }

}

export default AdminPage