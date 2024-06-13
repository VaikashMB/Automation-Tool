import React from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const TestSelect = ({ tests, selectedTest, handleTestChange, disabledTest }) => {
    return (
        <Box id='testSelect' sx={{ display: 'flex' }}>
            <FormControl sx={{ width: '180px' }}>
                <InputLabel id="test-selection">Test</InputLabel>
                <Select
                    disabled={disabledTest}
                    labelId="test-selection"
                    id="select-test"
                    label="test"
                    value={selectedTest}
                    onChange={handleTestChange}
                >
                    {tests.map((test) => (
                        <MenuItem
                            key={test.testId}
                            value={test.testId}
                        >
                            {test.testName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}

export default TestSelect
