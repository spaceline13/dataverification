import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';

import Paginator from '../molecules/Paginator';
import { PAGE_SIZE } from '../../consts';
import { getIncidentsCount, getIncidentsPagesLoaded } from '../../redux/selectors/mainSelectors';
import Button from "@material-ui/core/Button";
import Text from "../atoms/Text";
import SaveModal from "./SaveModal";
import LoadModal from "./LoadModal";
import {
    getRemoteProducts,
    getSelectedOriginalSources,
    getSelectedRemoteProducts
} from "../../redux/selectors/filterSelectors";

const Header = ({ setCurrentPage, pageItemsCount, onLoadMorePages, currentPage, isFooter, user }) => {
    const pagesLoaded = useSelector(getIncidentsPagesLoaded);
    const count = useSelector(getIncidentsCount);
    const totalPages = Math.ceil(count / pageItemsCount);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const selectedRemoteProducts = useSelector(getSelectedRemoteProducts);
    const selectedOriginalSources = useSelector(getSelectedOriginalSources);

    const handlePageClick = page => {
        setCurrentPage(page.selected);
        const pageToAskDataPlatform = Math.floor((page.selected + 1) / (PAGE_SIZE / pageItemsCount)); // ex. 1 = first 100 incidents. 2 = 100-200 incidents etc.
        // if DataPlatform page has not been loaded, fetch data
        if (!pagesLoaded.includes(pageToAskDataPlatform)) {
            if (onLoadMorePages) {
                onLoadMorePages(pageToAskDataPlatform, selectedRemoteProducts, selectedOriginalSources);
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
        <>
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
                    </div>
                </Grid>
            </Grid>
            <SaveModal show={showSaveModal} setShow={setShowSaveModal} user={user} />
            <LoadModal show={showLoadModal} setShow={setShowLoadModal} user={user} />
        </>
    );
};

export default Header;
