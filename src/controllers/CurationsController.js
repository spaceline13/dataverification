import {loadCuration, setLoadingCuration} from "../redux/actions/filterActions";

export const postCreateCuration = (user, dataForSave, cb) => {
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
            if (cb) cb();
        }
    });
};

export const fetchCurationFilters = (selectedCuration, cb) => {
    fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/curation/${selectedCuration._id}`).then(res => res.json()).then(json => {
        if (json.success) {
            if (cb) cb(json);
        }
    });
};

export const fetchUserCurations = (user, cb) => {
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
                if (cb) cb(json);
            }
        });
};
