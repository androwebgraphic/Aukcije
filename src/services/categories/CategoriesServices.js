import { categories } from './CategoryData'


//1/4 READ od CRUD
async function get() {
  
  return {data: [...categories]}
}

async function getByID(id) {
  
  return {
    
    data: categories.find( s => s.id === parseInt(id))
  }

}
//2/4 CREATE od CRUD

async function add(category) {
  
  if (categorie.length === 0) {
    
    category.id = 1
  } else {
    
    category.id = categories[categories.length-1].id +1
  }
  categories.push(categorie)
}
export default {

  get,
  add,
  getByID,
}