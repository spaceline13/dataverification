import Grid from "@material-ui/core/Grid";
import Text from "../atoms/Text";
import React from "react";
import {addHazard, addProduct} from "../../redux/actions/mainActions";
import {useDispatch} from "react-redux";
import NiceButton from "../atoms/NiceButton";

const RemoteProductsHazards = ({ incident }) => {
    const dispatch = useDispatch();

    const addHazardFromRemoteHazards = (remoteHazard) => {
        const hazard = {original: remoteHazard.value, foodakai: null};
        dispatch(addHazard(hazard, incident.id));
    };

    const addProductFromRemoteProducts = (remoteProduct) => {
        const product = {original: remoteProduct.value, foodakai: null};
        dispatch(addProduct(product, incident.id));
    };

    return (
        <Grid container>
            <Grid item xs={6}>
                <center>
                    <b>Remote Products</b><br />
                    {incident.remoteProducts.map(product =>
                        <div>
                            <Text inline>{product.value}</Text>
                            <NiceButton
                                borderColor={'#84a3bd'}
                                backgroundColor={'#d9edff'}
                                hoverColor={'#4095c6'}
                                onClick={() => addProductFromRemoteProducts(product)}
                            >
                                <i className="fas fa-plus"></i>
                            </NiceButton>
                        </div>
                    )}
                </center>
            </Grid>
            <Grid item xs={6}>
                <center>
                    <b>Remote Hazards</b><br />
                    {incident.remoteHazards.map(hazard =>
                        <div>
                            <Text inline>{hazard.value}</Text>
                            <NiceButton
                                borderColor={'#bda878'}
                                backgroundColor={'#f5f2ee'}
                                hoverColor={'#c79653'}
                                onClick={() => addHazardFromRemoteHazards(hazard)}
                           >
                                <i className="fas fa-plus"></i>
                            </NiceButton>
                        </div>
                    )}
                </center>
            </Grid>
        </Grid>
    );
};

export default RemoteProductsHazards;
