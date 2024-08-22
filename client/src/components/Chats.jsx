
import SendIcon from '@mui/icons-material/Send';
import { useState, useEffect } from 'react';
import socket from "socket.io-client";
import { useParams } from 'react-router-dom';
import { DataContext } from '../context/DataProvider.jsx';
import { useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useContext } from 'react';
const Chats = () => {
    const [loading, setLoading] = useState(true)
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const navigate = useNavigate()
    const [chats, setChats] = useState([])
    
    useEffect(() => {
        const func = async () => {
            const url = `http://localhost:8000/getChatsUsernames?userId=${account.id}`;
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
                    setChats(response.chatroomUsernames)
                    } catch (e) {
                    console.log(e);
                    }
        }
        func()
    }, [])

   
    


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
           
            
                        {
                            loading === true?
                            <div className='loader'></div>
                            :
                            <div style={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', }}>
                {
                    
                    chats && chats.length > 0 ?
                    chats.map(e =>(
                        <>
                    <div style={{display:'flex', flexDirection:'column', cursor:'pointer', justifyContent:'center', border:'2px solid green', width:'40%', borderRadius:'5px', marginTop:'2%', padding:'5px'}} onClick={() => navigate(`/chat/${e.chatroomId}/${e.otherUserUsername}`)}>
                        <div style={{display:'flex'}}>
                            <div style={{fontSize:'1.25rem', color:'white', color:'#e9c5ff'}}>
                                    User Name
                            </div>
                            <div style={{fontSize:'1.25rem', fontWeight:'800', color:'white', marginLeft:'auto', marginRight:'3%'}}>
                                {e.otherUserUsername}
                            </div>
                        </div>
                        

            
                    </div>
                    </>
                    ))
                    

                    :
                    
                    <></>
                }
            </div> 
                        }
             
            </div>
        </>
    )
}
export default Chats