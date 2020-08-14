import React from 'react';
import {Component} from 'react';

import axios from '../AXIOS_conf'
import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';


class HostRooms extends Component{

    constructor(props){
        super(props)

        this.state = {
            approved: false,
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

        
        
        const id = this.props.app_state.user_primary_key
        axios.get(`users/userList/${id}`/*,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem('storage_token')}`
        }}*/).then(response => { const user = response.data;
            console.log(user);
          this.setState({
            approved: user.approved
          });
          this.receivedData();
        }).catch(error => {console.log(error.response);})

              
        
        
    }

    receivedData(){
        
        
            const data = {host_id: this.props.app_state.user_primary_key}
            
            axios.post('/rooms/search/', JSON.stringify(data), {headers: { 
                'Content-Type': 'application/json'
              }})
              .then(res => {
                console.log('wtf')
                if (res.data==='not found'){
                    this.setState({
                        not_found: true
                    })
                }else{
                

                //check results if picture is null
                const data = res.data;
                let count = 0
                const price_data = data.map(d =>
                    ({ ...d,
                    total_price: d.price + ((this.state.people-1) * d.price_per_person)})
                    )
                
                
                price_data.sort( (a, b) => parseFloat(a.total_price) - parseFloat(b.total_price) )
                console.log(price_data)
                const slice = price_data.slice(this.state.offset, this.state.offset + this.state.perPage)
                console.log(slice)
                const postData = slice.map(pd =>
                //add a message if it's him!
                //this url shit will change hopefully
                <React.Fragment>
                    <Link to={`/hostRooms/${pd.pk}`}><p className="message">Name: {pd.name}</p> </Link>
                    <Link to={`/hostRooms/${pd.pk}`}><img src={"http://localhost:8000"+pd.rep_photo} style={{width:250,height: 250}} alt=""/> </Link>
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


    handlePageClick = (e) => {
        const selectedPage = e.selected;
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

            if(this.props.app_state.isHost){
                if(this.state.approved){

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


export default HostRooms
