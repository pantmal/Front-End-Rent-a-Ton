import React from 'react';
import {Component} from 'react';
import ReactPaginate from 'react-paginate';

import queryString from 'query-string'

import axios from '../AXIOS_conf'

class Search extends Component{

    constructor(props){
        super(props)

        const search_values = queryString.parse(this.props.location.search)
        

        this.state = {
            hood: search_values.hood,
            city: search_values.city,
            country: search_values.country,
            s_date: search_values.start_date,
            e_date: search_values.end_date,
            people: search_values.people,
            offset: 0,
            users: [],
            perPage: 10,
            currentPage: 0,
            not_found: false,
            receivedData: this.receivedData
        }

        this.handlePageClick = this.handlePageClick.bind(this);
    }

    
    receivedData() {
        axios.post('/rooms/search/',JSON.stringify(this.state), {headers: { //change the data being sent
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
                /*let count = 0
                const price_data = data.map(d =>
                    (
                    { ...d,
                    price: count+=1
                    }
                    )
                    )
                */
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                console.log(slice)
                const postData = slice.map(pd =>
                //add a message if it's him!
                //this url shit will change hopefully
                <React.Fragment>
                    <p className="message">Name: {pd.name}</p> 
                    <img src={"http://localhost:8000"+pd.rep_photo} style={{width:250,height: 250}} alt=""/> 
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

    componentDidMount(){
        this.receivedData()
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

        
        let not_found_msg = <h1 className="message">Sorry, nothing found</h1>

        let permission = false
        if (this.props.app_state.isRenter || !this.props.app_state.isLoggedIn){
            permission = true
        }

        if(!permission){
            return(
                <h1 className="message">You can't access this page!</h1>
            )
        }else{

            if (this.state.not_found === false){
                
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



}

export default Search