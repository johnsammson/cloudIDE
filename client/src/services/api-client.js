import axios, { CanceledError } from 'axios';

export default axios.create({
  baseURL: 'https://justcode.dotmarket.tech',
})

export { CanceledError };
