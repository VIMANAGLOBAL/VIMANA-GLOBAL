import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from '../ducks';

export default combineReducers({
    auth,
    form: formReducer
});
