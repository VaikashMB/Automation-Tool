import React, { useState, useEffect } from 'react'
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import axios from 'axios'

const AddLocatorDialog = ({ selectedTest, setLocatorOptions, locatorOptions, onClose, existingLocator, onUpdateLocator}) => {

    const [open, setOpen] = useState(true)
    const [newLocator, setNewLocator] = useState({
        locatorName: '',
        locatorType1: '',
        locatorValue1: '',
        locatorType2: '',
        locatorValue2: '',
    })

    useEffect(() => {
        if (existingLocator) {
            setNewLocator(existingLocator)
        }
    }, [existingLocator])

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewLocator({
            ...newLocator,
            [name]: value
        })
    }

    const handleSubmit = () => {
        if (existingLocator) {
            axios.put(`http://localhost:8081/updateLocator/${existingLocator.locatorId}`, newLocator)
                .then((response) => {
                    onUpdateLocator(response.data)
                    setOpen(false)
                    onClose()
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            axios.post(`http://localhost:8081/addLocatorUnderTestId/${selectedTest}`, newLocator)
                .then((response) => {
                    setLocatorOptions([...locatorOptions, response.data])
                    setOpen(false)
                    onClose()
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    return (
        <Box>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{existingLocator ? 'Edit Element' : 'Create Element'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="locatorName"
                        label="Locator Name"
                        type="text"
                        fullWidth
                        value={newLocator.locatorName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="locatorType1"
                        label="Locator Type 1"
                        type="text"
                        fullWidth
                        value={newLocator.locatorType1}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="locatorValue1"
                        label="Locator Value 1"
                        type="text"
                        fullWidth
                        value={newLocator.locatorValue1}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="locatorType2"
                        label="Locator Type 2"
                        type="text"
                        fullWidth
                        value={newLocator.locatorType2}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="locatorValue2"
                        label="Locator Value 2"
                        type="text"
                        fullWidth
                        value={newLocator.locatorValue2}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>{existingLocator ? 'Update' : 'Submit'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default AddLocatorDialog

