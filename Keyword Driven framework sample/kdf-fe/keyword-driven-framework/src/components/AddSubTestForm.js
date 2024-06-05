import { Box, Button, FormControlLabel, TextField, Typography, Checkbox, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import AddLocatorDialog from './AddLocatorDialog';

const AddSubTestForm = ({ onClose, selectedTest, fetchDataUnderTest, setSubTests, subTestData, subTestsLength}) => {

    const [showAddLocatorDialog, setShowAddLocatorDialog] = useState(false)
    const [errors, setErrors] = useState({})
    const [locatorOptions, setLocatorOptions] = useState([]);
    const [formData, setFormData] = useState({
        keyword: '',
        orderOfExecution: '',
        description: '',
        value: '',
        locatorId: '',
        flag: '',
        screenshot: false
    })

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

    const flags = ["Y", "N"]

    const validate = () => {
        let tempErrors = {};
        if (!formData.keyword) tempErrors.keyword = "Keyword is required";
        if (!formData.orderOfExecution) tempErrors.orderOfExecution = "Order of Execution is required";
        if (!formData.description) tempErrors.description = "Description is required";
        if (!formData.value) tempErrors.value = "Value is required";
        if (!formData.locatorId) tempErrors.locatorId = "Locator ID is required";
        if (!formData.flag) tempErrors.flag = "Flag is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    useEffect(() => {
        if (selectedTest) {
            axios.get(`http://localhost:8081/getLocatorsUnderTestId/${selectedTest}`)
                .then(response => {
                    setLocatorOptions(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        if (subTestData) {
            setFormData(subTestData);
        } else {
            setFormData((prevData) => ({
                ...prevData,
                orderOfExecution: subTestsLength + 1
            }));
        }
    }, [selectedTest, subTestData, subTestsLength]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'locatorId' ? JSON.parse(value) : value
        }));
    };

    useEffect(() => {
        console.log("Screenshot state:", formData.screenshot);
    }, [formData.screenshot]);

    const handleCheckboxChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            screenshot: event.target.checked
        }));
    };

    const handleSaveOperation = () => {
        if (validate()) {
            axios.post(`http://localhost:8081/keyword/addSubTest/${selectedTest}`, formData)
                .then(response => {
                    const newSubTest = response.data;
                    setSubTests(prevSubTests => [...prevSubTests, newSubTest]);
                    fetchDataUnderTest(selectedTest);
                    onClose();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    //commented temporarily....
    const handleDeleteOperation = () => {
        axios.delete(`http://localhost:8081/keyword/delete/${subTestData.id}`)
            .then((response) => {
                console.log(response.data);
                if (response.status === 200) {
                    setSubTests((prevData) => prevData.filter(row => row.id !== subTestData.id))
                    onClose()
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleAddNewLocator = () => {
        setShowAddLocatorDialog(true)
    }

    const handleCloseLocatorDialog = () => {
        setShowAddLocatorDialog(false);
    }

    return (
        <Box sx={{
            padding: '22px', border: '0px solid #ccc',
            borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ font: 'sans-serif' }} variant='h5'>
                    New SubTest
                </Typography>
                <Button
                    color="secondary"
                    onClick={onClose}
                >
                    <CancelIcon />
                </Button>
            </Box>
            <FormControl fullWidth variant="standard" margin="dense" error={!!errors.keyword}>
                <InputLabel id="keyword-label">Keyword</InputLabel>
                <Select
                    labelId="keyword-label"
                    id="keyword"
                    name="keyword"
                    value={formData.keyword}
                    onChange={handleInputChange}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 250
                            }
                        }
                    }}
                >
                    {keywords.map((keyword, index) => (
                        <MenuItem key={index} value={keyword}>
                            {keyword}
                        </MenuItem>
                    ))}
                </Select>
                {errors.keyword && <Typography color="error">{errors.keyword}</Typography>}
            </FormControl>
            <TextField
                autoFocus
                required
                margin="dense"
                id="orderOfExecution"
                name="orderOfExecution"
                label="Order Of Execution"
                type="text"
                fullWidth
                variant="standard"
                value={formData.orderOfExecution}
                onChange={handleInputChange}
                error={!!errors.orderOfExecution}
                helperText={errors.orderOfExecution}
            />
            <TextField
                autoFocus
                required
                margin="dense"
                id="description"
                name="description"
                label="Description"
                type="text"
                fullWidth
                variant="standard"
                value={formData.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
            />
            <Stack direction='row' gap='10px'>
                <FormControl fullWidth variant="standard" margin="dense" error={!!errors.locatorId}>
                    <InputLabel id="locatorId-label">Locator</InputLabel>
                    <Select
                        labelId="locatorId-label"
                        id="locatorId"
                        name="locatorId"
                        value={JSON.stringify(formData.locatorId)}
                        onChange={handleInputChange}
                    >
                        {locatorOptions.map((locator) => (
                            <MenuItem key={locator.locatorId} value={JSON.stringify(locator)}>
                                {locator.locatorName}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.locatorId && <Typography color="error">{errors.locatorId}</Typography>}
                </FormControl>
                <Button variant='outlined' sx={{ height: '55px' }} onClick={handleAddNewLocator}>ADD NEW</Button>
            </Stack>
            <TextField
                autoFocus
                required
                margin="dense"
                id="value"
                name="value"
                label="Parameter"
                type="text"
                fullWidth
                variant="standard"
                value={formData.value}
                onChange={handleInputChange}
                error={!!errors.value}
                helperText={errors.value}
            />
            <FormControl fullWidth variant="standard" margin="dense" error={!!errors.flag}>
                <InputLabel id="flag-label">Flag</InputLabel>
                <Select
                    labelId="flag-label"
                    id="flag"
                    name="flag"
                    value={formData.flag}
                    onChange={handleInputChange}
                >
                    {flags.map((flag, index) => (
                        <MenuItem key={index} value={flag}>
                            {flag}
                        </MenuItem>
                    ))}
                </Select>
                {errors.flag && <Typography color="error">{errors.flag}</Typography>}
            </FormControl>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.screenshot}
                        onChange={handleCheckboxChange}
                        name="screenshot"
                        color="primary"
                    />
                }
                label="Screenshot"
            />
            <Box sx={{ display: 'flex', justifyContent: 'end', gap: '25px' }}>
                {subTestData && (
                    <Button
                        color='error'
                        variant='contained'
                        onClick={handleDeleteOperation}
                    >
                        Delete
                    </Button>
                )}
                <Button
                    color='secondary'
                    variant='contained'
                    onClick={handleSaveOperation}
                >
                    Add
                </Button>
            </Box>

            <Box>
                {showAddLocatorDialog && (
                    <AddLocatorDialog
                        locatorOptions={locatorOptions}
                        setLocatorOptions={setLocatorOptions}
                        selectedTest={selectedTest}
                        onClose={handleCloseLocatorDialog}
                    />
                )}
            </Box>
        </Box>
    )
}

export default AddSubTestForm
