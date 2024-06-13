import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import AddSubTestForm from './AddSubTestForm';
import Browsers from './Browsers';
import ProjectSelect from './ProjectSelect';
import ModuleSelect from './ModuleSelect';
import TestSelect from './TestSelect';
import AddProjectDialog from './AddProjectDialog';
import AddModuleDialog from './AddModuleDialog';
import AddTestDialog from './AddTestDialog'
import SubTests from './SubTests';

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
    const [disabledModule, setDisabledModule] = useState(true)
    const [disabledTest, setDisabledTest] = useState(true)

    useEffect(() => {
        console.log(isChecked);
    }, [isChecked]);

    useEffect(() => {
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
    //function for executing the keywords under the selected test and post the test results
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
    //function for fetching the projects
    const fetchProjects = () => {
        axios.get("http://localhost:8081/allProjects")
            .then((response) => setProjects(response.data))
            .catch((error) => console.log(error))
    }
    //function for fetching the modules under the selected project
    const fetchModulesUnderProject = (projectId) => {
        axios.get(`http://localhost:8081/project/modules/${projectId}`)
            .then((response) => setModules(response.data))
            .catch((error) => console.log(error))
    }
    //to store the selected project into a state variable
    const handleProjectChange = (event) => {
        const projectId = event.target.value;
        setSelectedProject(projectId);
        fetchModulesUnderProject(projectId);
        setShowAddSubTestForm(false);
        setDisabledModule(false)
    };
    //function to fetch tests under the selected module
    const fetchTestsUnderModule = (moduleId) => {
        axios.get(`http://localhost:8081/tests/${moduleId}`)
            .then((response) => setTests(response.data))
            .catch((error) => console.log(error))
    }
    //to store the selected module into a state variable.
    const handleModuleChange = (event) => {
        const moduleId = event.target.value;
        setSelectedModule(moduleId);
        fetchTestsUnderModule(moduleId);
        setShowAddSubTestForm(false);
        setDisabledTest(false)
    }
    //function to fetch data under the selected test.
    const fetchDataUnderTest = (testId) => {
        axios.get(`http://localhost:8081/keyword/subTests/${testId}`)
            .then((response) => setSubTests(response.data))
            .catch((error) => console.log(error))
    }
    //to store the selected test into a state variable
    const handleTestChange = (event) => {
        const testId = event.target.value;
        setSelectedTest(testId);
        fetchDataUnderTest(testId);
    }
    //function to handle the subtest adding form. If the subTest is null, the form appears with the next order of execution. If not null, the form appears with the saved data.
    const handleAddSubTest = (subTest = null) => {
        if (subTest === null) {
            const newOrderOfExecution = subTests.length + 1;
            subTest = { id: null, orderOfExecution: newOrderOfExecution, description: '', locatorType: '', value: '', flag: 'Y' };
        }
        setSelectedSubTest(subTest);
        setShowAddSubTestForm(true);
    };
    //function to close the form for adding a subtest
    const handleCloseAddSubTestForm = () => {
        setShowAddSubTestForm(false);
        setSelectedSubTest(null);
    };
    //drag and drop the cards.
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
                <Box sx={{ width: '20%', paddingRight: '10px', display: 'flex', gap: 2 }}>
                    <AddProjectDialog onProjectAdded={fetchProjects} />
                    <ProjectSelect
                        projects={projects}
                        selectedProject={selectedProject}
                        handleProjectChange={handleProjectChange}
                        fetchProjects={fetchProjects}
                    />
                    <AddModuleDialog selectedProject={selectedProject} onModuleAdded={refreshModules} />
                    <ModuleSelect
                        modules={modules}
                        selectedModule={selectedModule}
                        handleModuleChange={handleModuleChange}
                        disabledModule={disabledModule}
                        selectedProject={selectedProject}
                        refreshModules={refreshModules}
                    />
                    <AddTestDialog selectedModule={selectedModule} onTestAdded={refreshTests} />
                    <TestSelect
                        tests={tests}
                        selectedTest={selectedTest}
                        handleTestChange={handleTestChange}
                        disabledTest={disabledTest}
                        selectedModule={selectedModule}
                        refreshTests={refreshTests}
                    />
                </Box>

                {/* ...browsers... */}
                <Browsers setSelectedBrowsers={setSelectedBrowsers} />

                {/* ...cards, add and execute... */}
                {isCardsVisible && (
                    <SubTests
                        subTests={subTests}
                        handleAddSubTest={handleAddSubTest}
                        handleExecution={handleExecution}
                        onDragEnd={onDragEnd}
                    />
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











