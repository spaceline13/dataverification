import React, {useState} from 'react';
import ShowMoreText from 'react-show-more-text';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import { countryList } from '../../data/countries';
import Select from 'react-select';

import Text from '../atoms/Text';
import {
    getCountries,
    getDescriptions,
    getHazards,
    getProducts,
    getSuppliers,
    getTitles
} from '../../redux/selectors/mainSelectors';
import {
    setApproved,editCountry
} from '../../redux/actions/mainActions';
import moment from "moment";
import {MenuProvider} from "react-contexify";
import Hazards from "./Hazards";
import Products from "./Products";
import RemoteProductsHazards from "./RemoteProductsHazards";
import KeyboardEventHandler from 'react-keyboard-event-handler';

const Date = styled.div`
    position: absolute;
    transform: rotate(90deg);
    transform-origin: left top 0;
    right: -48px;
    margin-top: 22px;
    font-size: 12px;
`;
const User = styled.div`
    position: absolute;
    -webkit-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
    transform: rotate(-90deg);
    -webkit-transform-origin: left top 0;
    -ms-transform-origin: left top 0;
    transform-origin: left top 0;
    margin-top: 113px;
    font-size: 12px;
    color: #2d7542;
`;

const IncidentsTable = ({ currentPageItems, user, onSaveIncident }) => {
    const dispatch = useDispatch();
    const products = useSelector(getProducts);
    const hazards = useSelector(getHazards);
    const titles = useSelector(getTitles);
    const descriptions = useSelector(getDescriptions);
    const countries = useSelector(getCountries);
    const suppliers = useSelector(getSuppliers);

    const [selectedIncident, setSelectedIncident] = useState();

    const handleEditCountry = (incident_id, country) => {
        dispatch(editCountry(country ? country.value : [], incident_id));
    };

    const handleApprove = incident_id => {
        onSaveIncident({
            id: incident_id,
            user: user.email,
            title: titles[incident_id],
            description: descriptions[incident_id],
            products: products[incident_id],
            hazards: hazards[incident_id],
            supplier: suppliers[incident_id],
            country: countries[incident_id],
        }, 'add', () => {
            dispatch(setApproved(incident_id, user.email));
            setSelectedIncident(null);
        });
    };
    const handleDissapprove = incident_id => {
        onSaveIncident({
            id: incident_id,
        }, 'remove', () => {
            dispatch(setApproved(incident_id, null));
        });
    };

    /*const searchAnnotations = (item, vocabulary, cb) => {
        fetchAnnotationTermsWithCallback(item, vocabulary, res => {
            cb(res);
        });
    };*/


    if (currentPageItems.length > 0) {
        return (
            <div>
                <KeyboardEventHandler
                    handleKeys={['alt+space']}
                    onKeyEvent={() => {
                        if (selectedIncident) {
                            const checked =
                                hazards[selectedIncident.id] &&
                                hazards[selectedIncident.id].length > 0 &&
                                !hazards[selectedIncident.id].find(hz => !hz.foodakai) &&
                                products[selectedIncident.id] &&
                                products[selectedIncident.id].length > 0 &&
                                !products[selectedIncident.id].find(pr => !pr.foodakai) &&
                                countries[selectedIncident.id].length > 0;
                            if (checked) handleApprove(selectedIncident.id);
                        }
                    }}
                />
                <table className="table table-hover-dark table-striped" style={{color: '#636971'}}>
                    <thead>
                    <tr>
                        <th></th>
                        <th width={'200px'}>Title</th>
                        <th width={'800px'}>Description</th>
                        <th>Curation Fields</th>
                        <th width={'20px'}>
                            <i className="fas fa-check"></i>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentPageItems.map((incident, indexI) => {
                        const checked =
                            hazards[incident.id] &&
                            hazards[incident.id].length > 0 &&
                            !hazards[incident.id].find(hz => !hz.foodakai) &&
                            products[incident.id] &&
                            products[incident.id].length > 0 &&
                            !products[incident.id].find(pr => !pr.foodakai) &&
                            countries[incident.id].length > 0;
                        const trStyling = selectedIncident===incident ? {
                            padding: '20px 0px',
                            background: 'rgba(183, 181, 187, 0.21)'
                        } : incident.approvedFrom ? {
                            padding: '20px 0px',
                            background: 'rgba(113,195,80,0.2)'
                        } : {padding: '20px 0px'};
                        return (
                            <tr key={indexI} style={trStyling} onClick={()=>{setSelectedIncident(incident)}}>
                                <td style={{ paddingRight: '0px' }}>
                                    {incident.approvedFrom && <User>{incident.approvedFrom.substring(0, incident.approvedFrom.indexOf('@'))}</User>}
                                    <a href={`http://data.foodakai.com/node/${incident.internalId}`} target={'_blank'} rel={'noopener noreferrer'}>
                                        <i className="fas fa-external-link-alt" />
                                    </a>
                                </td>
                                <td data-id={incident.id} data-field={'title'}>
                                    <MenuProvider id="menu_id" style={{ display: 'inline-block' }}>
                                        <Text>{titles[incident.id]}</Text>
                                    </MenuProvider>
                                </td>
                                <td data-id={incident.id} data-field={'description'}>
                                    <Text>
                                        {descriptions[incident.id] ? (
                                            <MenuProvider id="menu_id" style={{ display: 'inline-block' }}>
                                                <ShowMoreText
                                                    key={`showmore-${incident.id}`}
                                                    lines={15}
                                                    more="Show more"
                                                    less="Show less"
                                                    anchorClass=""
                                                    expanded={false}
                                                    width={'770'}
                                                >
                                                    {descriptions[incident.id]}
                                                </ShowMoreText>
                                            </MenuProvider>
                                        ) : (
                                            <RemoteProductsHazards incident={incident} />
                                        )}
                                    </Text>
                                </td>
                                <td>
                                    <Grid container>
                                        <Grid item xs={8}>
                                            <Products incident={incident} />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <div>
                                                <Text>
                                                    <b>Countries:</b>
                                                </Text>
                                                <Select
                                                    className="select-country"
                                                    classNamePrefix="select"
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    defaultValue={(countries[incident.id] && Array.isArray(countries[incident.id]) && countries[incident.id].length > 0) ? {
                                                        value: countries[incident.id][0],
                                                        label: countries[incident.id][0]
                                                    } : null}
                                                    onChange={(country) => {
                                                        handleEditCountry(incident.id, country)
                                                    }}
                                                    name={"country" + incident.id}
                                                    key={"country" + incident.id}
                                                    id={"country" + incident.id}
                                                    options={countryList}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Hazards incident={incident} />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Text>
                                                <b>Suppliers:</b>
                                            </Text>
                                            {suppliers[incident.id] && suppliers[incident.id].map((s, index) =>
                                                <span>{s.title}</span>)}
                                        </Grid>
                                    </Grid>
                                </td>
                                <td>
                                    <Date>
                                        {moment(incident.date).format('DD-MM-YYYY')}
                                    </Date>
                                    {checked && (
                                        <div>
                                            {incident.approvedFrom ? (
                                                <i className="fas fa-times-circle"
                                                   style={{color: '#960d2e', cursor: 'pointer'}}
                                                   onClick={() => handleDissapprove(incident.id)}/>
                                            ) : (
                                                <i className="fas fa-check-circle"
                                                   style={{color: '#2d7543', cursor: 'pointer'}}
                                                   onClick={() => handleApprove(incident.id)}/>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    } else {
        return (
            <Text size={'24px'}>There are no data available for your filters</Text>
        );
    }
};

export default IncidentsTable;
