import axios from "axios";
import { CONFIG_UPDATE_FAIL, CONFIG_UPDATE_REQUEST, CONFIG_UPDATE_SUCCESS } from "constants/configConstants"

export const UpdateConfig = (config) => async (dispatch, getState) => {
    dispatch({ type: CONFIG_UPDATE_REQUEST });

    try {
        const { data } = await axios.post('/config/update', config);
        dispatch({ type: CONFIG_UPDATE_SUCCESS, payload: data.config });

    } catch (error) {
        dispatch({
            type: CONFIG_UPDATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        })
    }
}