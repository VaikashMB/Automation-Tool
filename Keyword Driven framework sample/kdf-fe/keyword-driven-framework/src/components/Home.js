//component which shows the project, module, test dropdowns along with the browser checkboxes , where the test steps are displayed and the form for adding subtests are displayed.
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import AddSubTestForm from './AddSubTestForm';
import Browsers from './Browsers';
import ProjectSelect from './ProjectSelect';
import ModuleSelect from './ModuleSelect';
import TestSelect from './TestSelect';
import AddProjectDialog from './AddProjectDialog';
import AddModuleDialog from './AddModuleDialog';
import AddTestDialog from './AddTestDialog'
import SubTests from './SubTests';
import { fetchModulesUnderProject, fetchProjects } from './services.js/projectService';
import { fetchTestsUnderModule } from './services.js/moduleService';
import { executeAllKeywords, fetchSubTestsUnderTest, postTestResults, updateExecutionOrder } from './services.js/testService';

const Home = () => {
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
            actionKeyword: rows,
        };

        executeAllKeywords(selectedTest, payload)
            .then((response) => {
                postTestResults(response).catch((error) => {
                    console.error('Error posting data to testResults db:', error);
                });
            })
            .catch((error) => {
                console.error('Error executing all keywords:', error);
            });
    };

    //to store the selected project into a state variable
    const handleProjectChange = (event) => {
        const projectId = event.target.value;
        setSelectedProject(projectId);
        fetchModulesUnderProject(projectId).then(setModules).catch(console.log)
        setShowAddSubTestForm(false);
        setDisabledModule(false)
    };

    //to store the selected module into a state variable.
    const handleModuleChange = (event) => {
        const moduleId = event.target.value;
        setSelectedModule(moduleId);
        fetchTestsUnderModule(moduleId).then(setTests).catch(console.log)
        setShowAddSubTestForm(false);
        setDisabledTest(false)
    }

    //to store the selected test into a state variable
    const handleTestChange = (event) => {
        const testId = event.target.value;
        setSelectedTest(testId);
        fetchSubTestsUnderTest(testId).then(setSubTests).catch(console.log)
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
        updateExecutionOrder(selectedTest, updatedOrder)
            .then((response) => {
                console.log("Order updated successfully:", response);
                fetchSubTestsUnderTest(selectedTest).then(setSubTests).catch(console.log)
            })
            .catch((error) => {
                console.error("Error updating order:", error);
            });
    };

    useEffect(() => {
        if (selectedProject) {
            fetchModulesUnderProject(selectedProject).then(setModules).catch(console.log)
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
            fetchTestsUnderModule(selectedModule).then(setTests).catch(console.log)
        } else {
        }
        setTests([]);
        setSelectedTest('');
        setSubTests([]);
        setIsCardsVisible(false);
    }, [selectedModule]);

    useEffect(() => {
        if (selectedTest) {
            fetchSubTestsUnderTest(selectedTest).then(setSubTests).catch(console.log)
            setIsCardsVisible(true);
        } else {
            setIsCardsVisible(false);
        }
        setSubTests([]);
    }, [selectedTest]);

    const refreshModules = () => {
        if (selectedProject) {
            fetchModulesUnderProject(selectedProject).then(setModules).catch(console.log)
        }
    };

    const refreshTests = () => {
        if (selectedModule) {
            fetchTestsUnderModule(selectedModule).then(setTests).catch(console.log)
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: '50px' }}>
            <Box sx={{ width: '55%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* ...dropdowns... */}
                <Box sx={{ width: '20%', paddingRight: '10px', display: 'flex', gap: 2 }}>
                    <AddProjectDialog onProjectAdded={() => fetchProjects().then(setProjects).catch(console.log)} />
                    <ProjectSelect
                        projects={projects}
                        selectedProject={selectedProject}
                        handleProjectChange={handleProjectChange}
                        fetchProjects={() => fetchProjects().then(setProjects).catch(console.log)}
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
                        setSubTests={setSubTests}
                        subTestData={selectedSubTest}
                        subTestsLength={subTests.length}
                    />
                )}
            </Box>
        </Box>
    );
};

export default Home;











