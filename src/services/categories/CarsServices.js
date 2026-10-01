import { cars } from "../../services/categories/CarsData";

// 1/4 READ od CRUD
async function get() {
  return { data: [...cars] };
}

// 2/4 CREATE od CRUD
async function add(car) {
  // 1. Izračun novog ID-a na temelju polja `cars`
  if (cars.length === 0) {
    car.id = 1;
  } else {
    car.id = cars[cars.length - 1].id + 1;
  }

  // 2. Dodavanje novog objekta `car` u polje `cars`
  cars.push(car);

  // 3. Vraćanje odgovora
  return { data: car };
}

export default {
  get,
  add,
};