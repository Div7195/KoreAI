import React from 'react'
import { useState ,useContext} from 'react'
import {Box,Button,TextField,styled,Typography} from '@mui/material'

import { DataContext } from '../context/DataProvider'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    const {setAccount} = useContext(DataContext);
    const initialLogin = {
        username:'',
        password:''
    }
    const signupInitialValues = {
        username:'',
        password:''
    }
    const [toggle, setToggle] = useState('login')
    const [loginValues, setLogin] = useState(initialLogin)
    const [signupValues, setSignup] = useState(signupInitialValues)
    const onLoginValueChange = (e) => {
        setLogin({...loginValues, [e.target.name] : e.target.value})
        console.log(loginValues)
    }

    const onSignupValueChange = (e) => {
        setSignup({...signupValues, [e.target.name] : e.target.value})
        console.log(signupValues)
    }
   
    const signupUser = async() =>{
        const settings = {
         method: "POST",
         body: JSON.stringify(signupValues),
         headers: {
             "Content-type": "application/json; charset=UTF-8"
         }
         }
         try {
             console.log(settings.body)
             const fetchResponse = await fetch(`http://localhost:8000/signup`, settings);
             const response = await fetchResponse.json();
             if(response.msg === 'Signup successful'){
                setSignup(signupInitialValues);
                toggle('login');
             }
             
             
         } catch (e) {
             return e;
         }    
     }

    const loginUser = async() => {
        const settings = {
            method: "POST",
            body: JSON.stringify(loginValues),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
            }
            try {
                const fetchResponse = await fetch(`http://localhost:8000/login`, settings);
                const response = await fetchResponse.json();
                
                if(response.msg === 'Username does not exist'){
                    setLogin(initialLogin)
                    return
                }
                setAccount({username : response.username, loggedIn:true, id:response.userId});
                setLogin(initialLogin)
                if(response.msg === "Login successful"){
                    navigate('/chats')
                }
            } catch (e) {
                
            }
    }

    return(
        <>
        <div>           {
                            toggle === 'login' ?
                            <>
                            <div className='popup-container' >
                            <div className="form-container" onClick={(e) => e.stopPropagation()}>
                                <h2 style={{ fontFamily: 'AktivGrotesk-Bold',  textAlign:'center' }}>Login</h2>
                                <form style={{height:'100%'}}>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    <input className="fname"  placeholder="Enter email*" type="text" name="username" id='username' onChange={(e) => {onLoginValueChange(e)}} />
                                    <input className="lname" placeholder="Enter password*" type="email" name="password" id='password'onChange={(e) => {onLoginValueChange(e)}}/>
                                    
                                </div>
                                
                                <div className='btwr' onClick={() => {loginUser()}} >Login</div>
                                <div className='button-enter' onClick={() => setToggle('signup')}>Make new account</div>
                                </form>
                            </div>
                            </div>
                            </>
                            :
                            <>
                            <div className='popup-container' >
                            <div className="form-container" onClick={(e) => e.stopPropagation()}>
                                <h2 style={{ fontFamily: 'AktivGrotesk-Bold',  textAlign:'center' }}>Signup</h2>
                                <form style={{height:'100%'}}>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    <input className="fname"  placeholder="Enter email*" type="text" name="username" id='username' onChange={(e) => {onSignupValueChange(e)}} />
                                    <input className="lname" placeholder="Enter password*" type="email" name="password" id='password'onChange={(e) => {onSignupValueChange(e)}}/>
                                    
                                </div>
                                
                                <div className='btwr' onClick={() => {signupUser()}} >Signup</div>
                                <div className='button-enter' onClick={() => setToggle('login')}>Already have account</div>
                                </form>
                            </div>
                            </div>
                            </>
                        }
                        
                        </div>
        </>
    )
}
export default Login