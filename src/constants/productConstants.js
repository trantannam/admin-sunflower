import { Bounce } from "react-toastify";

export const PRODUCT_LIST_REQUEST = 'PRODUCT_LIST_REQUEST';
export const PRODUCT_LIST_SUCCESS = 'PRODUCT_LIST_SUCCESS';
export const PRODUCT_LIST_FAIL = 'PRODUCT_LIST_FAIL';

export const PRODUCT_DETAIL_REQUEST = 'PRODUCT_DETAIL_REQUEST';
export const PRODUCT_DETAIL_SUCCESS = 'PRODUCT_DETAIL_SUCCESS';
export const PRODUCT_DETAIL_FAIL = 'PRODUCT_DETAIL_FAIL';

export const PRODUCT_UPDATE_REQUEST = 'PRODUCT_UPDATE_REQUEST';
export const PRODUCT_UPDATE_SUCCESS = 'PRODUCT_UPDATE_SUCCESS';
export const PRODUCT_UPDATE_FAIL = 'PRODUCT_UPDATE_FAIL';
export const PRODUCT_UPDATE_RESET = 'PRODUCT_UPDATE_RESET';

export const PRODUCT_IMAGE_REQUEST = 'PRODUCT_IMAGE_REQUEST';
export const PRODUCT_IMAGE_SUCCESS = 'PRODUCT_IMAGE_SUCCESS';
export const PRODUCT_IMAGE_FAIL = 'PRODUCT_IMAGE_FAIL';
export const PRODUCT_IMAGE_RESET = 'PRODUCT_IMAGE_RESET';

export const PRODUCT_CREATE_REQUEST = 'PRODUCT_CREATE_REQUEST';
export const PRODUCT_CREATE_SUCCESS = 'PRODUCT_CREATE_SUCCESS';
export const PRODUCT_CREATE_FAIL = 'PRODUCT_CREATE_FAIL';


export const TOAST_OPTIONS = {
    autoClose: 3000,
    hideProgressBar: true,
    transition: Bounce,
}