import { useEffect, useState } from "react"
import CategoriesService from '../services/categories/CategoriesServices'



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
      Pregled kategorija
      {JSON.stringify(categories,null, 2)}
    </>
  )
}