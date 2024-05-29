import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import ResultComponent from './ResultComponent';
import Typography from '@mui/material/Typography';


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


    //function for fetching all the projects available and setting it to the state variable "projects".
    const fetchProjects = () => {
        axios.get("http://localhost:8081/allProjects")
            .then((response) => setProjects(response.data))
            .catch((error) => console.log(error))
    }
    //function for fetching all the modules available under a particular  project and setting it to the state variable "modules".
    const fetchModulesUnderProject = (projectId) => {
        axios.get(`http://localhost:8081/project/modules/${projectId}`)
            .then((response) => setModules(response.data))
            .catch((error) => console.log(error))
    }
    //function for setting the projectId  in the state variable "selectedProject" when an item is selected from the dropdown menu and fetch Modules based on that projectId.
    const handleProjectChange = (event) => {
        const projectId = event.target.value
        setSelectedProject(projectId)
        fetchModulesUnderProject(projectId)
    }
    //function for fetching all the tests available under a module and adding them to the state variable "tests".
    const fetchTestsUnderModule = (moduleId) => {
        axios.get(`http://localhost:8081/tests/${moduleId}`)
            .then((response) => setTests(response.data))
            .catch((error) => console.log(error))
    }
    //function for setting the moduleId in the state variable 'selectedModule' when an option is selected from the dropdown menu and fetch tests based on that moduleId.
    const handleModuleChange = (event) => {
        const moduleId = event.target.value
        setSelectedModule(moduleId)
        fetchTestsUnderModule(moduleId)
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
    const handleModule = () => {
        document.getElementById("moduleSelect2").classList.remove("hidden")
    }
    //function responsible for displaying the particular element by adding or removing the 'hidden' class.
    const handleTest = () => {
        document.getElementById("testSelect2").classList.remove("hidden")
    }
    //function responsible for displaying the particular element by adding or removing the 'hidden' class.
    const handleRunTimes = () => {
        document.getElementById("executionSelect").classList.remove("hidden")
    }
    //function responsible for displaying the particular element by adding or removing the 'hidden' class.
    const handleResultsDatagrid = () => {
        document.getElementById("datagridSelect2").classList.remove("hidden")
    }

    return (
        //main container//
        <Box>
            {/* .......heading Test Results...... */}
            <Box>
                <Typography variant='h3' align='center' marginBottom={2}>
                    Test Results
                </Typography>
            </Box>
            {/* ....container having the dropdowns and the datagrid.... */}
            <Box sx={{ width: '100%', display: 'flex', gap: 3 }}>
                {/* ....container having the dropdowns.... */}
                <Box sx={{ width: '20%', paddingLeft: '20px', paddingRight: '70px', display: 'flex', flexDirection: 'column', gap: 3 }} >
                    {/* ...project dropdown...*/}
                    <Box id='projectSelect2' sx={{ display: "flex" }} >
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
                                        onClick={handleModule}
                                    >
                                        {project.projectName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* ...module dropdown...*/}
                    <div id='moduleSelect2' className="hidden">
                        <Box sx={{ display: 'flex' }}>
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
                                            onClick={handleTest}
                                        >
                                            {module.moduleName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </div>

                    {/* ...test dropdown...*/}
                    <div id='testSelect2' className='hidden'>
                        <Box sx={{ display: 'flex' }}>
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
                                            onClick={handleRunTimes}
                                        >
                                            {test.testName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </div>

                    {/* ...executions dropdown...*/}
                    <div id='executionSelect' className='hidden'>
                        <Box sx={{ display: 'flex' }}>
                            <FormControl fullWidth>
                                <InputLabel id="execution-selection">Executions</InputLabel>
                                <Select
                                    labelId="execution-selection"
                                    id="select-execution"
                                    label="execution"
                                    value={selectedExecution}
                                    onChange={handleExecutionChange}
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
                    </div>


                </Box>
                {/* ....datagrid....*/}
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