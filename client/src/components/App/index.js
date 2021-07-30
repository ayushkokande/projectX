import React, { Component } from 'react';
import * as ROUTES from '../../Constants/routes'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SignInPage from '../SignIn'
import Drawer from '../Drawer'
import axios from 'axios'
import ActivityContext from '../../Contexts/ActivityContext';
import FirebaseContext from '../Firebase/Context';
import { Link } from 'react-router-dom';
import AuthUserContext from '../../Contexts/AuthUserContext';

class App extends Component{
    constructor(){
      super();
      this.state = {
        res:null,
        userData:null,
        authUser :null,
      }
    }
    componentDidMount(){
      
      let firebase = this.context;
      // this is a listener
      //it changes the state every time someone logs-in or logs-out.
      this.listener = firebase.auth.onAuthStateChanged(authUser=>{
        authUser 
          ? axios.get(`/api/${authUser.uid}/getUser`).then( (res)=> {
              this.setState({authUser:res.data})
            })
          : this.setState({authUser:null})
        //second opertation
        //this fethes the currentUser from backend and sets the state
      });
      
    }
    componentWillUnmount(){
      this.listener();
    }
  
  render(){
    let firebase = this.context;
    return(
      <AuthUserContext.Provider value = {{authUser:this.state.authUser,setAuthUser:(authUser)=>{this.setState({authUser})}}}>
        <Router>
          <div>
            <ActivityContext.Provider value =  {this.state.userData}>
              <Route  path = "/home" render = {() =><Drawer/> }/>
              <Route exact path = {ROUTES.SIGN_IN} component = {SignInPage}/>
            </ActivityContext.Provider>
          </div>
      </Router>
    </AuthUserContext.Provider>
    )
  }
};
App.contextType = FirebaseContext

  
export default App
