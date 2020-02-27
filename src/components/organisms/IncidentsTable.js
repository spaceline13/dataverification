import React from 'react';
import ShowMoreText from 'react-show-more-text';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import countries from '../../data/countries';

import Text from '../atoms/Text';
import {
    getCountries,
    getDescriptions,
    getHazards, getHazardsTaxonomy,
    getProducts,
    getProductsTaxonomy,
    getSuppliers,
    getTitles
} from '../../redux/selectors/mainSelectors';
import {
    removeHazard,
    removeProduct,
    setApproved,
    editProduct, editHazard
} from '../../redux/actions/mainActions';
import { fetchAnnotationTermsWithCallback } from '../../controllers/AnnotationController';
import moment from "moment";
import RemoteAutocomplete from "../molecules/RemoteAutocomplete";
import Box from "@material-ui/core/Box";

const Product = styled.div`
    border: 1px solid #84a3bd;
    border-radius: 3px;
    padding: 4px;
    background: #ecf6ff;
    margin-right: 4px;
`;
const Hazard = styled.div`
    border: 1px solid #bda878;
    border-radius: 3px;
    padding: 4px;
    background: #f5f2ee;
    margin-right: 4px;
`;
const Date = styled.div`
    position: absolute;
    transform: rotate(90deg);
    transform-origin: left top 0;
    right: -44px;
    margin-top: 22px;
    font-size: 12px;
`;

const IncidentsTable = ({ currentPageItems, user, onSaveIncident }) => {
    const dispatch = useDispatch();
    const products = useSelector(getProducts);
    const hazards = useSelector(getHazards);
    const titles = useSelector(getTitles);
    const descriptions = useSelector(getDescriptions);
    const countries = useSelector(getCountries);
    const suppliers = useSelector(getSuppliers);
    const productsTaxonomy = useSelector(getProductsTaxonomy);
    const hazardsTaxonomy = useSelector(getHazardsTaxonomy);

    const handleEditProduct = (incident_id, product, foodakaiMapping) => {
        const selectedIndex = products[incident_id].findIndex(pr => pr.original === product.original);
        if ( selectedIndex !== -1 ) {
            products[incident_id][selectedIndex].foodakai = foodakaiMapping;
            dispatch(editProduct(selectedIndex, products[incident_id][selectedIndex], incident_id));
        } else {
            alert('could not find product in incident');
        }
    };
    const handleEditHazard = (incident_id, hazard, foodakaiMapping) => {
        const selectedIndex = hazards[incident_id].findIndex(hz => hz.original === hazard.original);
        if ( selectedIndex !== -1 ) {
            hazards[incident_id][selectedIndex].foodakai = foodakaiMapping;
            dispatch(editHazard(selectedIndex, hazards[incident_id][selectedIndex], incident_id));
        } else {
            alert('could not find hazard in incident');
        }
    };
    const handleRemoveProduct = (incident_id, product) => {
        dispatch(removeProduct(product, incident_id));
    };
    const handleRemoveHazard = (incident_id, hazard) => {
        dispatch(removeHazard(hazard, incident_id));
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
        });
    };
    const handleDissapprove = incident_id => {
        onSaveIncident({
            id: incident_id,
        }, 'remove', () => {
            dispatch(setApproved(incident_id, null));
        });
    };

    const searchAnnotations = (item, vocabulary, cb) => {
        fetchAnnotationTermsWithCallback(item, vocabulary, res => {
            cb(res);
        });
    };
    const filterProductsAutocomplete = (inputText) => {
        const inputValue = inputText.trim().toLowerCase();
        const inputLength = inputValue.length;
        const results = inputLength === 0 ? [] : productsTaxonomy.filter(pr =>
            pr.toLowerCase().slice(0, inputLength) === inputValue
        );
        return ({
            hits: {
                hits: results.map(res => (
                    {
                        ['_source']: {
                            title: res
                        }
                    }
                ))
            }
        });
    };
    const filterHazardsAutocomplete = (inputText) => {
        const inputValue = inputText.trim().toLowerCase();
        const inputLength = inputValue.length;
        const results = inputLength === 0 ? [] : hazardsTaxonomy.filter(pr =>
            pr.toLowerCase().slice(0, inputLength) === inputValue
        );
        return ({
            hits: {
                hits: results.map(res => (
                    {
                        ['_source']: {
                            title: res
                        }
                    }
                ))
            }
        });
    };

    return (
        <div>
            <table className="table table-hover-dark table-striped" style={{ color: '#636971' }}>
                <thead>
                    <tr>
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
                            !products[incident.id].find(pr => !pr.foodakai);
                        const trStyling = incident.approvedFrom ? { padding: '20px 0px', background: 'rgba(113,195,80,0.2)' } : { padding: '20px 0px' };
                        return (
                            <tr key={indexI} style={trStyling}>
                                <td data-id={incident.id} data-field={'title'}>
                                    <Text>{titles[incident.id]}</Text>
                                </td>
                                <td data-id={incident.id} data-field={'description'}>
                                    <Text>
                                        {descriptions[incident.id] && (
                                            <ShowMoreText lines={5} more="Show more" less="Show less" anchorClass="" expanded={false} width={'770'}>
                                                {descriptions[incident.id]}
                                            </ShowMoreText>
                                        )}
                                    </Text>
                                </td>
                                <td>
                                    <Grid container>
                                        <Grid item xs={8}>
                                            <div data-id={incident.id}>
                                                <Text>
                                                    <b>Products:</b>
                                                </Text>
                                                <Text>
                                                    {products[incident.id] &&
                                                        products[incident.id].map((product, index) => (
                                                            <Product key={index}>
                                                                <i className="fas fa-times" style={{
                                                                    cursor: 'pointer',
                                                                    position: 'relative',
                                                                    top: '-3px',
                                                                    right: '-3px',
                                                                    float: 'right',
                                                                    background: '#f9f9f9',
                                                                    padding: '1px 3px'
                                                                }} onClick={() => handleRemoveProduct(incident.id, product)} />
                                                                <Text inline mr={'2px'} style={{ position: 'relative', top: '3px' }}>{product.original}</Text>
                                                                <Box display={'inline-block'}>
                                                                    <RemoteAutocomplete
                                                                        variant={'outlined'}
                                                                        onSelect={(value) => handleEditProduct(incident.id, product, value.title)}
                                                                        asyncFetchFunction={filterProductsAutocomplete}
                                                                        placeholder={product.foodakai ? product.foodakai : 'Find product'}
                                                                    />
                                                                </Box>
                                                            </Product>
                                                        ))}
                                                </Text>
                                            </div>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <div>
                                                <Text>
                                                    <b>Countries:</b>
                                                </Text>
                                                {countries[incident.id] &&
                                                    countries[incident.id].map((country) => (
                                                        <span>
                                                            {country}
                                                        </span>
                                                    ))}
                                            </div>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <div data-id={incident.id}>
                                                <Text>
                                                    <b>Hazards:</b>
                                                </Text>
                                                <Text>
                                                    {hazards[incident.id] &&
                                                        hazards[incident.id].map((hazard, index) => (
                                                            <Hazard key={index}>
                                                                <i className="fas fa-times" style={{
                                                                    cursor: 'pointer',
                                                                    position: 'relative',
                                                                    top: '-3px',
                                                                    right: '-3px',
                                                                    float: 'right',
                                                                    background: '#f9f9f9',
                                                                    padding: '1px 3px'
                                                                }} onClick={() => handleRemoveHazard(incident.id, hazard)} />
                                                                <Text inline>{hazard.original}</Text>
                                                                <Box display={'inline-block'}>
                                                                    <RemoteAutocomplete
                                                                        variant={'outlined'}
                                                                        onSelect={(value) => handleEditHazard(incident.id, hazard, value.title)}
                                                                        asyncFetchFunction={filterHazardsAutocomplete}
                                                                        placeholder={hazard.foodakai ? hazard.foodakai : 'Find hazard'}
                                                                    />
                                                                </Box>
                                                            </Hazard>
                                                        ))}
                                                </Text>
                                            </div>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Text>
                                                <b>Suppliers:</b>
                                            </Text>
                                            {suppliers[incident.id] && suppliers[incident.id].map((s, index) => <span>{s.title}</span>)}
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
                                                <i className="fas fa-times-circle" style={{ color: '#960d2e', cursor: 'pointer' }} onClick={() => handleDissapprove(incident.id)} />
                                            ) : (
                                                <i className="fas fa-check-circle" style={{ color: '#2d7543', cursor: 'pointer' }} onClick={() => handleApprove(incident.id)} />
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
};

export default IncidentsTable;
