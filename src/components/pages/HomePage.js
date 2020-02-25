import React, { useEffect, useState } from 'react';
import { Loader } from 'react-loaders';
// for loader
import '../../../node_modules/loaders.css/loaders.css';
import '../../styles/react-paginate.css';
import '../../styles/main.css';

import {toastr} from 'react-redux-toastr'
// for toaster
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'

import { useDispatch, useSelector } from 'react-redux';
import { MenuProvider } from 'react-contexify';

import { fetchIncidentsIncludingUnpublished } from '../../controllers/IncidentsController';
import IncidentsTable from '../organisms/IncidentsTable';
import { addIncidents, addIncidentsPagesLoaded, setFetchingIncidents, setIncidents, setIncidentsCount } from '../../redux/actions/mainActions';
import RightClickMenu from '../organisms/RightClickMenu';
import { useAuth0 } from '../molecules/Auth0Wrapper';
import withCheckCommunity from '../molecules/withCheckCommunity';
import { PAGE_SIZE } from '../../consts';
import { getFetchingIncidents, getIncidents } from '../../redux/selectors/mainSelectors';
import Header from '../organisms/Header';
import { setOriginalSources, setRemoteProducts } from '../../redux/actions/filterActions';
import Filters from '../organisms/Filters';
import LogoContentsTemplate from '../templates/LogoContentsTemplate';

let initialized = false;

const HomePage = () => {
    const dispatch = useDispatch();
    const { user } = useAuth0();
    const fetchingIncidents = useSelector(getFetchingIncidents);
    const [currentPage, setCurrentPage] = useState(0);
    const incidents = useSelector(getIncidents);

    const pageItemsCount = 8;
    const [currentPageItems, setCurrentPageItems] = useState([]);

    const fetchFiltered = (comingFrom, product, source, supplier, dateRange) => {
        dispatch(setFetchingIncidents(true));
        fetchIncidentsIncludingUnpublished({ product, source, comingFrom, supplier, dateRange }, PAGE_SIZE, 0, true, null, null, ({ res, count, filters }) => {
            dispatch(setIncidents(res));
            dispatch(setIncidentsCount(count));
            dispatch(addIncidentsPagesLoaded(0));
            dispatch(setFetchingIncidents(false));
            if (filters.remoteProducts) dispatch(setRemoteProducts(filters.remoteProducts));
            if (filters.originalSources) dispatch(setOriginalSources(filters.originalSources));
        });
    };

    useEffect(() => {
        // set items to display for current page (slice of the initial array)
        setCurrentPageItems(incidents.slice(currentPage * pageItemsCount, currentPage * pageItemsCount + pageItemsCount));
    }, [incidents, currentPage]);

    const handleAskForMoreIncidents = (page, product, source) => {
        fetchIncidentsIncludingUnpublished({ product, source }, PAGE_SIZE, page, true, null, null, ({ res }) => {
            dispatch(addIncidents(res));
            dispatch(addIncidentsPagesLoaded(page));
        });
    };

    const handleSaveIncident = ({ id, user, title, description, products, hazards, country, supplier }, action, cb) => {
        if (action === 'add') {
            //add
            fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/incident`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, user, title, description, products, hazards, country, supplier }),
            }).then(res => res.json()).then(json => {
                if (json.success) {
                    toastr.success('Saved successfully');
                    if (cb) cb();
                } else {
                    toastr.error('Error', json.error);
                }
            });
        } else if (action === 'remove') {
            //remove
            fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/incident/${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.ok) {
                    toastr.success('Removed successfully');
                    if (cb) cb();
                } else {
                    res.json().then(json => {
                        toastr.error('Error', json.error);
                    });
                }
            });
        }
    };

    if (!initialized) {
        fetchFiltered();
        initialized = true;
    }
    if (initialized) {
        return (
            <LogoContentsTemplate pagingProps={{ handleAskForMoreIncidents, currentPage, pageItemsCount, setCurrentPage }} refreshResults={fetchFiltered}>
                <div className="App">
                    {fetchingIncidents ? (
                        <center>
                            <Loader type={'line-scale'} active color={'#003571'} />
                        </center>
                    ) : (
                        <>
                            {user ? (
                                <>
                                    <Filters refreshDropdowns={fetchFiltered} />
                                    <MenuProvider id="menu_id" style={{ display: 'inline-block' }}>
                                        <IncidentsTable currentPageItems={currentPageItems} user={user} onSaveIncident={handleSaveIncident} />
                                    </MenuProvider>
                                    <RightClickMenu />
                                    <Header isFooter refreshResults={fetchFiltered} onLoadMorePages={handleAskForMoreIncidents} currentPage={currentPage} pageItemsCount={pageItemsCount} setCurrentPage={setCurrentPage} />
                                </>
                            ) : (
                                <center> Please Log In to use the app </center>
                            )}
                        </>
                    )}
                </div>
            </LogoContentsTemplate>
        );
    } else {
        return <span />;
    }
};

export default withCheckCommunity(HomePage);
