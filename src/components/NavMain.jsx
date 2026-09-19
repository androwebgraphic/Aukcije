import { Nav } from "react-bootstrap";

function NavMain() {
  
  return (
    
    <>
     <Nav
      activeKey="/home"
      onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
    >
      <Nav.Item>
        <Nav.Link href="/home">O nama</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-1">Kategorije</Nav.Link>
      </Nav.Item>
    
           <Nav.Item>
        <Nav.Link eventKey="link-2">Registracija</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="disabled" disabled>
         Logiranje
        </Nav.Link>
      </Nav.Item>
    </Nav>
    
    </>


  )

}

export default NavMain