import React, { useState, useEffect } from "react";
import {Button, TextField, Alert} from '@mui/material';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from 'react-router-dom';


import { createClient } from "@supabase/supabase-js";

import CheckMail from "./CheckMail";
import './stylesheets/Register.css';


const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvb2NqdXhvbXB0Y255amdhZ3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE5OTQ3NDEsImV4cCI6MTk5NzU3MDc0MX0.pSuxWo7XIjpa5uB39I4sCRy-w1DAFgbkMiIynMBOw-E';
const SUPABASE_URL = "https://foocjuxomptcnyjgagyh.supabase.co";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);



function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //verify logged in
    const [isAuthed, setIsAuthed] = useState(false);
    const [isDBVer, setIsDBVer] = useState(false);
    const [isTotalConfirm, setIsTotalConfirm] = useState(false);

    const accountData = useState("");

    let history = useHistory();

    const signUp = async () => {
        console.log("User requested to signup account");
        
        //Supabase auth api
        const { error, data } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });
        if(error) {
            console.log("Auth Service, creating account failed: ", error);
        } else {
            console.log("Debugging, display data session: ", data);

            sessionStorage.setItem("user", data.user.user_metadata.username);
            sessionStorage.setItem("userEmail", data.user.email);

            setIsAuthed(true);
            setTimeout(authPost, 2000);
        }

        //Pass account creation "Data" and "Error" variables to a useState() to be called in creation of token
        accountData(data);

        //supabase sql api
        const { errorDB, dataDB } = await supabase
            .from("users")
            .insert({
                username: username,
                email: email,
            });
        if(errorDB) {
            console.log("Exception Experienced: ", errorDB);
            setIsDBVer(true);
            setTimeout(authPost, 2000); // after 2s, check auth status. 2 seconds to ensure service functionality
        } else {
            console.log("Database returned with TRUE, CONTENT RETURNED: ", dataDB);
            
            
        }
    }


    const authPost = () => {
        console.log("Running AuthPost, checking if the user has validated all security checks");
        if(setIsDBVer) {
            console.log("Stage 1/2 Verified - DB");
            if(setIsAuthed) {
                console.log("Stage 2/2 Verified Auth Creation");
                console.log("User is logged in... returning to chat and assigning unique token id");
                
                //The user has logged in
                //Before accessing user { session } information, the user must validate their email
                
                setIsTotalConfirm(true);
            } else {
                console.error("You failed the logging process with the Auth service, ensure that all fields are entered correctly. Check console for exceptions when logging in (Ctrl + Shift + I) -> Console")
            }
        }
    }


    return (
        <>
            <Router>
                <Switch>
                    <Route path="/checkmail" element={<CheckMail />} />
                </Switch>
                {isTotalConfirm ? history.push("/checkmail") : console.log("error transportation")} 
            </Router>
            <div className="register">
            <h1 className="header">Create your new account!</h1>
            <div className="signUpForm">
                
                <form>
                    <TextField
                        placeholder="Username"
                        value={(username)}
                        onChange={(e) => setUsername(e.target.value)} 
                        type='text'
                        maxLength="10"
                        required
                        fullWidth
                         /><p></p>
                    <TextField
                        placeholder="example@domain.com"
                        value={(email)}
                        type='email'
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                    /> <p></p>
                    <TextField
                        placeholder="password"
                        value={(password)}
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        minLength="8"
                        required
                    /><p></p>
                    <input type="checkbox" />
                    <span>Remember me?</span><p></p>
                    <Button 
                        variant="contained"
                        onClick={signUp}
                    >Signup</Button>
                </form>
            </div>
        </div>
        </>
    )
}
export default Register;