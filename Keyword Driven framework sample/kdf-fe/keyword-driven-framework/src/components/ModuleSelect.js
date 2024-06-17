//dropdown for dispalying the modules
import React from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const ModuleSelect = ({ modules, selectedModule, handleModuleChange, disabledModule }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ width: '180px' }}>
                <InputLabel id="module-selection">Module</InputLabel>
                <Select
                    disabled={disabledModule}
                    labelId="module-selection"
                    id="select-module"
                    value={selectedModule}
                    label="module"
                    onChange={handleModuleChange}
                >
                    {modules.map((module) => (
                        <MenuItem
                            key={module.moduleId}
                            value={module.moduleId}
                        >
                            {module.moduleName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}

export default ModuleSelect
