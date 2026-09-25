import { useEffect, useState } from "react"
import CategoriesService from '../services/categories/CategoriesServices'
import { Container, Table } from "react-bootstrap"
import DateFormat from "../components/DateFormat"




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
              <td>Kreirano</td>

            </tr>
          </thead>

          <tbody>
            {categories && categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td className="text-center">{c.numItems}</td>
                <td>
          
                  <DateFormat date={ c.datumMoj} />
                </td>


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
