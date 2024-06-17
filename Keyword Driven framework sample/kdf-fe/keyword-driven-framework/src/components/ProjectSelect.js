//dropdown for displaying the projects
import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const ProjectSelect = ({ projects, selectedProject, handleProjectChange, fetchProjects }) => {
    return (
        <Box sx={{ display: "flex" }}>
            <FormControl sx={{ width: '180px' }}>
                <InputLabel id="project-selection">Project</InputLabel>
                <Select
                    labelId="project-selection"
                    id="select-project"
                    value={selectedProject}
                    label="project"
                    onChange={handleProjectChange}
                    type='text'
                    onFocus={fetchProjects}
                >
                    {projects.map((project) => (
                        <MenuItem
                            key={project.projectId}
                            value={project.projectId}
                        >
                            {project.projectName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}

export default ProjectSelect;
