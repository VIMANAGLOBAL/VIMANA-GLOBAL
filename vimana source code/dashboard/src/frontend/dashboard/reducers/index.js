import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// ducks
import main from '../ducks/main';
import info from '../ducks/info';

export default combineReducers({
    main,
    info,
    form: formReducer
});
