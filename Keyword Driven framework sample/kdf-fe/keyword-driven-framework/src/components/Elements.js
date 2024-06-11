import { Box, Card, CardContent, Typography, Grid, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddLocatorDialog from './AddLocatorDialog';
import ConfirmationDialog from './ConfirmationDialog';
import LocatorSearch from './LocatorSearch';


const Elements = () => {
    const [locators, setLocators] = useState([])
    const [selectedLocator, setSelectedLocator] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
    const [locatorToDelete, setLocatorToDelete] = useState(null)

    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState('');
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState('');

    //disabledModule , disabledTest used to initially disable the module and test dropdowns. Only when a project is selected, they will be set to false.
    const [disabledModule, setDisabledModule] = useState(true)
    const [disabledTest, setDisabledTest] = useState(true)
    //if true, then when a non-existing locator is searched , it displays 'NO Results Found'.
    const [noResults, setNoResults] = useState(false)
    //function to search for a particular locator . Display "No Results" , if it does not exist.
    const handleSearch = (searchResults) => {
        setLocators(searchResults);
        setNoResults(searchResults.length === 0)
    };
    //On clearing the search query , all the locators displays as default. If the search was done within a test, then on clearing the search query , all the locators within the test gets displayed.
    const handleClearSearch = (selectedTest) => {
        setNoResults(false);
        if (selectedTest) {
            fetchLocatorsUnderTestId(selectedTest);
        } else {
            fetchLocators();
        }
    };
    //fetches all locators when the component mounts
    useEffect(() => {
        fetchLocators()
    }, [])
    //function for fetching all the locators and store in the state variable 'locators'.
    const fetchLocators = () => {
        axios.get("http://localhost:8081/getLocators")
            .then((response) => {
                setLocators(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    //On clicking the edit icon in each locator, the form appears with the respective locator data.
    const handleEditClick = (locator) => {
        setSelectedLocator(locator)
        setDialogOpen(true)
    }
    //function to handle the opening and closing of the dialog box for each locator.
    const handleDialogClose = () => {
        setDialogOpen(false)
        setSelectedLocator(null)
    }
    //function for updating the existing locator.
    const handleUpdateLocator = (updatedLocator) => {
        setLocators((prevLocators) =>
            prevLocators.map((locator) =>
                locator.locatorId === updatedLocator.locatorId ? updatedLocator : locator
            )
        )
    }
    //function for displaying the confirmation box for deleting a locator.
    const handleDeleteClick = (locator) => {
        setLocatorToDelete(locator)
        setConfirmationDialogOpen(true)
    }
    //function for handling the closing of the delete confirmation box.
    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false)
        setLocatorToDelete(null)
    }
    //function for deleting a locator.
    const handleDeleteConfirm = () => {
        axios.delete(`http://localhost:8081/deleteLocator/${locatorToDelete.locatorId}`)
            .then(() => {
                setLocators((prevLocators) =>
                    prevLocators.filter((locator) => locator.locatorId !== locatorToDelete.locatorId)
                )
                setConfirmationDialogOpen(false)
                setLocatorToDelete(null)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    //function for fetching projects.
    const fetchProjects = () => {
        axios.get("http://localhost:8081/allProjects")
            .then((response) => setProjects(response.data))
            .catch((error) => console.log(error))
    }
    //function for setting the selected project in a state variable and fetch modules under the selected project.
    const handleProjectChange = (event) => {
        const projectId = event.target.value;
        setSelectedProject(projectId);
        fetchModulesUnderProject(projectId);
        setDisabledModule(false)
    };
    //function for fetching modules under the selected project
    const fetchModulesUnderProject = (projectId) => {
        axios.get(`http://localhost:8081/project/modules/${projectId}`)
            .then((response) => setModules(response.data))
            .catch((error) => console.log(error))
    }
    //function for setting the selected module in a state variable and fetch tests under the selected module.
    const handleModuleChange = (event) => {
        const moduleId = event.target.value;
        setSelectedModule(moduleId);
        fetchTestsUnderModule(moduleId);
        setDisabledTest(false)
    }
    //function for fetching tests under the selected module.
    const fetchTestsUnderModule = (moduleId) => {
        axios.get(`http://localhost:8081/tests/${moduleId}`)
            .then((response) => setTests(response.data))
            .catch((error) => console.log(error))
    }
    //function for setting the selected test in a state variable and fetch the locators under the particular test.
    const handleTestChange = (event) => {
        const testId = event.target.value;
        setSelectedTest(testId);
        setNoResults(false)
        fetchLocatorsUnderTestId(testId);
    };
    //function for fetching the locators under the selected test
    const fetchLocatorsUnderTestId = (testId) => {
        axios.get(`http://localhost:8081/getLocatorsUnderTestId/${testId}`)
            .then((response) => setLocators(response.data))
            .catch((error) => console.log(error));
    };
    //fetch the modules only if a project is selected, else keep the modules , tests as unfetched.
    useEffect(() => {
        if (selectedProject) {
            fetchModulesUnderProject(selectedProject);
        }
        setModules([]);
        setSelectedModule('');
        setTests([]);
        setSelectedTest('');
    }, [selectedProject]);
    //fetch the tests only if a module is selected, else keep the tests as unfetched.
    useEffect(() => {
        if (selectedModule) {
            fetchTestsUnderModule(selectedModule);
        }
        setTests([]);
        setSelectedTest('');
    }, [selectedModule]);
    //fetch the locators under a test only if a test is selected, else fetch all the locators.
    useEffect(() => {
        if (selectedTest) {
            fetchLocatorsUnderTestId(selectedTest)
        } else {
            fetchLocators()
        }
    }, [selectedTest])

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ padding: '20px' }} variant='h4'>ADDED ELEMENTS</Typography>
                <LocatorSearch onSearch={handleSearch} selectedTest={selectedTest} onClearSearch={handleClearSearch} />
            </Box>

            <Box sx={{ width: '55%', display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
                {/* ...dropdowns... */}
                <Box sx={{ width: '20%', paddingRight: '10px', display: 'flex', gap: 4 }}>
                    <Box id='projectSelect' sx={{ display: "flex" }}>
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

                    <Box id='moduleSelect' sx={{ display: 'flex' }}>
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
                </Box>
            </Box>
            
            {noResults ? (
                <Typography variant="h6" sx={{ marginTop: '20px', fontSize: '2.25rem', textAlign: 'center' }}>
                    No Locators Found
                </Typography>
            ) : (

                <Box sx={{ padding: '20px' }}>
                    <Grid container spacing={2}>
                        {locators.map((locator) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={locator.locatorId}>
                                <Card sx={{ p: 0 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography sx={{ fontSize: '1.10rem', marginTop: '6px' }} component="div">
                                                    {locator.locatorName}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <IconButton color="primary" onClick={() => handleEditClick(locator)}>
                                                    <EditIcon sx={{ width: '20px' }} />
                                                </IconButton>
                                                <IconButton color='primary' onClick={() => handleDeleteClick(locator)}>
                                                    <DeleteIcon sx={{ width: '20px' }} />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}


            {selectedLocator && (
                <AddLocatorDialog
                    selectedTest={selectedLocator.testId.testName}
                    locatorOptions={locators}
                    setLocatorOptions={setLocators}
                    onClose={handleDialogClose}
                    existingLocator={selectedLocator}
                    onUpdateLocator={handleUpdateLocator}
                />
            )}

            {locatorToDelete && (
                <ConfirmationDialog
                    open={confirmationDialogOpen}
                    onClose={handleConfirmationDialogClose}
                    onConfirm={handleDeleteConfirm}
                    locatorName={locatorToDelete.locatorName}
                />
            )}
        </Box>
    )
}

export default Elements



