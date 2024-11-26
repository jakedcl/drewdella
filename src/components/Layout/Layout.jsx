import { Outlet } from 'react-router-dom';
import NavTabs from '../NavTabs/NavTabs.jsx';
import Header from '../Header/Header.jsx';
import styled from 'styled-components';
const Child = styled.div`
    margin: 1rem;
`;

const Layout = () => {
    return (
        <div>
            <Header />
            <NavTabs />
            <Child>
                <Outlet />
            </Child>
        </div>
    );
};

export default Layout; 