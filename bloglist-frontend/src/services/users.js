import axios from 'axios'
// @flow
const baseUrl = '/api/users'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const get = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}
  

export default { getAll, get }