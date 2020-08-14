import React from 'react';
import {Component} from 'react';
import {Link} from 'react-router-dom';

import axios from '../AXIOS_conf'
import ReactPaginate from 'react-paginate';


class RoomImages extends Component{

    constructor(props){
        super(props)

        this.state = {
            approved: false,
            not_found: false,
            room_id: '',
            offset: 0,
            users: [],
            perPage: 2,
            currentPage: 0,
            host_id: '',
            files: [],
            imagesPreviewUrls: [],
            receivedData: this.receivedData()
        }

        this.handlePageClick = this.handlePageClick.bind(this);
        this._handleMultipleImageChange = this._handleMultipleImageChange.bind(this)
        this.handleNewImages = this.handleNewImages.bind(this);
        //this.receivedData = this.receivedData.bind(this)
    }

    _handleMultipleImageChange = e =>{
        e.preventDefault();

        // FileList to Array
        let files = Array.from(e.target.files);

        // File Reader for Each file and and update state arrays
        files.forEach((file, i) => {
            let reader = new FileReader();

            reader.onloadend = () => {
                this.setState(prevState => ({
                    files: [...prevState.files, file],
                    imagesPreviewUrls: [...prevState.imagesPreviewUrls, reader.result]
                }));
            }

            reader.readAsDataURL(file);
        });
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
            axios.get(`rooms/roomList/${id}`/*, {
                headers: {
                  Authorization: `JWT ${localStorage.getItem('storage_token')}`
                }}*/).then( 
                    response => {
                    const res_room = response.data
                    this.setState({
                        room_id: res_room.pk,
                        host_id: res_room.host_id
                    })


                    if(this.state.host_id != this.props.app_state.user_primary_key){
                        alert('You can only edit your own images')
                        this.props.history.push("/")
                    }
                    this.receivedData()
                }
            )
           }   
        }).catch(error => {console.log(error.response);})
        
        
    }

    receivedData(){
        
        const id = this.props.match.params.id
        const data = {room_id_img: id}
            
            axios.post('/rooms/getImages/', JSON.stringify(data), {headers: { 
                'Content-Type': 'application/json'
              }})
              .then(res => {
                
                if (res.data==='not found'){
                    this.setState({
                        not_found: true
                    })
                }else{

                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                console.log(slice)
                const postData = slice.map(pd =>
                //add a message if it's him!
                //this url shit will change hopefully
                <React.Fragment>
                    <Link to={`/roomImageDetail/${pd.pk}`}><img src={"http://localhost:8000"+pd.picture} style={{width:250,height: 250}} alt=""/> </Link>
                    <hr/>
                </React.Fragment>)

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    postData
                })
                
            }
        })
        

    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset,
            receivedData: this.receivedData()
        });

    };

    handleNewImages = event => {
        let room_id = this.state.room_id
        
        if(this.state.files.length > 0){
            this.state.files.forEach(function(value, index, array) {
              const formData = new FormData();
 
              formData.append("room_id_img", room_id);
              formData.append("picture", value);
              axios.post('rooms/roomImages/',formData, {headers: {
                  'Content-Type': 'application/json'
                }}).then(response => {console.log('ok');
                }).catch(error => {console.log(error.response);})  
              })
            alert('Your new images have been added successfully. Reload the page to see them on the list')      
          }
    }


    render(){

        let not_found_msg = <h1 className="message">Sorry, nothing found</h1>

        let {imagesPreviewUrls} = this.state;        

        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){

            if(this.props.app_state.isHost){
                if(this.state.approved){

                    let add_photos = <div><h5 className="message" >Add more images: </h5>
                    <input className="message" type="file" onChange={this._handleMultipleImageChange} multiple/>
                    {imagesPreviewUrls.map(function(imagePreviewUrl, i){
                        return <div> <img key={i} src={imagePreviewUrl} style={{width:100,height: 100}} /> <br/> </div>
                        })}
                    <button className="apply" onClick={this.handleNewImages}>Post new images</button>
                    </div>

                    if (this.state.not_found === false){

                    let paginate = 
                
                    <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                breakLabel={"..."}
                                breakClassName={"break-me"}
                                pageCount={this.state.pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={this.handlePageClick}
                                containerClassName={"pagination"}
                                subContainerClassName={"pages pagination"}
                                activeClassName={"active"}
                                forcePage={this.state.currentPage}
                    />

                    return(
                        <div>
                            {add_photos}
                            {paginate}
                            {this.state.postData}
                            {paginate}
                        </div>
                    )
                    }else{
                        return(
                            <div>
                            {add_photos}
                            {not_found_msg}
                            </div>
                        )
                    }
                    
                }else{
                    return(<h1 className="message">You don't have permission to access this page yet, please be patient</h1>)
                }
            }
        }

        if(login_check === false || !this.props.app_state.isHost){
            return( <h1 className="message">You can't access this page!</h1>)
        }

    }

    

}

export default RoomImages