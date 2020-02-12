import React from 'react';
import { AnimatedSwitch } from 'react-router-transition';
import styled from 'styled-components';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Auth0Provider } from './components/molecules/Auth0Wrapper';
import PrivateRoute from './components/molecules/PrivateRoute';
import { ROUTE_HOME, ROUTE_LOGIN } from './ROUTES';
import { bounceTransition, mapStyles } from './styles/pageAnimationConfig';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import configureStore from './redux/config';
require('dotenv').config();

// Init Redux Store
const store = configureStore();

// page animations wraper
const Animation = styled(AnimatedSwitch)`
    position: relative;
    height: 100%;
    & > div {
        position: absolute;
        height: 100%;
        width: 100%;
    }
`;

// A function that routes the user to the right place after login
const onRedirectCallback = appState => {
    window.history.replaceState({}, document.title, appState && appState.targetUrl ? appState.targetUrl : window.location.pathname);
};

function App() {
    return (
        <Provider store={store}>
            <Auth0Provider
                domain={process.env.REACT_APP_AUTH0_DOMAIN}
                client_id={process.env.REACT_APP_AUTH0_ID}
                redirect_uri={`${window.location.origin}${ROUTE_HOME}`}
                onRedirectCallback={onRedirectCallback}>
                <SnackbarProvider maxSnack={2}>
                    <Router>
                        <Animation atEnter={bounceTransition.atEnter} atLeave={bounceTransition.atLeave} atActive={bounceTransition.atActive} mapStyles={mapStyles} className="route-wrapper">
                            <Route exact path={ROUTE_LOGIN} component={LoginPage} />
                            <PrivateRoute exact path={ROUTE_HOME} component={HomePage} />
                        </Animation>
                    </Router>
                </SnackbarProvider>
            </Auth0Provider>
        </Provider>
    );
}

export default App;
