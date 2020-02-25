import React from 'react';
import ShowMoreText from 'react-show-more-text';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';

import Text from '../atoms/Text';
import { getCountries, getDescriptions, getHazards, getProducts, getSuppliers, getTitles } from '../../redux/selectors/mainSelectors';
import RemoteSelect from '../molecules/RemoteSelect';
import { removeHazards, removeProducts, setApproved, setHazards, setProducts } from '../../redux/actions/mainActions';
import { fetchAnnotationTermsWithCallback } from '../../controllers/AnnotationController';
import moment from "moment";

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

    const handleEditProduct = (incident_id, product, foodakaiMapping) => {
        const selectedProduct = products[incident_id].find(pr => pr.original === product.original);
        selectedProduct.foodakai = foodakaiMapping;
        dispatch(setProducts(products[incident_id], incident_id));
    };
    const handleEditHazard = (incident_id, hazard, foodakaiMapping) => {
        const selectedHazard = hazards[incident_id].find(hz => hz.original === hazard.original);
        selectedHazard.foodakai = foodakaiMapping;
        dispatch(setHazards(hazards[incident_id], incident_id));
    };
    const handleRemoveProduct = (incident_id, product) => {
        dispatch(removeProducts(product, incident_id));
    };
    const handleRemoveHazard = (incident_id, hazard) => {
        dispatch(removeHazards(hazard, incident_id));
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
                                                                <Text inline>{product.original}</Text>
                                                                {' : '}
                                                                <RemoteSelect
                                                                    item={product}
                                                                    onChange={(item, value) => handleEditProduct(incident.id, item, value)}
                                                                    searchForAnnotations={(item, cb) => searchAnnotations(item, 'products', cb)}
                                                                />
                                                                <i className="fas fa-times" style={{ cursor: 'pointer' }} onClick={() => handleRemoveProduct(incident.id, product)} />
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
                                                    countries[incident.id].map((c, index) => (
                                                        <span>
                                                            {c.country}
                                                            {c.value}
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
                                                                <Text inline>{hazard.original}</Text>
                                                                {' : '}
                                                                <RemoteSelect
                                                                    item={hazard}
                                                                    onChange={(item, value) => handleEditHazard(incident.id, item, value)}
                                                                    searchForAnnotations={(item, cb) => searchAnnotations(item, 'hazards', cb)}
                                                                />
                                                                <i className="fas fa-times" style={{ cursor: 'pointer' }} onClick={() => handleRemoveHazard(incident.id, hazard)} />
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
