import Header from "./Header";
import AddPersonForm from "./AddPersonForm";
import ContactList from "./ContactList";
import React, { useState } from 'react';

class ContactManager extends React.Component {

    // Initialize contacts array as state so downstream components can access it and modify it
    state = {
      contacts: ["James Smith", "Thomas Anderson", "Bruce Wayne"]
    };

    // Function to add a new contact to the contacts array, passed to AddPersonForm component
    // ... Append new contact to existing contacts array using spread operator
    handleAddContact = (name) => {
      this.setState({
        contacts: [...this.state.contacts, name]
      });
    }
  
  render() {

    return <div>
        <Header />
        {/* Pass handleAddContact function as onAddContact prop to AddPersonForm component */}
        <AddPersonForm onAddContact={this.handleAddContact} />
        {/* Pass contacts array from state as data prop to ContactList component */}
        <ContactList data={this.state.contacts} />
    </div>;
  }
} 

export default ContactManager;