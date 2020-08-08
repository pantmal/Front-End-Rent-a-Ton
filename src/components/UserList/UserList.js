import React from 'react';
import {Component} from 'react';

import ReactPaginate from 'react-paginate';
import {Link} from 'react-router-dom';

import axios from '../AXIOS_conf'

import './userList.css'

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
        axios.get('users/userList/')
            .then(res => {

                //check results if picture is null
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const postData = slice.map(pd =>
                //add a message if it's him!
                <React.Fragment>
                    <Link to={`/userDetail/${pd.pk}`}> <p>Username: {pd.username}</p> </Link>
                    <Link to={`/userDetail/${pd.pk}`}><img src={pd.picture} style={{width:250,height: 250}} alt=""/> </Link> <br/>
                    <p className="message">Fist name: {pd.first_name}</p>
                    <p className="message">Last name: {pd.last_name}</p>
                    <p className="message"> Admin: {pd.is_staff ? '\u2705':'\u274c'}</p>
                    <p className="message"> Host: {pd.is_host ? '\u2705':'\u274c'}</p>
                    <p className="message"> Renter: {pd.is_renter ? '\u2705':'\u274c'}</p>
                    <p className="message"> Approved: {pd.approved ? '\u2705':'\u274c'}</p>
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
                        activeClassName={"active"}/>
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