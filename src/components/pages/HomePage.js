import React, { useEffect, useState } from 'react';
import { Loader } from 'react-loaders';
// for loader
import '../../../node_modules/loaders.css/loaders.css';
import '../../styles/react-paginate.css';
import '../../styles/main.css';

// for toaster
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'

import { useDispatch, useSelector } from 'react-redux';
import { MenuProvider } from 'react-contexify';

import {
    addIncidentToMongo, checkIncidentsInMongo,
    fetchIncidentsIncludingUnpublished,
    removeIncidentFromMongo
} from '../../controllers/IncidentsController';
import IncidentsTable from '../organisms/IncidentsTable';
import {
    addIncidents,
    addIncidentsPagesLoaded, setFetchingIncidents, setHazardsTaxonomy,
    setIncidents,
    setIncidentsCount,
    setProductsTaxonomy
} from '../../redux/actions/mainActions';
import RightClickMenu from '../organisms/RightClickMenu';
import { useAuth0 } from '../molecules/Auth0Wrapper';
import withCheckCommunity from '../molecules/withCheckCommunity';
import { PAGE_SIZE } from '../../consts';
import { getFetchingIncidents, getIncidents } from '../../redux/selectors/mainSelectors';
import Header from '../organisms/Header';
import {setOriginalSources, setRemoteProducts} from '../../redux/actions/filterActions';
import Filters from '../organisms/Filters';
import LogoContentsTemplate from '../templates/LogoContentsTemplate';
import {fetchHazardsTaxonomy, fetchProductsTaxonomy} from "../../controllers/TaxonomiesController";


let initialized = false;

const HomePage = () => {
    const dispatch = useDispatch();
    const { user } = useAuth0();
    const fetchingIncidents = useSelector(getFetchingIncidents);
    const [currentPage, setCurrentPage] = useState(0);
    const incidents = useSelector(getIncidents);

    const pageItemsCount = 8;
    const [currentPageItems, setCurrentPageItems] = useState([]);

    const fetchFiltered = (comingFrom, product, source, supplier, dateRange, possiblyOk) => {
        dispatch(setFetchingIncidents(true));
        fetchIncidentsIncludingUnpublished({ product, source, comingFrom, supplier, dateRange, possiblyOk }, PAGE_SIZE, 0, true, null, null, ({ res, count, filters }) => {
            checkIncidentsInMongo(res.map(incident => incident.dataId), (previouslySavedIncidents) => {
                // add incidents from data platform and check from previously saved mongo incidents
                dispatch(setIncidents(res, previouslySavedIncidents.incidents));
                dispatch(setIncidentsCount(count));
                dispatch(addIncidentsPagesLoaded(0));
                if (filters.remoteProducts) dispatch(setRemoteProducts(filters.remoteProducts));
                if (filters.originalSources) dispatch(setOriginalSources(filters.originalSources));
                dispatch(setFetchingIncidents(false));
            });
        });
    };

    useEffect(() => {
        // set items to display for current page (slice of the initial array)
        setCurrentPageItems(incidents.slice(currentPage * pageItemsCount, currentPage * pageItemsCount + pageItemsCount));
    }, [incidents, currentPage]);

    const handleAskForMoreIncidents = (page, product, source, supplier, dateRange, possiblyOk) => {
        fetchIncidentsIncludingUnpublished({ product, source, supplier, dateRange, possiblyOk }, PAGE_SIZE, page, true, null, null, ({ res }) => {
            dispatch(addIncidents(res));
            dispatch(addIncidentsPagesLoaded(page));
        });
    };

    const handleSaveIncident = ({ id, user, title, description, products, hazards, country, supplier }, action, cb) => {
        if (action === 'add') {
            addIncidentToMongo({ id, user, title, description, products, hazards, country, supplier }, cb);
        } else if (action === 'remove') {
            removeIncidentFromMongo(id, cb);
        }
    };

    if (!initialized) {
        fetchProductsTaxonomy((products) => {
            dispatch(setProductsTaxonomy(products));
        });
        fetchHazardsTaxonomy((hazards) => {
           dispatch(setHazardsTaxonomy(hazards));
        });

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
                                    <Filters refreshDropdowns={fetchFiltered} setCurrentPage={setCurrentPage} />
                                    <IncidentsTable currentPageItems={currentPageItems} user={user} onSaveIncident={handleSaveIncident} />
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
