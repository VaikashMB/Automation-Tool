import { Box } from '@mui/material';
import React from 'react'
import { FaChrome, FaEdge } from 'react-icons/fa';

const Browsers = ({setSelectedBrowsers}) => {

    const handleBrowserCheckboxChange = (browser, event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedBrowsers(prevState => [...prevState, browser]);
        } else {
            setSelectedBrowsers(prevState => prevState.filter(item => item !== browser));
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '20px', marginTop: '20px', justifyContent: 'start', gap: '62px' }}>
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
                <label htmlFor="chromeHeadlessCheckbox" style={{ fontSize: '16px', marginBottom: 0 }}>Chrome-Headless</label>
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
                <label htmlFor="edgeHeadlessCheckbox" style={{ fontSize: '16px', marginBottom: 0 }}>Edge-Headless</label>
                <input
                    id='edgeHeadlessCheckbox'
                    type="checkbox"
                    color="primary"
                    style={{ width: '24px', height: '24px' }}
                    onChange={(event) => handleBrowserCheckboxChange('edge-headless', event)}
                />
            </Box>
        </Box>
    )
}

export default Browsers
