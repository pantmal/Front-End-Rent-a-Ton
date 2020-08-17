import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'
import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';


class RenterRooms extends Component{

    constructor(props){
        super(props)

        this.state = {
            offset: 0,
            users: [],
            perPage: 2,
            currentPage: 0,
            not_found: false,
            receivedData: this.receivedData()
        }

        this.handlePageClick = this.handlePageClick.bind(this);

    }

    componentDidMount(){

        
        
    //     const id = this.props.app_state.user_primary_key
    //     axios.get(`users/userList/${id}`/*,
    //   {
    //     headers: {
    //       Authorization: `JWT ${localStorage.getItem('storage_token')}`
    //     }}*/).then(response => { const user = response.data;
    //         console.log(user);
    //       this.setState({
    //         approved: user.approved
    //       });
    //       this.receivedData();
    //     }).catch(error => {console.log(error.response);})

        this.receivedData();
        
        
    }

    receivedData(){
        
        
            const data = {renter_id: this.props.app_state.user_primary_key}
            
            axios.post('/rooms/search/', JSON.stringify(data), {headers: { 
                'Content-Type': 'application/json'
              }})
              .then(res => {
                
                if (res.data==='not found'){
                    this.setState({
                        not_found: true
                    })
                }else{
                

                //check results if picture is null
                const data = res.data;
                // const price_data = data.map(d =>
                //     ({ ...d,
                //     total_price: d.price + ((this.state.people-1) * d.price_per_person)})
                //     )
                
                
                data.sort( (a, b) => parseFloat(a.total_price) - parseFloat(b.total_price) )
                //console.log(price_data)
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                console.log(slice)
                const postData = slice.map(pd =>
                //add a message if it's him!
                //this url shit will change hopefully
                <React.Fragment>
                    <Link to={`/renterRooms/${pd.pk}`}><p className="message">Name: {pd.name}</p> </Link>
                    <Link to={`/renterRooms/${pd.pk}`}><img src={"http://localhost:8000"+pd.rep_photo} style={{width:250,height: 250}} alt=""/> </Link>
                    <p className="message">Type: {pd.room_type}</p>
                    <p className="message">Beds: {pd.beds}</p>
                    <hr/>
                </React.Fragment>)

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    postData
                })
                
            }
        })
        

    }


    handlePageClick = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset,
            receivedData: this.receivedData()
        });

    };


    render(){
        let not_found_msg = <h1 className="message">Sorry, nothing found</h1>

        let login_check = this.props.app_state.isLoggedIn;
        if (login_check){
            if(this.props.app_state.isRenter){
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
                            {paginate}
                            {this.state.postData}
                            {paginate}
                        </div>
                    )
                }else{
                    return(
                        <div>
                        {not_found_msg}
                        </div>
                    )
                }

                
            }
        }

        if(login_check === false || !this.props.app_state.isRenter){
            return( <h1 className="message">You can't access this page!</h1>)
        }

    }


}


export default RenterRooms
