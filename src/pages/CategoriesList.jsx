import { useEffect, useState } from "react"
import CategoriesService from '../services/categories/CategoriesServices'
import { Container, Table } from "react-bootstrap"
import { FaComputer } from "react-icons/fa6";



export default function CategoriesList() {
  const [categories, setCategories] = useState([])

  useEffect(() => { 

    loadCategories()
  }, [])
  
  async function loadCategories() {
    
    await CategoriesService.get()
      .then((res) => {
      
      setCategories(res.data)
    })
  }


  return (

    <>

        <Container>
        <Table hover striped bordered >
          <thead>

            <tr>
        
              <th>Naziv</th>
              <th>Opis</th>
              <th>broj oglasa</th>

            </tr>
          </thead>

          <tbody>
            {categories && categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td >{ c.numItems}</td>


              </tr>

              
      ))}

          </tbody>


</Table>
   
            {/* <pre>
              {JSON.stringify(categories, null, 2)}
            </pre> */}
   
           </Container>
    
    </>
  )
}
