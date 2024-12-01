import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import NavTabs from '../NavTabs/NavTabs.jsx';
import Header from '../Header/Header.jsx';

const Layout = () => {
    return (
        <Box>
            <Header />
            <NavTabs />
            <Box sx={{ margin: '1rem' }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout; 