

import NavMain from "./NavMain";
import aukcijelogo from '../img/Aukcije logo.png'
import { Link } from "react-router-dom";




function Header() {
  return(
    <>
      
   
        <header>
 
            
               <div className="h">
          {/* <Link to="/" aria-label="Aukcije – početna stranica">
            <img className="logo" src={aukcijelogo} alt="Aukcije logo" />  
          
                   </Link>             */}
                        
                            <NavMain></NavMain>
               </div>
  
      
          </header>
  

  
  
  </>

)

}
export default Header