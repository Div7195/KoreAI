import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import {BrowserRouter, Routes} from 'react-router-dom';
import DataProvider from './context/DataProvider';
import Login from './components/Login';
import Chat from './components/Chat';
import Chats from './components/Chats';
import Temp from './components/Temp';
function App() {
  return (
    <>
       <DataProvider>
        <BrowserRouter>
         <Temp/>
        <div style={{marginTop:5}}>
            <Routes>
            <Route  path = '/login' element = {<Login/>}/>
              <Route  path = '/chat/:chatId/:friendName' element = {<Chat/>}/>
              <Route  path = '/chats' element = {<Chats/>}/>
              </Routes>
          </div>
        </BrowserRouter>
     </DataProvider>
    </>
  );
}

export default App;