

import NavMain from "./NavMain";
import aukcijelogo from '../img/aukcijelogo.svg'


function Header() {
  return(
    <>
      
   
        <header>
 
            
               <div className="h" id='top'>
                 <img className="logo" src={aukcijelogo} />
                 
                           {/* <h1>Aukcije</h1> */}
                        
                            <NavMain></NavMain>
               </div>
  
      
          </header>
  

  
  
  </>

)

}
export default Header