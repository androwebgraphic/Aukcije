import { useEffect, useState } from "react"
import CategoriesService from '../services/categories/CategoriesServices'
import { Container } from "react-bootstrap"



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
         <h1>Pregled kategorija</h1>
      <pre>   {JSON.stringify(categories,null, 2)}</pre>
   
   </Container>
    </>
  )
}