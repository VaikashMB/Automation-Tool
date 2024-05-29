import { Box, Button, FormControlLabel, TextField, Typography, Checkbox, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const AddSubTestForm = ({ onClose, selectedTest, fetchDataUnderTest, setSubTests, subTestData, subTestsLength }) => {

    const [formData, setFormData] = useState({
        keyword: '',
        orderOfExecution: '',
        description: '',
        locatorType: '',
        locatorValue: '',
        value: '',
        locatorType2: '',
        locatorValue2: '',
        flag: '',
        screenshot: false
    })

    const [errors, setErrors] = useState({})

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
        if (!formData.locatorType) tempErrors.locatorType = "Locator Type is required";
        if (!formData.locatorValue) tempErrors.locatorValue = "Locator Value is required";
        if (!formData.value) tempErrors.value = "Value is required";
        if (!formData.locatorType2) tempErrors.locatorType = "Locator Type 2 is required";
        if (!formData.locatorValue2) tempErrors.locatorValue = "Locator Value 2 is required";
        if (!formData.flag) tempErrors.flag = "Flag is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    useEffect(() => {
        if (subTestData) {
            setFormData(subTestData);
        } else {
            setFormData((prevData) => ({
                ...prevData,
                orderOfExecution: subTestsLength + 1
            }));
        }
    }, [subTestData, subTestsLength]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
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

    return (
        <Box sx={{
            padding: '22px', border: '0px solid #ccc',
            borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ font: 'sans-serif' }} variant='h5'>
                    {subTestData ? 'Update SubTest' : 'New SubTest'}
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
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="locatorType"
                    name="locatorType"
                    label="Locator-Type 1"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.locatorType}
                    onChange={handleInputChange}
                    error={!!errors.locatorType}
                    helperText={errors.locatorType}
                />
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="locatorValue"
                    name="locatorValue"
                    label="Locator-Value 1"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.locatorValue}
                    onChange={handleInputChange}
                    error={!!errors.locatorValue}
                    helperText={errors.locatorValue}
                />
            </Stack>
            <Stack direction='row' gap='10px'>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="locatorType2"
                    name="locatorType2"
                    label="Locator-Type 2"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.locatorType2}
                    onChange={handleInputChange}
                    error={!!errors.locatorType2}
                    helperText={errors.locatorType2}
                />
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="locatorValue2"
                    name="locatorValue2"
                    label="Locator-Value 2"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.locatorValue2}
                    onChange={handleInputChange}
                    error={!!errors.locatorValue2}
                    helperText={errors.locatorValue2}
                />
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
                    {subTestData ? 'Update' : 'Add'}
                </Button>
            </Box>
        </Box>
    )
}

export default AddSubTestForm
