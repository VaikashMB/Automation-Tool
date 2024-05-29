import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AddModuleDialog from './AddModuleDialog';
import AddProjectDialog from './AddProjectDialog';
import AddTestDialog from './AddTestDialog';
import DatagridSample from './DatagridSample';

const TestsComponent = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState('');
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState('');
    const [subTests, setSubTests] = useState([]);
    const [isModuleVisible, setIsModuleVisible] = useState(false);
    const [isTestVisible, setIsTestVisible] = useState(false);
    const [isDataGridVisible, setIsDataGridVisible] = useState(false);

    useEffect(() => {
        if (selectedProject) {
            fetchModulesUnderProject(selectedProject);
            setIsModuleVisible(true);
        } else {
            setIsModuleVisible(false);
        }

        setModules([]);
        setSelectedModule('');
        setTests([]);
        setSelectedTest('');
        setSubTests([]);
        setIsTestVisible(false);
        setIsDataGridVisible(false);
    }, [selectedProject]);

    useEffect(() => {
        if (selectedModule) {
            fetchTestsUnderModule(selectedModule);
            setIsTestVisible(true);
        } else {
            setIsTestVisible(false);
        }
        setTests([]);
        setSelectedTest('');
        setSubTests([]);
        setIsDataGridVisible(false);
    }, [selectedModule]);

    useEffect(() => {
        if (selectedTest) {
            fetchDataUnderTest(selectedTest);
            setIsDataGridVisible(true);
        } else {
            setIsDataGridVisible(false);
        }
        setSubTests([]);
    }, [selectedTest]);

    const fetchProjects = () => {
        axios.get("http://localhost:8081/allProjects")
            .then((response) => setProjects(response.data))
            .catch((error) => console.log(error));
    };

    const fetchModulesUnderProject = (projectId) => {
        axios.get(`http://localhost:8081/project/modules/${projectId}`)
            .then((response) => setModules(response.data))
            .catch((error) => console.log(error));
    };

    const handleProjectChange = (event) => {
        setSelectedProject(event.target.value);
    };

    const fetchTestsUnderModule = (moduleId) => {
        axios.get(`http://localhost:8081/tests/${moduleId}`)
            .then((response) => setTests(response.data))
            .catch((error) => console.log(error));
    };

    const handleModuleChange = (event) => {
        setSelectedModule(event.target.value);
    };

    const fetchDataUnderTest = (testId) => {
        axios.get(`http://localhost:8081/keyword/subTests/${testId}`)
            .then((response) => setSubTests(response.data))
            .catch((error) => console.log(error));
    };

    const handleTestChange = (event) => {
        setSelectedTest(event.target.value);
    };

    const refreshProjects = () => {
        fetchProjects();
    };

    const refreshModules = () => {
        if (selectedProject) {
            fetchModulesUnderProject(selectedProject);
        }
    };

    const refreshTests = () => {
        if (selectedModule) {
            fetchTestsUnderModule(selectedModule);
        }
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', gap: 3 }}>
            <Box sx={{ width: '20%', paddingRight: '10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box id='projectSelect' sx={{ display: "flex" }}>
                    <AddProjectDialog onProjectAdded={refreshProjects} />
                    <FormControl fullWidth>
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

                {isModuleVisible && (
                    <Box id='moduleSelect' sx={{ display: 'flex' }}>
                        <AddModuleDialog selectedProject={selectedProject} onModuleAdded={refreshModules} />
                        <FormControl fullWidth>
                            <InputLabel id="module-selection">Module</InputLabel>
                            <Select
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
                )}

                {isTestVisible && (
                    <Box id='testSelect' sx={{ display: 'flex' }}>
                        <AddTestDialog selectedModule={selectedModule} onTestAdded={refreshTests} />
                        <FormControl fullWidth>
                            <InputLabel id="test-selection">Test</InputLabel>
                            <Select
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
                )}
            </Box>

            {isDataGridVisible && (
                <Box id='datagridSelect'>
                    <DatagridSample
                        subTests={subTests}
                        setSubTests={setSubTests}
                        selectedTest={selectedTest}
                        fetchDataUnderTest={fetchDataUnderTest}
                    />
                </Box>
            )}
        </Box>
    );
};

export default TestsComponent;
