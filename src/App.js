import './App.css';
import { React, useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import {TextField, Button} from '@mui/material';

import Login from './components/Login';


const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvb2NqdXhvbXB0Y255amdhZ3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE5OTQ3NDEsImV4cCI6MTk5NzU3MDc0MX0.pSuxWo7XIjpa5uB39I4sCRy-w1DAFgbkMiIynMBOw-E";
const SUPABASE_URL = "https://foocjuxomptcnyjgagyh.supabase.co";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);




function App() {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  const [latestMessageId, setLatestMessageId] = useState(null);
  const [messages, setMessages] = useState([]);

  const SubmitMessage = async () => {
    console.log("Message send requested; sent with: " + message + " SENT BY: " + username);
    //-----------------------------------------------
    //Checking if the message has content, otherwise, continue
    //-----------------------------------------------
      document.getElementById("message").value = "";
      
      //Client Side displaying message for the user
      // var messageContainer = document.getElementById("messages");
      // let el = document.createElement('div');
      // el.setAttribute('class', 'message my-message');
      // el.innerHTML = `
      //   <div>
      //       <div class='name'>You</div>
      //       <div class='text'>${message}</div>
      //   </div>
      // `;
      // messageContainer.appendChild(el);


      // ----------------------------------------------
    
      //Server Side - Sending message to DB
      const { data, error } = await supabase 
      .from("msgs")
      .insert({ user_sent: username, content: message }); // sends the username and message content along with the time sent
      console.log('data:', data);
      console.log('error:', error); //Debugging the code
  } //const function closer

  //-----------------------------------------------------
  // Fetching the messages every second
  //-----------------------------------------------------
  
  useEffect(() => {
    const messageCall = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('msgs')
          .select('id, user_sent, content')
          .gt('id', latestMessageId || 0)
          .order('id', { ascending: true });
        
        if (error) throw error;
        
        if (data.length > 0) {
          setLatestMessageId(data[data.length - 1].id);
          setMessages((prevMessages) => [...prevMessages, ...data]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }, 1500);

    return () => clearInterval(messageCall);
  }, [latestMessageId]);
  

  //----------------------------------------------------
  //Anonymous saving username
  //----------------------------------------------------


  //----------------------------------------------------
  // ** SCROLLING TO BOTTOM ON TEXT TAB (MESSAGES)
  //----------------------------------------------------
  const ScrollToBottom = () => {
    var messagesElement = document.getElementById("messages-container");
    messagesElement.scrollTop = messagesElement.scrollHeight;
  }
  return (
    <>
    <header>
      <h1>Currently Viewing as: Guest (Anonymous)</h1>
      <p>Set your name to display when you send messages</p>
    </header>
    <Link to='/components/login'>Login</Link>
      <div className="customUsername">
        <TextField
          type='text'
          placeholder='Set your username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        ></TextField>
        <Button 
          variant='outlined' 
          size='large'
          >Save</Button>
      </div>

      <div className="messages-container" id='messages-container'>
        <div className="messages" id='messages'>
        {messages.map((message) => (
          <div key={message.id}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" 
              alt="User Profile"
              width="40px"></img>
            <p>
              <span className='externalUser'>
                {message.user_sent}
              </span>: <br></br>{message.content}</p>
          </div>
        ))}
        </div>
      </div>

      <div className="chatInput">
        <TextField 
          type='text'
          id='message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          ></TextField>
        <Button 
          variant='outlined'
          size='large'
          onClick={SubmitMessage}
        >sEND</Button>
      </div>



  <Router>
     <Switch>
      <Route exact path="/components/login" component={Login }/>
    </Switch>
  </Router>,
    </>
  );
}

export default App;
