//dialog box for adding a module under a project. Displayed when the addNewFolderIcon is clicked.
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box } from '@mui/material';
import axios from 'axios';
import CreateNewFolderSharpIcon from '@mui/icons-material/CreateNewFolderSharp';

const AddModuleDialog = ({ selectedProject, onModuleAdded }) => {
    const [open, setOpen] = React.useState(false);
    const [addModule, setAddModule] = React.useState({
        moduleName: "",
        moduleDescription: ""
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddModule = () => {
        axios.post(`http://localhost:8081/addModule/${selectedProject}`, addModule)
            .then(() => {
                onModuleAdded();
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
                <DialogTitle>Add Module</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="moduleName"
                        name="moduleName"
                        label="Module Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={addModule.moduleName}
                        onChange={(e) => setAddModule({ ...addModule, moduleName: e.target.value })}
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="moduleDescription"
                        name="moduleDescription"
                        label="Module Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={addModule.moduleDescription}
                        onChange={(e) => setAddModule({ ...addModule, moduleDescription: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="button" onClick={handleAddModule}>Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddModuleDialog;

