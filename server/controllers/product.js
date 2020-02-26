import Product from '../models/product';
import fetch from "node-fetch";

export function addProducts(array, page) {
    const products = array.map(product => new Product({ name: product }));
    return Product.insertMany(products).then(() =>  console.log('products added page: ', page)).catch(error => console.log(error));
}

export function eraseProducts() {
    return Product.remove({}).then(deleted => console.log(deleted)).catch(error => console.log(error));
}

export function getProducts(req, res) {
    return Product.find()
        .select('name')
        .then(allProducts => {
            return res.status(200).json({
                success: true,
                message: 'A list of all products',
                products: allProducts,
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: err.message,
            });
        });
}

export const fetchProductsFromPlatformToMongo = async (page = 0) => {
    const API_KEY = 'db6a04e9-5df3-3f23-8f2a-28b81d1e3aa8';
    const body = {
        apikey: API_KEY,
        pageSize: 100,
        page,
        detail: false,
        entityType: 'product'
    };

    const response = await fetch('http://api.foodakai.com/search-api-1.0/search/', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const json = await response.json();

    const products = json.hits.hits.map(item => item._source.title);
    addProducts(products, page);
    if (products && products.length > 0) {
        const currPage = ++page;
        setTimeout(() => { fetchProductsFromPlatformToMongo(currPage) }, 1000);
    }
};
