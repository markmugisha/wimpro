import axios from 'axios';

const nums = [12, 26, 3, -5, 540, 67, 1209, 34];

const BASE_URL = 'https://restcountries.com/v3.1';

// const response = await axios.post("http://localhost:8000/add-10", nums)

const res = await axios.get(`http://localhost:8000`);
console.log(res.data);
