// import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import personService from './services/persons';

const Filter = ({ persons, filter, handleFilter }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilter}/>
      {filter && persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(filtered => (
        <ul>
          <li key={filtered.name}>{filtered.name} {filtered.number}</li>
        </ul>
      ))}
    </div>
  )
};

const ConfirmationMessage = ({ message }) => {
  return (
    <div>
      {message && <h3 className="confirm">{message}</h3>}
    </div>
  )
};

const ErrorMessage = ({ message }) => {
  return (
    <div>
      {message && <h3 className="error">{message}</h3>}
    </div>
  )
}

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, submitForm}) => {
  return (
    <form onSubmit={submitForm}>
        <div>
          name: <input type="text" value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input type="text" value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
};

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
    {persons.map(person => (
      <p key={person.name}><b>{person.name} {person.number}</b> <button onClick={() => {deletePerson(person.id, person.name)}}>delete</button></p>
    ))}
    </div>
  )
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState ('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState('');
  const [errMessage, setErrMessage] = useState('');

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };
  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };
  const handleFilter = (e) => {
    setFilter(e.target.value);
  };
  const isDuplicate = (data) => {
    return data.some(el => el.name.toLowerCase() === newName.toLowerCase())
  };
  const deletePerson = (id, name) => {
    if (window.confirm(`Do you really want to delete ${name} from phonebook?`)) {
      personService
      .deletePersons(id)
      .then(setPersons(persons))
      setPersons(persons => persons.filter(person => person.id !== id));
    }
  }
  const submitForm = (e) => {
    e.preventDefault();
    const newObject = {name: newName, number: newNumber};
    if (!isDuplicate(persons)) {
      personService
      .addPersons(newObject)
      .then(personObj => {
        setPersons(persons.concat(personObj));
        setMessage(`Added ${newObject.name}`);
        setTimeout(() => {
          setMessage(null)
        }, 5000);
    })
      setPersons([...persons, {name: newName, number: newNumber}])
    } else {
      if (window.confirm(`${newObject.name} is already added to the phonebook, replace the old number with a new one?`)) {
        const id = persons.find(person => person.name === newObject.name).id;
        personService
        .updatePersons(id, newObject)
        .then(changedPerson => {
          setPersons(persons.map(person => person.id !== id ? person : changedPerson))
        })
        .catch (error => {
          const id = persons.find(person => person.name === newObject.name).id;
          setErrMessage(`Information of ${newObject.name} has already been removed from server`);
          setPersons(persons.filter(person => person.id !== id));
          setTimeout(() => {
            setErrMessage(null)
          }, 5000);
        }) 
      }
    }
    setNewName('');
    setNewNumber('');
  };

  useEffect(() => {
    personService
    .getPersons()
      .then(initialPerson => 
        setPersons(initialPerson))
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <ConfirmationMessage message={message}/>
      <ErrorMessage message={errMessage}/>
      <Filter persons={persons} filter={filter} handleFilter={handleFilter}/>
      <h3>Add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNumberChange={handleNumberChange} handleNameChange={handleNameChange} submitForm={submitForm}/>
      <h2>Numbers</h2>
      <Persons persons={persons} deletePerson={deletePerson}/>
    </div>
  )
};



export default App;
