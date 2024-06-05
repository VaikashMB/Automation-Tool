import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';

const LocatorSearch = ({ onSearch }) => {

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        axios.get(`http://localhost:8081/searchLocators/${searchQuery}`)
            .then((response) => {
                onSearch(response.data);
            })
            .catch((error) => {
                console.error('Error searching locators:', error);
            });
    };

    return (
        <Box sx={{ display: 'flex', marginRight: '20px' }}>
            <TextField
                type='search'
                id='search'
                label="Search Locator Name"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button sx={{ height: '54px', marginLeft: '3px' }} variant="contained" onClick={handleSearch}>
                <SearchIcon />
            </Button>
        </Box>
    );
};

export default LocatorSearch;


