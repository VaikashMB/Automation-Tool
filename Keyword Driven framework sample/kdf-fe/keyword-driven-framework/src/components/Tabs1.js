import { Box, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import React, { useState } from 'react'
import DragAndDrop from './DragAndDrop'
import Elements from './Elements'

const Tabs1 = () => {
    //state variable for storing the current tab value and for setting the tab value
    const [value, setValue] = useState('1')
    //function triggered when the tab is changed
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        //box container which contains the 5 tabs and the tab panel
        <Box>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                    <TabList onChange={handleChange}>
                        <Tab label='Tests' value='1'></Tab>
                        <Tab label='Elements' value='2'></Tab>
                        <Tab label='Jobs' value='3'></Tab>
                        <Tab label='Data Sources' value='4'></Tab>
                        <Tab label='Parameters' value='5'></Tab>
                    </TabList>
                </Box>
                <TabPanel value='1'><DragAndDrop /></TabPanel>
                <TabPanel value='2'><Elements /></TabPanel>
                <TabPanel value='3'>3</TabPanel>
                <TabPanel value='4'>4</TabPanel>
                <TabPanel value='5'>5</TabPanel>
            </TabContext>
        </Box>
    )
}

export default Tabs1