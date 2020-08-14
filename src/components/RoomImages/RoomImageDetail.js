import React from 'react';
import {Component} from 'react';

import {Link, Route} from 'react-router-dom';

import axios from '../AXIOS_conf'


class RoomImageDetail extends Component{

    constructor(props){
        super(props)

        this.state = {
            pk: '',
            room_id: '',
            picture: '',
            imagePreviewUrl:'',
            host_id: '',
            approval: false
        }

        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this._handleImageChange = this._handleImageChange.bind(this)
    }

    _handleImageChange(e) {
        e.preventDefault();
    
        let reader = new FileReader();
        let file = e.target.files[0];
    
        reader.onloadend = () => {
          this.setState({
            picture: file,
            imagePreviewUrl: reader.result
          });
        }
        
        console.log(reader.result)
        reader.readAsDataURL(file)
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
          })
           if(this.state.approved){
            const {id} = this.props.match.params
            axios.get(`rooms/roomImages/${id}`/*, {
                headers: {
                  Authorization: `JWT ${localStorage.getItem('storage_token')}`
                }}*/).then( 
                    response => {
                    const res_image = response.data
                    this.setState({
                        pk: res_image.pk,
                        room_id: res_image.room_id_img,
                        picture: res_image.picture,
                        imagePreviewUrl: res_image.picture
                    })

                    axios.get(`rooms/roomList/${this.state.room_id}`/*, {
                        headers: {
                          Authorization: `JWT ${localStorage.getItem('storage_token')}`
                        }}*/).then( 
                    response => {
                        const res_room = response.data
                        this.setState({
                            host_id: res_room.host_id
                        })
    
                        if(this.state.host_id != this.props.app_state.user_primary_key){
                            alert('You can only edit your own images')
                            this.props.history.push("/")
                        }
                    }
                )

                }
            )
           }   
        }).catch(error => {console.log(error.response);})
        
        
    }

    handleUpdate = event =>{

        const data = {
            room_id_img: this.state.room_id,
            picture: this.state.picture
        }

        const formData = new FormData();

        formData.append("room_id_img", data.room_id_img);
        formData.append("picture", data.picture);

        axios.patch(`rooms/roomImages/${this.state.pk}/`, formData, {headers: {
            'Content-Type': 'application/json'/*,
            Authorization: `JWT ${localStorage.getItem('storage_token')}`*/
                
          }}).then(response => {alert('Your image has been updated. ');  
            }).catch(error => {
                console.log(error.response);   
                alert('Some kind of error occured, please try again.')
            })

    }

    handleDelete = event =>{

        axios.delete(`rooms/roomImages/${this.state.pk}/`, {headers: {
            'Content-Type': 'application/json'/*,
            Authorization: `JWT ${localStorage.getItem('storage_token')}`*/
                
          }}).then(response => {alert('Your image has been deleted. ');  
            this.props.history.push(`/roomImages/${this.state.room_id}`)
            }).catch(error => {
                console.log(error.response);   
                alert('Some kind of error occured, please try again.')
            })

    }



    
    
    render(){

        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} style={{width:500,height: 500}} />);
        }

        let permission = false
        
        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){
            if (this.props.app_state.isHost){
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
                    {$imagePreview} <br/>
                    <h5 className="message" >Choose a new picture: <input type="file" onChange={this._handleImageChange} /> </h5> <br/>
                    <button className="apply" onClick={this.handleUpdate}>Update this image</button>
                    <button className="apply" onClick={this.handleDelete}>Delete this image</button>
                </div>
            )
        }

        
    }

}

export default RoomImageDetail