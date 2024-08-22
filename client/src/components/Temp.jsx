import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";
const Temp = () => {
    const {account} = useContext(DataContext);
    const navigate = useNavigate()
    useEffect(() => {   
        if(account.loggedIn === false){
          navigate('/login');
        }
      }, [])
    return(
        <>

        </>
    )
}

export default Temp