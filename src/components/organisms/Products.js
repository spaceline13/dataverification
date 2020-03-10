import Text from "../atoms/Text";
import Box from "@material-ui/core/Box";
import RemoteAutocomplete from "../molecules/RemoteAutocomplete";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {getProducts, getProductsTaxonomy} from "../../redux/selectors/mainSelectors";
import {editProduct, removeProduct} from "../../redux/actions/mainActions";
import styled from "styled-components";

const Product = styled.div`
    border: 1px solid #84a3bd;
    border-radius: 3px;
    padding: 4px;
    background: #d9edff;
    margin-right: 4px;
`;

const Products = ({ incident }) => {
    const dispatch = useDispatch();

    const products = useSelector(getProducts);
    const productsTaxonomy = useSelector(getProductsTaxonomy);

    const handleEditProduct = (incident_id, product, foodakaiMapping) => {
        const selectedIndex = products[incident_id].findIndex(pr => pr.original === product.original);
        if ( selectedIndex !== -1 ) {
            products[incident_id][selectedIndex].foodakai = foodakaiMapping;
            dispatch(editProduct(selectedIndex, products[incident_id][selectedIndex], incident_id));
        } else {
            alert('could not find product in incident');
        }
    };
    const handleRemoveProduct = (incident_id, product) => {
        dispatch(removeProduct(product, incident_id));
    };
    const filterProductsAutocomplete = (inputText) => {
        const inputValue = inputText.trim().toLowerCase();
        const inputLength = inputValue.length;

        var reg = new RegExp(inputValue.split('').join('\\w*').replace(/\W/, ""), 'i');
        const results = inputLength === 0 ? [] : productsTaxonomy.filter(pr =>
            pr.match(reg)
        );

        return ({
            hits: {
                hits: results.reverse().map(res => (
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
        <>
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
                        }}
                           onClick={() => handleRemoveProduct(incident.id, product)}/>
                        <Text inline mr={'2px'} style={{
                            position: 'relative',
                            top: '3px'
                        }}>{product.original}</Text>
                        <Box display={'inline-block'}>
                            <RemoteAutocomplete
                                noWait
                                key={'product' + incident.id + index}
                                variant={'outlined'}
                                onSelect={(value) => handleEditProduct(incident.id, product, value ? value.title : null)}
                                asyncFetchFunction={filterProductsAutocomplete}
                                placeholder={product.foodakai ? product.foodakai : 'Find product'}
                            />
                        </Box>
                    </Product>
                ))}
            </Text>
        </>
    );
};

export default Products;
