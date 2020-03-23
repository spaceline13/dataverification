export const fetchProductsTaxonomy = cb => {
    fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/products`).then(res => res.json()).then(json => {
        if (json.success) {
            if (json.products && json.products.length > 0){
                const products = json.products;
                if (cb) cb(products);
            }
        }
    });
};

export const fetchHazardsTaxonomy = cb => {
    fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/hazards`).then(res => res.json()).then(json => {
        if (json.success) {
            if (json.hazards && json.hazards.length > 0){
                const hazards = json.hazards;
                if (cb) cb(hazards);
            }
        }
    });
};
