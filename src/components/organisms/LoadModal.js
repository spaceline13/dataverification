import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDispatch } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Text from '../atoms/Text';
import {loadCuration, setLoadingCuration} from '../../redux/actions/filterActions';
import {fetchCurationFilters, fetchUserCurations} from "../../controllers/CurationsController";

const LoadModal = ({ show, setShow, user, refreshResults }) => {
    const dispatch = useDispatch();
    const [curations, setCurations] = useState([]);
    const [selectedCuration, setSelectedCuration] = useState();

    const handleClose = () => {
        setShow(false);
    };

    const handleSelectCuration = event => {
        setSelectedCuration(event.target.value);
    };

    const handleLoad = () => {
        dispatch(setLoadingCuration(true));
        fetchCurationFilters(selectedCuration, json => {
            refreshResults(null, json.curation.data.selectedRemoteProducts, json.curation.data.selectedRemoteHazards, json.curation.data.selectedOriginalSources, json.curation.data.selectedSupplier, json.curation.data.selectedDateRange, json.curation.data.possiblyOk, json.curation.data.oneHazard);
            dispatch(loadCuration(json.curation.data));
            dispatch(setLoadingCuration(false));
            setShow(false);
        });
    };
    useEffect(() => {
        if (user) {
            fetchUserCurations(user, json => {
                setCurations(json.data);
                setShow(false);
            });
        }
    }, [user]);

    return (
        <div>
            <Dialog open={show} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{'Save Curation'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Text>Please select a curation and click Load</Text>
                        <Select onChange={handleSelectCuration} value={selectedCuration}>
                            {curations.map((curation, i) => (
                                <MenuItem key={i} value={curation}>
                                    {curation.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLoad} color="primary" autoFocus>
                        Load
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LoadModal;
