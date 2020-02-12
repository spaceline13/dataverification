import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React from 'react';

import { ROUTE_LOGIN } from '../../ROUTES';
import { getCommunity } from '../../redux/selectors/mainSelectors';

const withCheckCommunity = Component => {
    const HOC = props => {
        const community = useSelector(getCommunity);
        if (community) {
            return <Component {...props} />;
        } else {
            return <Redirect to={ROUTE_LOGIN} />;
        }
    };

    return HOC;
};

export default withCheckCommunity;
