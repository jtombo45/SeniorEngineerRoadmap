import React, { useState } from 'react';
import ReactDOM from 'react-dom';
//import './style.css';

function AddPersonForm(props) {
  const [ person, setPerson ] = useState("");
    
  function handleChange(e) {
    setPerson(e.target.value);
  }
    
  function handleSubmit(e) {
    e.preventDefault();
    props.handleSubmit(person);
    setPerson("");
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" 
        placeholder="Add new contact" 
        onChange={handleChange} 
        value={person} />
      <button type="submit">Add</button>
    </form>
  );
}

function PeopleList(props) {
  const arr = props.data;
  const listItems = arr.map((val, index) =>
    <li key={index}>{val}</li>
  );
  return <ul>{listItems}</ul>;
}

function App() {
  const [contacts, setContacts] = useState(["James Smith", "Thomas Anderson", "Bruce Wayne"]);
  
  function addPerson(name) {
    setContacts([...contacts, name]);
  }
  
  return (
    <div>
    <AddPersonForm handleSubmit={addPerson} />
    <PeopleList data={contacts} />
  </div>
  );
}

export default App;
