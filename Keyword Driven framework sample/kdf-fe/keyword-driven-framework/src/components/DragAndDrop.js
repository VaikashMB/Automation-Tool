import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddModuleDialog from './AddModuleDialog';
import AddProjectDialog from './AddProjectDialog';
import AddTestDialog from './AddTestDialog';
import { FaChrome, FaEdge } from 'react-icons/fa';
import AddSubTestForm from './AddSubTestForm';

const DragAndDrop = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState('');
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState('');
    const [subTests, setSubTests] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [selectedBrowsers, setSelectedBrowsers] = useState([]);
    const [showAddSubTestForm, setShowAddSubTestForm] = useState(false);
    const [selectedSubTest, setSelectedSubTest] = useState(null);
    const [isCardsVisible, setIsCardsVisible] = useState(false);

    useEffect(() => {
        console.log(isChecked);
    }, [isChecked]);

    const handleBrowserCheckboxChange = (browser, event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedBrowsers(prevState => [...prevState, browser]);
            console.log(selectedBrowsers)
        } else {
            setSelectedBrowsers(prevState => prevState.filter(item => item !== browser));
        }
    };

    useEffect(() => {
        console.log(selectedBrowsers);
    }, [selectedBrowsers]);

    const rows = subTests.map((data) => {
        return {
            id: data.id,
            keyword: data.keyword,
            orderOfExecution: data.orderOfExecution,
            description: data.description,
            value: data.value,
            locatorId: data.locatorId ? data.locatorId.locatorId : null,
            flag: data.flag,
            screenshot: data.screenshot ? true : false,
        }
    });

    const handleExecution = () => {
        const payload = {
            browsers: selectedBrowsers,
            actionKeyword: rows
        };
        console.log("Executing with payload:", payload);

        axios.post(`http://localhost:8081/keyword/executeAll/${selectedTest}`, payload)
            .then((response) => {
                axios.post("http://localhost:8081/postTestResults", response.data)
                    .then((response) => {
                        console.log("Data posted to testResults db:", response);
                    })
                    .catch((response) => {
                        console.error("Error posting data to testResults db:", response);
                    });
            })
            .catch((error) => {
                console.error("Error executing all keywords:", error);
            });
    };

    const fetchProjects = () => {
        axios.get("http://localhost:8081/allProjects")
            .then((response) => setProjects(response.data))
            .catch((error) => console.log(error))
    }

    const fetchModulesUnderProject = (projectId) => {
        axios.get(`http://localhost:8081/project/modules/${projectId}`)
            .then((response) => setModules(response.data))
            .catch((error) => console.log(error))
    }

    const handleProjectChange = (event) => {
        const projectId = event.target.value;
        setSelectedProject(projectId);
        fetchModulesUnderProject(projectId);
        setShowAddSubTestForm(false);
    };

    const fetchTestsUnderModule = (moduleId) => {
        axios.get(`http://localhost:8081/tests/${moduleId}`)
            .then((response) => setTests(response.data))
            .catch((error) => console.log(error))
    }

    const handleModuleChange = (event) => {
        const moduleId = event.target.value;
        setSelectedModule(moduleId);
        fetchTestsUnderModule(moduleId);
        setShowAddSubTestForm(false);
    }

    const fetchDataUnderTest = (testId) => {
        axios.get(`http://localhost:8081/keyword/subTests/${testId}`)
            .then((response) => setSubTests(response.data))
            .catch((error) => console.log(error))
    }

    const handleTestChange = (event) => {
        const testId = event.target.value;
        setSelectedTest(testId);
        fetchDataUnderTest(testId);
    }

    const handleAddSubTest = (subTest = null) => {
        if (subTest === null) {
            const newOrderOfExecution = subTests.length + 1;
            subTest = { id: null, orderOfExecution: newOrderOfExecution, description: '', locatorType: '', value: '', flag: 'Y' };
        }
        setSelectedSubTest(subTest);
        setShowAddSubTestForm(true);
    };

    const handleCloseAddSubTestForm = () => {
        setShowAddSubTestForm(false);
        setSelectedSubTest(null);
    };

    const onDragEnd = (result) => {
        const { destination, source } = result;

        if (!destination) {
            return;
        }

        const reorderedSubTests = Array.from(subTests);
        const [removed] = reorderedSubTests.splice(source.index, 1);
        reorderedSubTests.splice(destination.index, 0, removed);

        setSubTests(reorderedSubTests);

        const updatedOrder = reorderedSubTests.map((subTest, index) => ({
            ...subTest,
            orderOfExecution: index + 1
        }));

        // Send updated order to the backend
        axios.put(`http://localhost:8081/keyword/updateExecutionOrder/${selectedTest}`, updatedOrder)
            .then((response) => {
                console.log("Order updated successfully:", response);
                fetchDataUnderTest(selectedTest)
            })
            .catch((error) => {
                console.error("Error updating order:", error);
            });
    };

    useEffect(() => {
        if (selectedProject) {
            fetchModulesUnderProject(selectedProject);
        } else {
        }
        setModules([]);
        setSelectedModule('');
        setTests([]);
        setSelectedTest('');
        setSubTests([]);
        setIsCardsVisible(false);
    }, [selectedProject]);

    useEffect(() => {
        if (selectedModule) {
            fetchTestsUnderModule(selectedModule);
        } else {
        }
        setTests([]);
        setSelectedTest('');
        setSubTests([]);
        setIsCardsVisible(false);
    }, [selectedModule]);

    useEffect(() => {
        if (selectedTest) {
            fetchDataUnderTest(selectedTest);
            setIsCardsVisible(true);
        } else {
            setIsCardsVisible(false);
        }
        setSubTests([]);
    }, [selectedTest]);

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
        <Box sx={{ display: 'flex', gap: '50px' }}>
            <Box sx={{ width: '55%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* ...dropdowns... */}
                <Box sx={{ width: '20%', paddingRight: '10px', display: 'flex', gap: 4 }}>
                    <Box id='projectSelect' sx={{ display: "flex" }}>
                        <AddProjectDialog onProjectAdded={refreshProjects} />
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
                        <AddModuleDialog selectedProject={selectedProject} onModuleAdded={refreshModules} />
                        <FormControl sx={{ width: '180px' }}>
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

                    <Box id='testSelect' sx={{ display: 'flex' }}>
                        <AddTestDialog selectedModule={selectedModule} onTestAdded={refreshTests} />
                        <FormControl sx={{ width: '180px' }}>
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
                </Box>

                {/* ...browsers... */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '20px', marginTop: '20px', justifyContent: 'start', gap: '62px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div>
                            <img src='https://img.icons8.com/?size=100&id=ejub91zEY6Sl&format=png&color=000000' alt='chrome-icon' style={{ width: '22px', height: '22px' }}></img>
                        </div>
                        <label htmlFor="chromeCheckbox" style={{ fontSize: '16px', marginBottom: 0 }}>Chrome</label>
                        <input
                            id='chromeCheckbox'
                            type="checkbox"
                            color="primary"
                            style={{ width: '24px', height: '24px' }}
                            onChange={(event) => handleBrowserCheckboxChange('chrome', event)}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div>
                            <img src='https://img.icons8.com/?size=100&id=dGm9KIZPpukc&format=png&color=000000' alt='edge-icon' style={{ width: '22px', height: '22px' }}></img>
                        </div>
                        <label htmlFor="edgeCheckbox" style={{ fontSize: '16px', marginBottom: 0 }}>Edge</label>
                        <input
                            id='edgeCheckbox'
                            type="checkbox"
                            color="primary"
                            style={{ width: '24px', height: '24px' }}
                            onChange={(event) => handleBrowserCheckboxChange('edge', event)}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div><FaChrome /></div>
                        <label htmlFor="chromeHeadlessCheckbox" style={{ fontSize: '16px', marginBottom: 0 }}>Chrome-Headless</label>
                        <input
                            id='chromeHeadlessCheckbox'
                            type="checkbox"
                            color="primary"
                            style={{ width: '24px', height: '24px' }}
                            onChange={(event) => handleBrowserCheckboxChange('chrome-headless', event)}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div><FaEdge /></div>
                        <label htmlFor="edgeHeadlessCheckbox" style={{ fontSize: '16px', marginBottom: 0 }}>Edge-Headless</label>
                        <input
                            id='edgeHeadlessCheckbox'
                            type="checkbox"
                            color="primary"
                            style={{ width: '24px', height: '24px' }}
                            onChange={(event) => handleBrowserCheckboxChange('edge-headless', event)}
                        />
                    </Box>
                </Box>

                {/* ...cards, add and execute... */}
                {isCardsVisible && (
                    <Box>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId={subTests}>
                                {(provided) => (
                                    <Box
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        sx={{
                                            maxHeight: '395px',
                                            overflowY: 'auto',
                                            border: '0px solid #ccc',
                                            borderRadius: '8px',
                                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                            padding: 1
                                        }}
                                    >
                                        {subTests.map((subTest, index) => (
                                            <Draggable key={subTest.id} draggableId={String(subTest.id)} index={index}>
                                                {(provided) => (
                                                    <Card
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        variant="outlined"
                                                        sx={{
                                                            marginBottom: '10px',
                                                            height: '40px',
                                                            width: '800px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: 1,
                                                            cursor: 'pointer',
                                                            backgroundColor: subTest.flag === 'N' ? '#f0f0f0' : '#ffffff',
                                                            borderRadius: 1,
                                                            transition: 'transform 0.2s',
                                                            '&:hover': {
                                                                transform: 'scale(1.02)',
                                                            },
                                                            opacity: subTest.flag === 'N' ? 0.5 : 1,
                                                        }}
                                                        onClick={() => handleAddSubTest(subTest)}
                                                    >
                                                        <CardContent
                                                            sx={{
                                                                padding: '0 !important',
                                                                width: '100%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <Typography variant="body1" sx={{ textAlign: 'start', width: '100%' }}>
                                                                {subTest.orderOfExecution} - {subTest.description}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </DragDropContext>

                        <Card
                            variant="outlined"
                            sx={{
                                marginTop: 1,
                                marginBottom: 2,
                                height: '40px',
                                width: '810px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                backgroundColor: '#e0e0e0',
                                transition: 'background-color 0.2s, transform 0.2s',
                                '&:hover': {
                                    backgroundColor: '#d0d0d0',
                                    transform: 'scale(1.02)',
                                },
                            }}
                            onClick={() => handleAddSubTest(null)}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="h6" component="div">
                                    <strong>+Add</strong>
                                </Typography>
                            </CardContent>
                        </Card>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <Button
                                type='button'
                                id='runBtn'
                                variant='contained'
                                onClick={handleExecution}
                                color='success'
                                sx={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.3s',
                                    '&:hover': {
                                        backgroundColor: '#388e3c',
                                    },
                                }}
                            >
                                EXECUTE
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* ...form for adding subtest... */}
            <Box>
                {showAddSubTestForm && isCardsVisible && (
                    <AddSubTestForm
                        onClose={handleCloseAddSubTestForm}
                        selectedTest={selectedTest}
                        fetchDataUnderTest={fetchDataUnderTest}
                        setSubTests={setSubTests}
                        subTestData={selectedSubTest}
                        subTestsLength={subTests.length}
                    />
                )}
            </Box>
        </Box>
    );
};

export default DragAndDrop;











