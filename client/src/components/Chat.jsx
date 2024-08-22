import SendIcon from '@mui/icons-material/Send';
import { useState, useEffect, useContext } from 'react';
import socket from "socket.io-client";
import { useParams } from 'react-router-dom';
import { DataContext } from '../context/DataProvider.jsx';
import AttachmentIcon from '@mui/icons-material/Attachment';
import FormControl from '@mui/material/FormControl';
const Chat = () => {
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const {chatId} = useParams()
    const {friendName} = useParams()

    const queryInitial = {
        content:'',
        senderId:account.id,
        messageType:'text'
    }
    const [typingIndicator, setTyping] = useState({
        userTypingId:'',
        message:''
    })
    const [offset, setOffset] = useState(0);
    const [allMessagesLoaded, setAllMessagesLoaded] = useState(false);

    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState([])
    const [onlineStatus, setOnline] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [query, setQuery] = useState(queryInitial)
    const io = socket.connect("http://localhost:8000");
    

    const loadMessages = async () => {
        const url = `http://localhost:8000/getChatMessages?chatId=${chatId}&limit=20&offset=${offset}`;
        const settings = {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        };
        try {
            const fetchResponse = await fetch(url, settings);
            const response = await fetchResponse.json();
            setLoading(false);
            
            if (response.messages && response.messages.length > 0) {
                setMessages((prevMessages) => [...response.messages, ...prevMessages]);
                setOffset(prevOffset => prevOffset + 20);
            } else {
                setAllMessagesLoaded(true); 
            }
        } catch (e) {
            console.log(e);
        }
    };
    const handleScroll = (e) => {
        if (e.target.scrollTop === 0 && !allMessagesLoaded) {
            loadMessages();
        }
    };
    useEffect(() => {
        const func = async () => {
            const url = `http://localhost:8000/getChatMessages?chatId=${chatId}`;
            const settings = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                }
                };
                try {
                    const fetchResponse = await fetch(url, settings);
                    const response = await fetchResponse.json();
                    setLoading(false)
                    let arr = [];
                    response.messages.forEach((one) => {
                    arr = [one, ...arr];
                    });

                    setMessages((msgs) => arr); 
                    } catch (e) {
                    console.log(e);
                    }
        }
        func()
        io.emit('joinroom', {chatId:chatId, userId:account.id});
        
        
      }, []);
      io.on("message",  (data, error) => {
        console.log('New message received:', data);
        console.log(data)
        setMessages(prevMessages => [data, ...prevMessages]);
        setQuery(queryInitial)
    });
    io.on("userCameOnline",  (data, error) => {
        console.log('New message received:', data);
        if(data.status === 'online'){
            setOnline(true)
        }
        console.log(data)
    });

    io.on("otherTyping",  (data, error) => {
        console.log('New message received:', data);
        setTyping(data)
        console.log(data)
    });

    io.on('messageEdited', (updatedMessage) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          )
        );
      });
  
      io.on('messageDeleted', (id) => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== id));
      });
  
      const sendMessage = (query) => {
        if (query) {
            console.log(query)
            io.emit('sendMessage', {
                chatroomId:chatId,
                senderId:account.id,
                content:query.content,
                messageType:query.messageType
            })
          setQuery(queryInitial);
        
        } else {
          alert("Message can't be empty");
        }
      };
      const sendTypingAlert = () => {
        io.emit('typing', {
            chatroomId:chatId,
            senderId:account.id,
        })
      }

      useEffect(() => {
        const storeImageAndGetLink = async() => {
          
          if(imageFile){
              const data = new FormData();
              data.append("name", imageFile.name);
              data.append("file", imageFile);
              
              const settings = {
                  method: "POST",
                  body: data,
                  }
                  try {
                      const fetchResponse = await fetch(`http://localhost:8000/uploadImageMessage?chatId=${chatId}&senderId=${account.id}`, settings);
                      const response = await fetchResponse.json();
                      io.emit('sendMessage', {
                        chatroomId:chatId,
                        senderId:account.id,
                        content:response.mediaUrl,
                        messageType:response.messageType
                    })
                    
                      
                  } catch (e) {
                      
                      return e;
                  }
          }
        }
        storeImageAndGetLink();
      }, [imageFile])


    return(
        <>
        <div style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
            }}>
            <div className='header'>
                <div className='title'>
                Kore.AI's Assignment
                </div>
               
            </div>
            
            <div style={{fontSize:'20px', color:'white', fontWeight:'600'}}>{friendName} - {onlineStatus === true ? 'Online' : 'Offline'}</div>
            {
                typingIndicator && typingIndicator.message === 'typing...' && typingIndicator.userTypingId !== account.id?
                <>
                    <div style={{color:'yellow', fontSize:'16px', fontWeight:600}}>Typing...</div>
                </>
                :
                <></>
            }
            <div className='chat-parent-box'>
                <div className='chat-sub-box' onScroll={handleScroll}>
                    {
                        loading === true ?
                        <div className='loader'></div>
                        :
                        <div className='chats-box' >

                        {
                            messages.length > 0 ?
                            messages.map(e => (
                                <>
                                {
                                    e.senderId === account.id?
                                    e.messageType === 'image' || e.messageType === 'video'?
                                    e.messageType === 'image'?
                                    <div className="msg-1"
                                        onClick={() => {
                                            
                                        }}
                                        >
                                            <img src={e.content && e.content !== ""?e.content:'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}alt="Post Image" className="msg-2" />
                                    </div>
                                       :
                                       <div className="msg-1"
                                       onClick={() => {
                                           
                                       }}
                                       >
                                       <video controls height='100%' width="100%">
                                           <source src={`${e.content}`} type="video/mp4" />
                                           Sorry, your browser doesn't support videos.
                                       </video>
                                       </div>
                                        :
                                        <div className='sent'>
                                            {e.content}
                                        </div>
                                   
                                    :
                                    e.messageType === 'image' || e.messageType === 'video'?
                                    e.messageType === 'image' ?
                                        <div className="msg-3"
                                        onClick={() => {
                                            
                                        }}
                                        >
                                            <img src={e.content && e.content !== ""?e.content:'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}alt="Post Image" className="msg-2" />
                                    </div>
                                       :
                                       <div className="msg-3"
                                       onClick={() => {
                                           
                                       }}
                                       >
                                       <video controls height='100%' width="100%">
                                           <source src={`${e.content}`} type="video/mp4" />
                                           Sorry, your browser doesn't support videos.
                                       </video>
                                       </div>
                                        :
                                        <div className='received'>
                                            {e.content}
                                        </div>
                                   
                                }
                                </>
                            ))
                            :
                            <></>
                        }
                    </div>
                    }
                    

                    <div className='bottom-box'>
                    <FormControl>
                    <label htmlFor="fileInput">
                    <div style={{
                    cursor:'pointer'
                }}
                >
                    <AttachmentIcon style={{
                        fontSize:'40px',
                        color:'white'
                    }}/>
                    </div>
                            <input type="file"
                                id="fileInput"
                                
                                style={{
                                    display:'none'
                                }}
                                onChange={(e) => setImageFile(e.target.files[0])}
                                >
                                
                            </input>
                    </label>

                    </FormControl>
                            <div style={{
                                width:'92%',
                                height:'100%'
                            }}>
                                <input type='text' className='chat-type-box'
                                placeholder='Enter message here..' onChange={(e) => {
                                    setQuery({...query, content:e.target.value}); 
                                    sendTypingAlert()
                                    console.log(query)
                                    }}/>
                            </div>

                            <div className='send-btn' onClick={() => {
                               
                                sendMessage(query)
                               
                                
                            }}
                                >
                                <SendIcon style={{
                                    color:'white'
                                }}/>
                            </div>

                        </div>

                </div>
                </div>
            </div>
        </>
    )
}
export default Chat