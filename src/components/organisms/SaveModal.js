import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField } from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';

import Text from '../atoms/Text';
import { setName } from '../../redux/actions/filterActions';
import { getFiltersState } from "../../redux/selectors/filterSelectors";
import {toastr} from "react-redux-toastr";

const SaveModal = ({ show, setShow, user }) => {
    const dispatch = useDispatch();

    const dataForSave = useSelector(getFiltersState);

    const handleClose = () => {
        setShow(false);
    };
    const handleNameChange = event => {
        dispatch(setName(event.target.value));
    };
    const handleSave = () => {
        fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/curation`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: user.email,
                name: dataForSave.name,
                data: dataForSave,
            }),
        }).then(res => res.json()).then(json => {
            if (json.success) {
                setShow(false);
                toastr.success('Saved successfully');
            }
        });
    };

    return (
        <div>
            <Dialog open={show} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{'Save Filters'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Text>Please provide a name for your filters</Text>
                        <TextField onChange={handleNameChange} />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SaveModal;
