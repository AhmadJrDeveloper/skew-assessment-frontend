import React from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import './Searchbar.css';

function Searchbar({ onChange }) {
  const handleInputChange = (event) => {
    const { value } = event.target;
    onChange(value);
  };

  return (
    <TextField
      className='search-container'
      placeholder="Search..."
      variant="outlined"
      size="medium"
      onChange={handleInputChange}
      InputProps={{
        endAdornment: ( 
          <SearchIcon color="red" />
        ),
        sx: {
          pr: '28px',
        //   width: '100%' 
        }
      }}
    />
  );
}

export default Searchbar;
