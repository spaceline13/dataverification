import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box/Box';

import Header from '../organisms/Header';

const LogoContentsTemplate = ({ children, refreshResults, pagingProps }) => (
    <Box display={'flex'} flexDirection={'column'} height={'auto'} overflow={'hidden'}>
        <Box flex={'0 0 auto'}>
            <Header refreshResults={refreshResults} onLoadMorePages={pagingProps.handleAskForMoreIncidents} currentPage={pagingProps.currentPage} pageItemsCount={pagingProps.pageItemsCount} setCurrentPage={pagingProps.setCurrentPage} />
        </Box>
        <Box flex={'1 1 auto'} overflow={'auto'}>
            {children}
        </Box>
    </Box>
);
LogoContentsTemplate.propTypes = {
    children: PropTypes.array,
    logo: PropTypes.string,
};

export default LogoContentsTemplate;
