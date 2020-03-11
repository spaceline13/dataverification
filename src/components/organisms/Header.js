import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';

import Paginator from '../molecules/Paginator';
import { PAGE_SIZE } from '../../consts';
import {getIncidents, getIncidentsCount, getIncidentsPagesLoaded} from '../../redux/selectors/mainSelectors';
import Button from "@material-ui/core/Button";
import Text from "../atoms/Text";
import SaveModal from "./SaveModal";
import LoadModal from "./LoadModal";
import {
    getOneHazard,
    getPossiblyOk,
    getSelectedDateRange,
    getSelectedOriginalSources,
    getSelectedRemoteProducts, getSelectedSupplier
} from "../../redux/selectors/filterSelectors";
import {useAuth0} from "../molecules/Auth0Wrapper";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";

const Header = ({ setCurrentPage, refreshResults, pageItemsCount, onLoadMorePages, currentPage, isFooter, logo }) => {
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

    const pagesLoaded = useSelector(getIncidentsPagesLoaded);
    const count = useSelector(getIncidentsCount);
    const totalPages = Math.ceil(count / pageItemsCount);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const selectedRemoteProducts = useSelector(getSelectedRemoteProducts);
    const selectedRemoteHazards = useSelector(getSelectedRemoteProducts);
    const selectedOriginalSources = useSelector(getSelectedOriginalSources);
    const selectedSupplier = useSelector(getSelectedSupplier);
    const selectedDateRange = useSelector(getSelectedDateRange);
    const selectedPossiblyOk = useSelector(getPossiblyOk);
    const selectedOneHazard = useSelector(getOneHazard);

    const handlePageClick = page => {
        setCurrentPage(page.selected);
        let pageToAskDataPlatform = Math.floor((page.selected + 1) / (PAGE_SIZE / pageItemsCount)); // ex. 1 = first 100 incidents. 2 = 100-200 incidents etc.
        if (selectedOneHazard) pageToAskDataPlatform = page.selected;
        // if DataPlatform page has not been loaded, fetch data
        if (!pagesLoaded.includes(pageToAskDataPlatform)) {
            if (onLoadMorePages) {
                onLoadMorePages(pageToAskDataPlatform, selectedRemoteProducts, selectedRemoteHazards, selectedOriginalSources,  selectedSupplier, selectedDateRange, selectedPossiblyOk, selectedOneHazard);
            }
        }
    };

    const handleLoad = () => {
        setShowLoadModal(true);
    };
    const handleSave = () => {
        setShowSaveModal(true);
    };

    return (
        <Paper padding={'10px'} style={isFooter ? { boxShadow: 'none' } : { borderRadius: '0px' }}>
            {logo && <img alt={'logo'} src={logo} style={{ height: '50px', margin: '6px 20px' }} />}

            <Grid container>
                <Grid item xs={3}>
                    {!isFooter && (
                        <div style={{ float: 'left', fontSize: '30px', margin: '10px 0px', fontFamily: 'sans-serif', color: '#337ab7' }}>
                            <i className="fas fa-tools" style={{ margin: '0px 10px', position: 'relative', top: '6px' }}></i>
                            <span style={{ position: 'relative', top: '6px' }}>Data Curation tool</span>
                        </div>
                    )}
                </Grid>
                <Grid item xs={6}>
                    {totalPages > 1 && (
                        <center>
                            <Paginator currentPage={currentPage} handlePageClick={handlePageClick} totalPages={totalPages} />
                        </center>
                    )}
                </Grid>
                <Grid item xs={3}>
                    <div className={'pull-right'} style={{ position: 'relative', top: '20px' }}>
                        <Button variant={'outlined'} style={{ marginRight: '10px' }} onClick={handleLoad}>
                            <Text size={'14px'} color={'#337ab7'}>
                                <i className="far fa-folder-open"></i> Load
                            </Text>
                        </Button>
                        <Button variant={'outlined'} style={{ marginRight: '10px' }} onClick={handleSave}>
                            <Text size={'14px'} color={'#337ab7'}>
                                <i className="far fa-save"></i> Save
                            </Text>
                        </Button>
                        <Box display={'inline-block'} margin={'5px'} style={{ float: 'right' }}>
                            {!isAuthenticated && <Button onClick={() => loginWithRedirect({})}>Log in</Button>}

                            {isAuthenticated && <Button onClick={() => logout({ returnTo: window.location.origin })}>Log out</Button>}
                        </Box>
                    </div>
                </Grid>
            </Grid>
            <SaveModal show={showSaveModal} setShow={setShowSaveModal} user={user} />
            <LoadModal show={showLoadModal} setShow={setShowLoadModal} user={user} refreshResults={refreshResults} />
        </Paper>
    );
};

export default Header;
