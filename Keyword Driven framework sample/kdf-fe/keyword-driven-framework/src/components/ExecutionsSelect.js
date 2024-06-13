import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'

const ExecutionsSelect = ({handleResultsDatagrid,handleExecutionChange,testResults,disabledExecutions,selectedExecution }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ width: '180px' }}>
                <InputLabel id="execution-selection">Executions</InputLabel>
                <Select
                    labelId="execution-selection"
                    id="select-execution"
                    label="execution"
                    value={selectedExecution}
                    onChange={handleExecutionChange}
                    disabled={disabledExecutions}
                >
                    {testResults.map((testResult) => (
                        <MenuItem
                            key={testResult.id}
                            value={testResult.runId}
                            onClick={handleResultsDatagrid}
                        >
                            {testResult.runId}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}

export default ExecutionsSelect
