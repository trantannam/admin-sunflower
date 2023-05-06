import { Bounce } from "react-toastify";

export const CONFIG_UPDATE_REQUEST = 'CONFIG_UPDATE_REQUEST';
export const CONFIG_UPDATE_SUCCESS = 'CONFIG_UPDATE_SUCCESS';
export const CONFIG_UPDATE_FAIL = 'CONFIG_UPDATE_FAIL';

export const TOAST_OPTIONS = {
    autoClose: 2000,
    hideProgressBar: true,
    transition: Bounce,
}