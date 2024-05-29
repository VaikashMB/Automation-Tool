import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaChrome, FaEdge } from 'react-icons/fa';

const DatagridSample = ({ subTests, setSubTests, selectedTest, fetchDataUnderTest }) => {

    const [isChecked, setIsChecked] = useState(false);

    const [selectedBrowsers, setSelectedBrowsers] = useState([])

    useEffect(() => {
        console.log(isChecked);
    }, [isChecked]); // This effect will run whenever `isChecked` changes

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

    const handleExecution = () => {
        const payload = {
            browsers: selectedBrowsers,
            actionKeyword: rows,
            headless: isChecked
        };
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

    //function for saving the test steps and fetching the data under each test
    const handleSaveOperation = (selectedRow) => {
        console.log(selectedRow)
        axios.post(`http://localhost:8081/keyword/addSubTest/${selectedTest}`, selectedRow)
            .then(() => {
                setSubTests(subTests => {
                    return subTests.map(row => {
                        return row.id === selectedRow.id ? selectedRow : row;
                    });
                });
                fetchDataUnderTest(selectedTest);
            })
            .catch((error) => { console.log(error) })
    }

    //commented temporarily !!!//
    //function for deleting a particulat test step
    const handleDeleteOperation = (selectedRow) => {
        // axios.delete(`http://localhost:8081/keyword/delete/${selectedRow.id}`)
        //     .then((response) => {
        //         console.log(response.data);
        //         if (response.status === 200) {
        //             setSubTests((prevData) => prevData.filter(row => row.id !== selectedRow.id));
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });
    };

    //function for adding a new empty row
    const handleAddClick = () => {
        const newRow = {
            id: '',
            orderOfExecution: '',
            keyword: '',
            description: '',
            locatorType: '',
            locatorValue: '',
            value: '',
            flag: '',
            screenshot: false
        };
        setSubTests((prevData) => [...prevData, newRow]);
    };

    const isCellEditable = (params) => {
        // Allow editing for 'typeMaskedText' keyword when cell is empty
        if (params.field === 'value' && params.row.keyword === 'typeMaskedText' && params.row.value === '') {
            return true;
        }
        // Disable editing for 'typeMaskedText' keyword when cell is not empty
        if (params.field === 'value' && params.row.keyword === 'typeMaskedText' && params.row.value !== '') {
            return false;
        }
        return true;
    };

    const keywords = [
        'goToURL',
        'typeText',
        'verifyText',
        'click',
        'closeBrowser',
        'waitFor',
        'clearText',
        'verifyElement',
        'selectFromDropdown',
        'typeMaskedText',
        'mouseHover',
        'doubleClick',
        'downKeyAndEnter',
        'scrollToBottom',
        'scrollToTop',
        'scrollToElement',
        'getValue',
        'typeValue',
        'enter',
        'verifyURL',
        'verifyPageTitle',
        'waitForElement',
        'generateRandomNumber',
        'generateRandomText',
        'refreshPage',
        'acceptAlert',
        'dismissAlert',
        'fileUpload',
        'dragAndDrop',
        'executeSelectQuery',
        'rightClick'
    ]

    const flags = ['Y', 'N']

    //function for checking the headless checkbox
    const handleCheckboxChange = (event, rowId) => {
        const updatedRows = subTests.map(row => {
            if (row.id === rowId) {
                return { ...row, screenshot: event.target.checked };
            }
            return row;
        });
        setSubTests(updatedRows);
    };

    const fields = [
        {
            field: "id",
            headerName: <strong>ID</strong>,
            width: 100,
            headerClassName: 'header-column',
        },
        {
            field: "orderOfExecution",
            headerName: <strong>Order</strong>,
            width: 75,
            headerClassName: 'header-column',
            editable: true
        },
        {
            field: "keyword",
            headerName: <strong>Keyword</strong>,
            width: 120,
            headerClassName: 'header-column',
            editable: true,
            type: 'singleSelect',
            valueOptions: keywords
        },
        {
            field: "description",
            headerName: <strong>Description</strong>,
            width: 110,
            headerClassName: 'header-column',
            editable: true
        },
        {
            field: "locatorType",
            headerName: <strong>Locator-Type</strong>,
            width: 100,
            headerClassName: 'header-column',
            editable: true
        },
        {
            field: "locatorValue",
            headerName: <strong>Locator-Value</strong>,
            width: 120,
            headerClassName: 'header-column',
            editable: true
        },
        {
            field: "value",
            headerName: <strong>Parameter</strong>,
            width: 120,
            headerClassName: 'header-column',
            editable: true,
            renderCell: (params) => {
                // Check if the keyword is 'typeMaskedText' and value is empty
                if (params.row.keyword === 'typeMaskedText' && params.row.value === '') {
                    return <span></span>;
                }
                // Check if the keyword is 'typeMaskedText' and value is not empty
                else if (params.row.keyword === 'typeMaskedText' && params.row.value !== '') {
                    return <span>********</span>;
                }
                // Render actual value for other cases
                return <span>{params.row.value}</span>;
            }
        },
        {
            field: "flag",
            headerName: <strong>Flag</strong>,
            width: 80,
            headerClassName: 'header-column',
            editable: true,
            type: 'singleSelect',
            valueOptions: flags
        },
        {
            field: "screenshot",
            headerName: <strong>Screenshot</strong>,
            width: 100,
            headerClassName: 'header-column',
            editable: true,
            renderCell: (params) => (
                <input
                    type="checkbox"
                    checked={params.value}
                    onChange={(event) => handleCheckboxChange(event, params.row.id)}
                />
            )
        },
        {
            field: "save",
            headerName: <strong>Save</strong>,
            width: 80,
            headerClassName: 'header-column',
            renderCell: (params) =>
                <Box>
                    <Button id='saveBtn' onClick={() => handleSaveOperation(params.row)}>
                        <SaveIcon />
                    </Button>
                </Box>
        },
        {
            field: "delete",
            headerName: <strong>Delete</strong>,
            width: 80,
            headerClassName: 'header-column',
            renderCell: (params) =>
                <Box>
                    <Button id='deleteBtn' onClick={() => handleDeleteOperation(params.row)}>
                        <DeleteIcon />
                    </Button>
                </Box>
        }
    ]

    const rows = subTests.map((data) => {
        return {
            id: data.id,
            keyword: data.keyword,
            orderOfExecution: data.orderOfExecution,
            description: data.description,
            locatorType: data.locatorType,
            locatorValue: data.locatorValue,
            value: data.value,
            flag: data.flag,
            screenshot: data.screenshot ? true : false,
        }
    })

    const getRowId = (data) => data.id

    return (
        <Box sx={{
            border: '0px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
            <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                <DataGrid
                    columns={fields}
                    rows={rows}
                    getRowId={getRowId}
                    disableRowSelectionOnClick
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'Mui-even' : 'Mui-odd'
                    }
                    isCellEditable={isCellEditable}
                    sx={{
                        border: '1px solid #ccc',
                        borderBottom: 'none',
                        borderRadius: '8px',
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
                        <label htmlFor="chromeCheckbox" style={{ fontSize: '16px', marginBottom: 0 }}>Chrome-Headless</label>
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
                        <label htmlFor="edgeCheckbox" style={{ fontSize: '16px', marginBottom: 0 }}>Edge-Headless</label>
                        <input
                            id='edgeHeadlessCheckbox'
                            type="checkbox"
                            color="primary"
                            style={{ width: '24px', height: '24px' }}
                            onChange={(event) => handleBrowserCheckboxChange('edge-headless', event)}
                        />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Button
                        type='button'
                        id='addBtn'
                        variant='contained'
                        onClick={handleAddClick}
                        color='primary'
                    >
                        ADD
                    </Button>
                    <Button
                        type='button'
                        id='runBtn'
                        variant='contained'
                        onClick={handleExecution}
                        color='success'
                    >
                        EXECUTE
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
export default DatagridSample
