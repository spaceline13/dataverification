import React from 'react';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import { useAuth0 } from './Auth0Wrapper';

const Header = ({ logo }) => {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    return (
        <Paper padding={'10px'} style={{ borderRadius: '0px' }}>
            {logo && <img alt={'logo'} src={logo} style={{ height: '50px', margin: '6px 20px' }} />}
            <Box display={'inline-block'} margin={'5px'} style={{ float: 'right' }}>
                {!isAuthenticated && <Button onClick={() => loginWithRedirect({})}>Log in</Button>}

                {isAuthenticated && <Button onClick={() => logout({ returnTo: window.location.origin })}>Log out</Button>}
            </Box>
        </Paper>
    );
};
Header.propTypes = {
    logo: PropTypes.string,
};

export default Header;
