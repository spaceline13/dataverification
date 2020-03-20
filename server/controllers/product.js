import Product from '../models/product';
import fetch from "node-fetch";

export function addProducts(array, page) {
    const products = array.map(product => new Product(product));
    return Product.insertMany(products).then(() =>  {/*console.log('products added page: ', page)*/}).catch(error => console.log(error));
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
    const response = await fetch('http://148.251.22.254:8080/nlp-api-1.0/export/term/json?vocabulary=fdk_products', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const json = await response.json();

    const products = json.map(item => ({ name: item.label, parents: item.parent, synonyms: item.synonym }));
    addProducts(products, page);
    if (products && products.length > 0) {
        const currPage = ++page;
        setTimeout(() => { fetchProductsFromPlatformToMongo(currPage) }, 1000);
    } else {
        console.log('added ', page, ' pages of ', pageSize, ' products');
    }
};
