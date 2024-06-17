//component for displaying all the locators in the Elemets tab
import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Card, CardContent, Grid, IconButton, Typography } from '@mui/material';

const AddedLocators = ({ locators, handleEditClick, handleDeleteClick }) => {
    return (
        <Box sx={{ padding: '20px' }}>
            <Grid container spacing={2}>
                {locators.map((locator) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={locator.locatorId}>
                        <Card sx={{ p: 0 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography sx={{ fontSize: '1.10rem', marginTop: '6px' }} component="div">
                                            {locator.locatorName}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <IconButton color="primary" onClick={() => handleEditClick(locator)}>
                                            <EditIcon sx={{ width: '20px' }} />
                                        </IconButton>
                                        <IconButton color='primary' onClick={() => handleDeleteClick(locator)}>
                                            <DeleteIcon sx={{ width: '20px' }} />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default AddedLocators
