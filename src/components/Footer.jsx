import { APP_NAME } from "../constants"

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