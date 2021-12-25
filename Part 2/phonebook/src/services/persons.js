import axios from 'axios';
const baseUrl = 'http://localhost:3002/persons';

const getPersons = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

const addPersons = (newObject) => {
    const request = axios.post(baseUrl, newObject);
    return request.then(response => response.data);
};

const updatePersons = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
};

const deletePersons = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
};

export default { getPersons, addPersons, updatePersons, deletePersons }