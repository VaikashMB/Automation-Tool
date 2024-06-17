//component which displays the test results datagrid and the dropdowns
import { Box } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import ResultComponent from './ResultComponent';
import Typography from '@mui/material/Typography';
import ProjectSelect from './ProjectSelect';
import ModuleSelect from './ModuleSelect';
import TestSelect from './TestSelect';
import ExecutionsSelect from './ExecutionsSelect';
import { fetchModulesUnderProject } from './services.js/projectService';
import { fetchTestsUnderModule } from './services.js/moduleService';

const ReportsComponent = () => {
    //statevariable which stores all the projects available in the database.
    const [projects, setProjects] = useState([]);
    //statevariable which contains the value of the currently selected project.
    const [selectedProject, setSelectedProject] = React.useState('');
    //statevariable which stores all the modules available under a particular project.
    const [modules, setModules] = useState([]);
    //statevariable which contains the value of the  current module selected by the user.
    const [selectedModule, setSelectedModule] = useState('');
    //statevariable which contains all the tests available under a particular module.
    const [tests, setTests] = useState([]);
    //statevariable which contains the value of the  current test selected by the user.
    const [selectedTest, setSelectedTest] = useState('');
    //statevariable which contains all the test steps  available for a specific test.
    const [testResults, setTestResults] = useState([])
    //statevariable which contains the runId of the current test being executed.
    const [selectedExecution, setSelectedExecution] = useState('');
    //statevariable which stores the test results under a particular runId.
    const [testResultsByRunId, setTestResultsByRunId] = useState([])

    const [disabledModule, setDisabledModule] = useState(true)
    const [disabledTest, setDisabledTest] = useState(true)
    const [disabledExecutions, setDisabledExecutions] = useState(true)


    //function for fetching all the projects available and setting it to the state variable "projects".
    const fetchProjects = () => {
        axios.get("http://localhost:8081/allProjects")
            .then((response) => setProjects(response.data))
            .catch((error) => console.log(error))
    }
    //function for setting the projectId  in the state variable "selectedProject" when an item is selected from the dropdown menu and fetch Modules based on that projectId.
    const handleProjectChange = (event) => {
        const projectId = event.target.value
        setSelectedProject(projectId)
        fetchModulesUnderProject(projectId).then(setModules).catch(console.log)
        setDisabledModule(false)
    }
    //function for setting the moduleId in the state variable 'selectedModule' when an option is selected from the dropdown menu and fetch tests based on that moduleId.
    const handleModuleChange = (event) => {
        const moduleId = event.target.value
        setSelectedModule(moduleId)
        fetchTestsUnderModule(moduleId).then(setTests).catch(console.log)
        setDisabledTest(false)
    }
    //function for fetching TestResults by TestId and setting it to the state variable "testResults".Also filtering the TestResults by runId so that the RunId is not repeated while selecting from dropdown.
    const fetchTestResultsUnderTest = (testId) => {
        axios.get(`http://localhost:8081/getTestResultsByTestId/${testId}`)
            .then((response) => {
                const uniqueTestResults = response.data.filter((result, index, self) =>
                    index === self.findIndex((t) => (
                        t.runId === result.runId
                    ))
                );
                const reversedTestResults = uniqueTestResults.reverse();
                setTestResults(reversedTestResults);
            })
            .catch((error) => console.log(error))
    }
    //function for setting the testId in the state variable 'selectedTest' when an option is selected from the dropdown menu and fetch testResults based on that testId.
    const handleTestChange = (event) => {
        const testId = event.target.value
        setSelectedTest(testId)
        fetchTestResultsUnderTest(testId)
        setDisabledExecutions(false)
    }
    //fetching TestResults by RunId and setting it to the state variable "testResultsByRunId".
    const fetchTestResultsByRunId = (runId) => {
        axios.get(`http://localhost:8081/getTestResultsByRunId/${runId}`)
            .then((response) => setTestResultsByRunId(response.data))
            .catch((error) => console.log(error))
    }
    //function for setting the runId in the state variable 'selectedExecution' when an option is selected from the dropdown menu and fetch testResults based on that runId.
    const handleExecutionChange = (event) => {
        const runId = event.target.value
        setSelectedExecution(runId)
        fetchTestResultsByRunId(runId)
    }

    //function responsible for displaying the particular element by adding or removing the 'hidden' class.
    const handleResultsDatagrid = () => {
        document.getElementById("datagridSelect2").classList.remove("hidden")
    }

    return (
        //main container//
        <Box>
            <Box>
                <Typography variant='h3' align='center' marginBottom={2}>
                    Test Results
                </Typography>
            </Box>
            {/* ....container having the dropdowns and the datagrid.... */}
            <Box sx={{ width: '100%', display: 'flex', gap: 3 }}>
                {/* ....container having the dropdowns.... */}
                <Box sx={{ width: '20%', paddingLeft: '20px', paddingRight: '70px', display: 'flex', flexDirection: 'column', gap: 5 }} >

                    <ProjectSelect
                        projects={projects}
                        selectedProject={selectedProject}
                        handleProjectChange={handleProjectChange}
                        fetchProjects={fetchProjects}
                    />

                    <ModuleSelect
                        modules={modules}
                        selectedModule={selectedModule}
                        handleModuleChange={handleModuleChange}
                        disabledModule={disabledModule}
                        selectedProject={selectedProject}
                    />

                    <TestSelect
                        tests={tests}
                        selectedTest={selectedTest}
                        handleTestChange={handleTestChange}
                        disabledTest={disabledTest}
                        selectedModule={selectedModule}
                    />

                    <ExecutionsSelect
                        testResults={testResults}
                        handleExecutionChange={handleExecutionChange}
                        handleResultsDatagrid={handleResultsDatagrid}
                        disabledExecutions={disabledExecutions}
                        selectedExecution={selectedExecution}
                    />
                </Box>
                
                <div id='datagridSelect2' className='hidden'>
                    <ResultComponent
                        testResultsByRunId={testResultsByRunId}
                    />
                </div>
            </Box>
        </Box>
    )
}

export default ReportsComponent