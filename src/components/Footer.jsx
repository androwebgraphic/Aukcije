import { APP_NAME, RouteNames } from "../constants"
import { Route,Routes } from "react-router-dom"
import Uvjeti from "../pages/Uvjeti"



function Footer() {
   const currentYear= new Date().getFullYear()
  return (
    
    <>
    
    
      <footer>
   



      <p className="copy">&copy;{APP_NAME} Sva prava pridržana {currentYear}.</p>
    </footer>
    
    </>

  )
}
export default Footer