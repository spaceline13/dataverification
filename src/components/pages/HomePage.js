import React, {useEffect, useState} from 'react';
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
import { PAGE_SIZE } from '../../consts';
import {getFetchingIncidents, getIncidents} from '../../redux/selectors/mainSelectors';
import Header from "../organisms/Header";
import {getSelectedRemoteProducts} from "../../redux/selectors/filterSelectors";
import {setOriginalSources, setRemoteProducts} from "../../redux/actions/filterActions";
import Filters from "../organisms/Filters";

let initialized = false;

const HomePage = () => {
    const dispatch = useDispatch();
    const { user } = useAuth0();
    const fetchingIncidents = useSelector(getFetchingIncidents);
    const [currentPage, setCurrentPage] = useState(0);
    const incidents = useSelector(getIncidents);

    const pageItemsCount = 8;
    const [currentPageItems, setCurrentPageItems] = useState([]);

    const fetchFiltered = (comingFrom, product, source) => {
        dispatch(setFetchingIncidents(true));
        fetchIncidentsIncludingUnpublished({ product, source, comingFrom }, PAGE_SIZE, 0, true, null, null, ({ res, count, filters }) => {
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

    if (!initialized) {
        fetchFiltered();
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
                                <Header onLoadMorePages={handleAskForMoreIncidents} currentPage={currentPage} pageItemsCount={pageItemsCount} setCurrentPage={setCurrentPage} user={user} />
                                <Filters refreshDropdowns={fetchFiltered} />
                                <MenuProvider id="menu_id" style={{ display: 'inline-block' }}>
                                    <IncidentsTable currentPageItems={currentPageItems} />
                                </MenuProvider>
                                <RightClickMenu />
                                <Header isFooter onLoadMorePages={handleAskForMoreIncidents} currentPage={currentPage} pageItemsCount={pageItemsCount} setCurrentPage={setCurrentPage} />
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
