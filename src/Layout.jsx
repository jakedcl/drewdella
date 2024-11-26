import NavTabs from "./components/NavTabs/NavTabs.jsx";

const Layout = ({ children }) => {
    return <>
        <NavTabs />
        {children}
    </>;
};

export default Layout; 