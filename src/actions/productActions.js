import Axios from 'axios';
import { PRODUCT_CREATE_FAIL, PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_SUCCESS, PRODUCT_DETAIL_FAIL, PRODUCT_DETAIL_REQUEST, PRODUCT_DETAIL_SUCCESS, PRODUCT_IMAGE_FAIL, PRODUCT_IMAGE_REQUEST, PRODUCT_IMAGE_SUCCESS, PRODUCT_LIST_FAIL, PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_UPDATE_FAIL, PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS } from 'constants/productConstants';

export const listProducts = () => async (dispatch) => {
    dispatch({
        type: PRODUCT_LIST_REQUEST
    });
    try {
        const { data } = await Axios.get('/products');
        dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message })
    }
}

export const detailProduct = (productId) => async (dispatch) => {
    dispatch({
        type: PRODUCT_DETAIL_REQUEST, payload: productId
    });
    try {
        // Can't get data  
        const { data } = await Axios.get(`/products/${productId}`);
        dispatch({ type: PRODUCT_DETAIL_SUCCESS, payload: data });
    } catch (error) {
        console.log("Can't get data !");
        dispatch({
            type: PRODUCT_DETAIL_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};


export const updateProduct = (product) => async (dispatch) => {
    dispatch({ type: PRODUCT_UPDATE_REQUEST, payload: product });
    console.log('product: ', product);
    try {
        const { data } = await Axios.put('/products/updateProduct', product);
        console.log('data: ', data);
        dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }

};


export const updateProductImage = (product) => async (dispatch) => {
    dispatch({ type: PRODUCT_IMAGE_REQUEST, payload: product });

    console.log('product have image ', product);

    const fd = new FormData();
    fd.append('id', product.id);
    fd.append('name', product.name);
    fd.append('category', product.category);
    fd.append('price', product.price);
    fd.append('oldPrice', product.oldPrice);
    fd.append('note', product.note);
    fd.append('countInStock', product.countInStock);
    fd.append('image', product.image, product.image.name);


    try {
        const { data } = await Axios.put('/products/updateProductImage', fd);
        console.log('data: ', data);
        dispatch({ type: PRODUCT_IMAGE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PRODUCT_IMAGE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

export const deleteProduct = (id) => async (dispatch) => {

    console.log(id);
    try {
        Axios.delete(`/products/deleteProduct/${id}`);
    } catch (error) {
        console.log('Error');
    }
}


export const createProduct = (product) => async (dispatch) => {
    dispatch({ type: PRODUCT_CREATE_REQUEST, payload: product.name });
    console.log(product);
    const fd = new FormData();
    fd.append('name', product.name);
    fd.append('category', product.category);
    fd.append('price', product.price);
    fd.append('note', product.note);
    fd.append('countInStock', product.countInStock);
    fd.append('image', product.image, product.image.name);
    try {
        const { data } = await Axios.post('/products/create', fd);
        dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

