import React, { useState } from 'react';
import { Loader } from 'react-loaders';
// for loader
import '../../../node_modules/loaders.css/loaders.css';
import '../../styles/react-paginate.css';
import '../../styles/main.css';

import {useDispatch, useSelector} from 'react-redux';
import { MenuProvider } from 'react-contexify';

import { fetchIncidentsIncludingUnpublished } from '../../controllers/IncidentsController';
import IncidentsTable from '../organisms/IncidentsTable';
import {
    addIncidents,
    addIncidentsPagesLoaded,
    setFetchingIncidents,
    setIncidents,
    setIncidentsCount
} from '../../redux/actions/mainActions';
import RightClickMenu from '../organisms/RightClickMenu';
import { useAuth0 } from '../molecules/Auth0Wrapper';
import withCheckCommunity from '../molecules/withCheckCommunity';
import 'react-virtualized/styles.css';
import { PAGE_SIZE } from '../../consts';
import logo from '../../static/images/logo.png';
import { getFetchingIncidents } from '../../redux/selectors/mainSelectors';

let initialized = false;

const HomePage = () => {
    const dispatch = useDispatch();
    const { user } = useAuth0();
    const fetchingIncidents = useSelector(getFetchingIncidents);

    const handleAskForMoreIncidents = page => {
        fetchIncidentsIncludingUnpublished('', PAGE_SIZE, page, true, null, null, ({ res }) => {
            dispatch(addIncidents(res));
            dispatch(addIncidentsPagesLoaded(page));
        });
    };

    if (!initialized) {
        fetchIncidentsIncludingUnpublished('', PAGE_SIZE, 0, true, null, null, ({ res, count }) => {
            dispatch(setIncidents(res));
            dispatch(setIncidentsCount(count));
            dispatch(addIncidentsPagesLoaded(0));
            dispatch(setFetchingIncidents(false));
        });
        initialized = true;
    }
    if (initialized) {
        return (
            <div className="App">
                {fetchingIncidents ? (
                    <center>
                        <Loader type={'line-scale'} active color={'#003571'} />
                    </center>
                ) : (
                    <>
                        {user ? (
                            <>
                                <MenuProvider id="menu_id" style={{ display: 'inline-block' }}>
                                    <div style={{ float: 'left', fontSize: '30px', margin: '10px 0px', fontFamily: 'sans-serif', color: '#337ab7' }}>
                                        <img src={logo} style={{ width: '80px' }} />
                                        <span style={{ position: 'relative', top: '6px' }}>Data Curation tool</span>
                                    </div>
                                    <IncidentsTable color={'#589345'} onLoadMorePages={handleAskForMoreIncidents} />
                                </MenuProvider>
                                <RightClickMenu />
                            </>
                        ) : (
                            <center> Please Log In to use the app </center>
                        )}
                    </>
                )}
            </div>
        );
    } else {
        return <span />;
    }
};

export default withCheckCommunity(HomePage);
