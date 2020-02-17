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
import { loadCuration } from '../../redux/actions/mainActions';

const LoadModal = ({ show, setShow, user }) => {
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
        fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/curation/${selectedCuration._id}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    dispatch(loadCuration(json.curation.data));
                    setShow(false);
                }
            });
    };
    useEffect(() => {
        if (user) {
            fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/user-curations`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: user.email,
                }),
            })
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        setCurations(json.data);
                        setShow(false);
                    }
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
