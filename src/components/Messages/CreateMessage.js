import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'

class CreateMessage extends Component{
    
    constructor(props){
        super(props)

        let default_mode = false

        let query = this.props.match.params
        let rec_id = '';
        if (query.parameters!=null){
            default_mode = true

            rec_id = query.parameters
        }

        this.state = {
            default_mode: default_mode,
            rec_id: rec_id,
            username:'',
            title:'',
            content:'',
            errors: {}
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleContentChange = this.handleContentChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }      

    componentDidMount(){

        
        if(this.state.rec_id !== ''){
            axios.get(`users/userList/${this.state.rec_id}`/*, {
                headers: {
                Authorization: `JWT ${localStorage.getItem('storage_token')}`
                }}*/).then( 
                response => {
                    const res_user = response.data
                    this.setState({
                        username: res_user.username
                    })
                }
            )

        }
        
    }

    handleUsernameChange = event => {
        const form_name = event.target.value
        this.setState({
            username: form_name
        })
    }

    handleTitleChange = event => {
        const form_title = event.target.value
        this.setState({
            title: form_title
        })
    }

    handleContentChange = event => {
        const form_content = event.target.value
        this.setState({
            content: form_content
        })
    }

    handleValidation(){
        
        let errors = {};
        let formIsValid = true;

        // if(this.state.default_mode){
        //     this.setState({
        //         username: this.state.host_username
        //     })
        // }
        if(this.state.username == ''){
            formIsValid = false;
            errors["name"] = "\u2757Cannot be empty";
        }

        if(this.state.username == this.props.app_state.username ){
            formIsValid = false;
            errors["name"] = "\u2757Cannot sent a message to yourself";
        }
        

        if(this.state.title == ''){
            formIsValid = false;
            errors["title"] = "\u2757Cannot be empty";
        }

        if(this.state.content == ''){
            formIsValid = false;
            errors["content"] = "\u2757Cannot be empty";
        }

        this.setState({errors: errors});

        return formIsValid;
    }

    handleFormSubmit = event => {
        event.preventDefault()

        if(this.handleValidation()){
            const data = {username: this.state.username}
            axios.post(
                'users/getUserByName/', JSON.stringify(data), {headers: {
                    'Content-Type': 'application/json'/*,
                    Authorization: `JWT ${localStorage.getItem('storage_token')}`*/
                }}
            ).then( response => {
                console.log(response)
                this.setState({
                    rec_id: response.data.pk
                })
            }).catch(error => {
                console.log(error.response)
                alert('Some kind of error occured...')
            })

            let date = new Date();
            let year = date.getFullYear()
            let month = date.getMonth()+1
            let day = date.getDate()

            let date_now = `${year}-${month}-${day}`
            console.log(this.props.app_state.username)
            const msg_data = {
                sender: this.props.app_state.user_primary_key,
                receiver: this.state.rec_id,
                sender_name: this.props.app_state.username,
                receiver_name: this.state.username,
                title: this.state.title,
                content: this.state.content,
                date: date_now
            }

            axios.post(
                'users/messageList/', JSON.stringify(msg_data), {headers: {
                    'Content-Type': 'application/json'/*,
                    Authorization: `JWT ${localStorage.getItem('storage_token')}`*/
                }}
            ).then( response => {
                console.log(response)
                alert('Your message has been sent successfully. You may see your sent and received messages at the message list')
            }).catch(error => {
                console.log(error.response)
                alert('Some kind of error occured...')
            })
            

        }

    }

    render(){

        if(this.props.app_state.isRenter || this.props.app_state.isHost){
            let rec_field 
            if(this.state.default_mode){
                rec_field =<div> <h2 className="message"> Send to:<input name="receiver" defaultValue={this.state.username} onChange={this.handleUsernameChange} /></h2> <br/></div>
            }else{
                rec_field =<div> <h2 className="message"> Send to:<input name="receiver" onChange={this.handleUsernameChange} /></h2> <br/></div>
            }

            return(
                <div>
                    <form onSubmit={this.handleFormSubmit}>
                        {rec_field}
                        <span style={{color: "red"}}>{this.state.errors["name"]}</span>
                        <h2 className="message"> Title:<input name="title" onChange={this.handleTitleChange} /></h2>
                        <span style={{color: "red"}}>{this.state.errors["content"]}</span>
                        <h5 className="message" > Message:<textarea onChange={this.handleContentChange} /></h5> 
                        <span style={{color: "red"}}>{this.state.errors["content"]}</span>
                        <br/>
                        <button className="apply">Send message!</button>
                    </form>
                </div>
            )
        }else{
            return(<h1 className="message" >You can't access this page!</h1>)
        }

        
    }

}


export default CreateMessage