import { categories } from './CategoryData'

//1/4 READ od CRUD
async function get() {
  
  return {data: [...categories]}
}
//2/4 CREATE od CRUD

async function add(categorie) {
  
  if (categorie.length === 0) {
    
    categorie.id = 1
  } else {
    
    categorie.id = categories[categories.length-1].id +1
  }
  categories.push(categorie)
}
export default {

  get,
  add,
}