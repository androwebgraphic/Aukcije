

import NavMain from "./NavMain";
import {Row,Col} from 'react-bootstrap'
function Header() {
  return(
    <>
      
   
        <header>
 
            
               <div className="h">
                 <img className="logo" src="src/img/aukcijelogo.svg" />
                 
                           {/* <h1>Aukcije</h1> */}
                        
                            <NavMain></NavMain>
               </div>
  
      
          </header>
  

  
  
  </>

)

}
export default Header