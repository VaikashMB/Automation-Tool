import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, locatorName }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Locator</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Do you really want to delete the locator '{locatorName}'?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    No
                </Button>
                <Button onClick={onConfirm} color="primary">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
