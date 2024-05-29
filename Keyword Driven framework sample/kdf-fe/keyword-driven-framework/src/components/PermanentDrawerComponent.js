import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tabs1 from './Tabs1';
import ReportsComponent from './ReportsComponent';
import { useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Button, IconButton, Tooltip } from '@mui/material';
import Profile from './Profile';
import {
    Home as HomeIcon, Assessment as AssessmentIcon, Assignment as AssignmentIcon, Code as CodeIcon, Person as PersonIcon, ChevronLeft as ChevronLeftIcon, Menu as MenuIcon
} from '@mui/icons-material';

const PermanentDrawerComponent = () => {
    const drawerWidth = 150;
    const collapsedDrawerWidth = 70;
    const [selectedItem, setSelectedItem] = React.useState('Projects');
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleSelectedItem = (text) => {
        setSelectedItem(text);
    }

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    }

    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth0();

    const iconMapping = {
        'Projects': <HomeIcon />,
        'Monitor': <AssessmentIcon />,
        'Reports': <AssignmentIcon />,
        "API's": <CodeIcon />,
        'Profile': <PersonIcon />,
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton color="inherit" onClick={toggleDrawer} sx={{ marginRight: 2 }}>
                        {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontSize: '1.55rem' }}>
                        Keyword-Driven Framework
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isAuthenticated && user && location.pathname === '/home' && (
                            <Typography variant="h6" noWrap component="div" sx={{ mr: 2 }}>
                                Welcome {user.name}
                            </Typography>
                        )}
                        <Button variant="outlined" size='small' sx={{ color: 'white', borderColor: 'white' }} onClick={logout}>Log Out</Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', flex: 1 }}>
                <Drawer
                    sx={{
                        width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
                            boxSizing: 'border-box',
                            overflowX: 'hidden',
                            transition: 'width 0.3s',
                            marginTop: '64px'
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                    open={drawerOpen}
                >
                    <Divider />
                    <List>
                        {['Projects', 'Monitor', 'Reports', "API's", 'Profile'].map((text) => (
                            <Tooltip title={drawerOpen ? '' : text} placement="right" key={text}>
                                <ListItem
                                    disablePadding
                                    onClick={() => handleSelectedItem(text)}
                                    sx={{
                                        bgcolor: selectedItem === text ? 'rgba(25, 118, 210, 0.12)' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: drawerOpen ? 0 : 2,
                                    }}
                                >
                                    <ListItemButton sx={{ display: 'flex', gap: '5px', justifyContent: drawerOpen ? 'initial' : 'center', px: 2.5 }}>
                                        <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center', color: selectedItem === text ? 'primary.main' : 'inherit' }}>
                                            {iconMapping[text]}
                                        </Box>
                                        {drawerOpen && <ListItemText primary={text} sx={{ marginLeft: '10px' }} />}
                                    </ListItemButton>
                                </ListItem>
                            </Tooltip>
                        ))}
                    </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', padding: '16px', marginTop: '64px' }}>
                    {selectedItem === 'Projects' && <Tabs1 />}
                    {selectedItem === 'Reports' && <ReportsComponent />}
                    {selectedItem === 'Monitor' && "Monitor Component"}
                    {selectedItem === "API's" && (
                        <iframe
                            src="http://localhost:8081/swagger-ui/index.html"
                            title="Swagger UI"
                            style={{ width: '100%', height: '340%' }}
                        />
                    )}
                    {selectedItem === 'Profile' && <Profile />}
                </Box>
            </Box>
        </Box>
    );
}

export default PermanentDrawerComponent;



