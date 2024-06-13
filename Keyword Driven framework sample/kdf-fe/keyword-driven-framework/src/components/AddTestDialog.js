import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box } from '@mui/material';
import axios from 'axios';
import CreateNewFolderSharpIcon from '@mui/icons-material/CreateNewFolderSharp';

const AddTestDialog = ({ selectedModule, onTestAdded }) => {
    const [open, setOpen] = React.useState(false);
    const [addTest, setAddTest] = React.useState({
        testName: "",
        testDescription: ""
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddTest = () => {
        axios.post(`http://localhost:8081/addTest/${selectedModule}`, addTest)
            .then(() => {
                onTestAdded();
                handleClose();
            })
            .catch((error) => console.log(error));
    };

    return (
        <Box>
            <Button sx={{marginTop:'8px'}} onClick={handleClickOpen}>
                <CreateNewFolderSharpIcon />
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Test</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="testName"
                        name="testName"
                        label="Test Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={addTest.testName}
                        onChange={(e) => setAddTest({ ...addTest, testName: e.target.value })}
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="testDescription"
                        name="testDescription"
                        label="Test Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={addTest.testDescription}
                        onChange={(e) => setAddTest({ ...addTest, testDescription: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="button" onClick={handleAddTest}>Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddTestDialog;