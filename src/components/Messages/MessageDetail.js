import React from 'react';
import {Component} from 'react';

import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';

import axios from '../AXIOS_conf'


//DATE IS NOT SHOWN 

class MessageDetail extends Component{

    constructor(props){
        super(props)

        this.state = {
            sender_mode: false,
            pk: '',
            sender_name: '',
            receiver_name: '',
            sender: '',
            receiver: '',
            title: '',
            content: '',
            date:'',
            reply:'',
            errors: {},
            offset: 0,
            users: [],
            perPage: 10,
            currentPage: 0
        };

        this.handleContentChange = this.handleContentChange.bind(this)
        this.handleReplyChange = this.handleReplyChange.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleReplySubmit = this.handleReplySubmit.bind(this)

    }

    componentDidMount(){

        let id = this.props.match.params.id
        axios.get(
            `users/messageList/${id}`, {headers: {
                'Content-Type': 'application/json'/*,
                Authorization: `JWT ${localStorage.getItem('storage_token')}`*/
            }}
        ).then( response => {
            console.log(response)
            this.setState({
                pk: response.data.pk,
                sender_name: response.data.sender_name,
                receiver_name: response.data.receiver_name,
                sender: response.data.sender,
                receiver: response.data.receiver,
                title: response.data.title,
                content: response.data.content,
                date: response.data.date
            })

            if (this.props.app_state.user_primary_key == response.data.sender){
                this.setState({
                    sender_mode: true
                })  
            }else{
                this.setState({
                    sender_mode: false
                })
            }

        }).catch(error => {
            console.log(error.response)
            alert('Some kind of error occured...')
        })



    }

    
    handleReplyChange = event => {
        const form_reply = event.target.value
        this.setState({
            reply: form_reply
        })
    }

    handleReplyValidation(){
        
        let errors = {};
        let formIsValid = true;

        if(this.state.reply == ''){
            formIsValid = false;
            errors["reply"] = "\u2757Cannot be empty";
        }

        this.setState({errors: errors});

        return formIsValid;
    }

    handleReplySubmit(){
        

        if(this.handleReplyValidation()){

            let date = new Date();
            let year = date.getFullYear()
            let month = date.getMonth()+1
            let day = date.getDate()

            let date_now = `${year}-${month}-${day}`
            console.log(this.props.app_state.username)
            const msg_data = {
                sender: this.props.app_state.user_primary_key,
                receiver: this.state.sender,
                sender_name: this.props.app_state.username,
                receiver_name: this.state.sender_name,
                title: 'Re:'+this.state.title,
                content: this.state.reply,
                date: date_now
            }

            axios.post(
                'users/messageList/', JSON.stringify(msg_data), {headers: {
                    'Content-Type': 'application/json'/*,
                    Authorization: `JWT ${localStorage.getItem('storage_token')}`*/
                }}
            ).then( response => {
                console.log(response)
                alert('Your reply has been sent successfully.')
            }).catch(error => {
                console.log(error.response)
                alert('Some kind of error occured...')
            })

        }

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

        if(this.state.content == ''){
            formIsValid = false;
            errors["content"] = "\u2757Cannot be empty";
        }

        this.setState({errors: errors});

        return formIsValid;
    }


    handleUpdate = event =>{

        if(this.handleValidation()){

            let date = new Date();
            let year = date.getFullYear()
            let month = date.getMonth()+1
            let day = date.getDate()

            let date_now = `${year}-${month}-${day}`

            const msg_data = {
                sender: this.props.app_state.user_primary_key,
                receiver: this.state.receiver,
                sender_name: this.state.sender_name,
                receiver_name: this.state.receiver_name,
                title: this.state.title,
                content: this.state.content,
                date: date_now
            }
    
            axios.patch(`users/messageList/${this.state.pk}/`, JSON.stringify(msg_data), {headers: {
                'Content-Type': 'application/json'/*,
                Authorization: `JWT ${localStorage.getItem('storage_token')}`*/
                    
              }}).then(response => {alert('Your message has been updated. ');  
                }).catch(error => {
                    console.log(error.response);   
                    alert('Some kind of error occured, please try again.')
                })

        }

        

    }


    handleDelete = event =>{

        axios.delete(`users/messageList/${this.state.pk}/`, {headers: {
            'Content-Type': 'application/json'/*,
            Authorization: `JWT ${localStorage.getItem('storage_token')}`*/
                
          }}).then(response => {alert('Your message has been deleted. ');  
            this.props.history.push({pathname:'/userMessages/type=rec'})
            }).catch(error => {
                console.log(error.response);   
                alert('Some kind of error occured, please try again.')
            })

    }

    render(){

        if(this.props.app_state.isRenter || this.props.app_state.isHost){


            let sender_stuff
            let receiver_stuff
            if(this.state.sender_mode){
                sender_stuff = <div>
                <h2 className="message"> Sent to:{this.state.receiver_name}</h2>
                <h2 className="message"> Title:{this.state.title}</h2>
                <h5 className="message" > Message:<textarea defaultValue={this.state.content} onChange={this.handleContentChange} /></h5> 
                <span style={{color: "red"}}>{this.state.errors["content"]}</span> <br/>
                <button className="apply" onClick={this.handleUpdate}>Update this message</button>
                <button className="apply" onClick={this.handleDelete}>Delete this message</button>
                </div>
            }else{
                receiver_stuff = <div>
                <h2 className="message"> Sent by:{this.state.sender_name}</h2>
                <h2 className="message"> Title:{this.state.title}</h2>
                <h5 className="message" > Message:{this.state.content}</h5> 
                <h5 className="message" > Add a reply:<textarea onChange={this.handleReplyChange} /></h5> 
                <span style={{color: "red"}}>{this.state.errors["reply"]}</span> <br/>
                <button className="apply" onClick={this.handleReplySubmit}>Add a reply</button>
                </div>
            }


            return(
                <div>
                {sender_stuff}
                {receiver_stuff}
                </div>
            )

        }else{
            return(<h1 className="message" >You can't access this page!</h1>)
        }

    }

}



export default MessageDetail