import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function PhoneNumberForm() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted Phone Number:', phoneNumber);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PhoneInput
        country={'in'} 
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        inputProps={{
          name: 'phone',
          required: true,
          autoFocus: true
        }}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PhoneNumberForm;