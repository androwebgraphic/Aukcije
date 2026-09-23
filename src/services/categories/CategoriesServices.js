import { categories } from './CategoryData'

async function get() {
  
  return {data: [...categories]}
}

export default {

  get
}