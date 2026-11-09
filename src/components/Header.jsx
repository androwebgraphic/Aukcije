

import NavMain from "./NavMain";
import aukcijelogo from '../img/Aukcije logo.png'
import { Link } from "react-router-dom";


function Header() {
  return(
    <>
      
   
        <header>
 
            
               <div className="h">
          <Link to="/">
            <img className="logo" src={aukcijelogo} />
                 
                   </Link>             {/* <h1>Aukcije</h1> */}
                        
                            <NavMain></NavMain>
               </div>
  
      
          </header>
  

  
  
  </>

)

}
export default Header