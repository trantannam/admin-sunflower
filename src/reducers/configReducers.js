import { CONFIG_UPDATE_FAIL, CONFIG_UPDATE_REQUEST, CONFIG_UPDATE_SUCCESS } from "constants/configConstants"

export const UpdateConfigReducer = (state = {}, action) => {
    switch (action.type) {
        case CONFIG_UPDATE_REQUEST:
            return { loading: true };
        case CONFIG_UPDATE_SUCCESS:
            return {
                loading: false,
                success: true,
                config: action.payload
            };
        case CONFIG_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        default: return state;
    }
}
