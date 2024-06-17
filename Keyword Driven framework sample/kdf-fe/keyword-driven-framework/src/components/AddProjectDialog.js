//dialog box for adding a project. Displayed when the addNewFolderIcon is clicked.
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CreateNewFolderSharpIcon from '@mui/icons-material/CreateNewFolderSharp';
import axios from 'axios';

const AddProjectDialog = ({ onProjectAdded }) => {
    const [open, setOpen] = React.useState(false);

    const [addProjects, setAddProjects] = React.useState({
        projectName: "",
        projectDescription: ""
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddProject = () => {
        axios.post("http://localhost:8081/addProject", addProjects)
            .then(() => {
                onProjectAdded();
                handleClose();
            })
            .catch((error) => console.log(error));
    };

    return (
        <React.Fragment>
            <Button onClick={handleClickOpen}>
                <CreateNewFolderSharpIcon />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                component='form'
            >
                <DialogTitle>Add Project</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="projectName"
                        name="projectName"
                        label="Project Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={addProjects.projectName}
                        onChange={(e) => setAddProjects({ ...addProjects, projectName: e.target.value })}
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="projectDescription"
                        name="projectDescription"
                        label="Project Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={addProjects.projectDescription}
                        onChange={(e) => setAddProjects({ ...addProjects, projectDescription: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="button" onClick={handleAddProject}>Add</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default AddProjectDialog;

