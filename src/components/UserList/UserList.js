import React from 'react';
import {Component} from 'react';

import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';

import axios from '../AXIOS_conf'

class UserList extends Component{


    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            users: [],
            perPage: 2,
            currentPage: 0
        };

        this.handlePageClick = this.handlePageClick.bind(this);
    }

    receivedData() {
        axios
            .get('users/userList/')
            .then(res => {

                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const postData = slice.map(pd => <React.Fragment>
                    <Link to={`/userDetail/${pd.pk}`}> <p>{pd.username}</p> </Link>
                    <p>{pd.first_name}</p>
                    <p>{pd.last_name}</p>
                    <p>Approved: {pd.approved?'yes':'no'}</p>
                    <hr/>
                </React.Fragment>)

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                   
                    postData
                })
            });
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData()
        });

    };

    componentDidMount() {
        this.receivedData()
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
                <h1>You can't access this page!</h1>
            )
        }else{
            return (
                <div>
                    {this.state.postData}
                    <ReactPaginate
                        previousLabel={"prev"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={this.state.pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}/>
                </div>
    
            )
        }

        
    }

}

export default UserList