import { categories } from './CategoryData'

//1/4 READ od CRUD
async function get() {
  
  return {data: [...categories]}
}
//2/4 CREATE od CRUD

async function dodaj(categories) {
  
  if (categories.length === 0) {
    
    categories.id = 1
  } else {
    
    categories.id = categories[categories.length-1].id +1
  }
  categories.push(categories)
}
export default {

  get,
  dodaj,
}