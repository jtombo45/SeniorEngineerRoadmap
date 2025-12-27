import React from "react";

function AddContactForm( props ) {
  // State to manage the input field value, initialized to an empty string
  // Using React.useState hook to create state variable 'person' and its setter 'setPerson'
  const [person, setPerson] = React.useState("");

  // Function to handle changes in the input field
  function handleChange(e) {
    setPerson(e.target.value);
  }

  // Function to handle form submission to add a new contact
  function handleSubmit(e) {
    e.preventDefault(); 
    if (!person.trim()) return; // Prevent adding empty contacts
    props.onAddContact(person); // Call the passed function to add contact
    setPerson(""); // Clear input field after submission
}


  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Add new contact" value={person} onChange={handleChange} />
      <button type="submit">Add</button>
    </form>
  )
}

export default AddContactForm;