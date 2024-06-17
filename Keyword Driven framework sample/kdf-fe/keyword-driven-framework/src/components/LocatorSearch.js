//component for searching for a particular locator based on the locatorName
import React, { useState } from 'react';
import { TextField, Box, IconButton, InputAdornment } from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const LocatorSearch = ({ onSearch, selectedTest, onClearSearch }) => {
    //statevariable and function to store the search query and to set the search query.
    const [searchQuery, setSearchQuery] = useState('');
    //function to search for a particular locator. (If the search is happening under a selected test , use the first api, if no test is selected and the search is happening , use the second api)
    const handleSearch = () => {
        const url = selectedTest
            ? `http://localhost:8081/searchLocators/${selectedTest}/${searchQuery}`
            : `http://localhost:8081/searchLocators/${searchQuery}`;
        axios.get(url)
            .then((response) => {
                onSearch(response.data);
            })
            .catch((error) => {
                console.error('Error searching locators:', error);
            });
    };
    //function to clear the search field
    const handleClearSearch = () => {
        setSearchQuery('');
        onClearSearch(selectedTest);
    };
    //function to search on pressing the Enter key.
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box sx={{ display: 'flex', marginRight: '20px' }}>
            <TextField
                id='search'
                label="Search Locator Name"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton color='primary' onClick={handleClearSearch}>
                                <ClearIcon />
                            </IconButton>
                            <IconButton color='primary' onClick={handleSearch}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ flexGrow: 1 }}
                onKeyDown={handleKeyDown}
            />
        </Box>
    );
};

export default LocatorSearch;


