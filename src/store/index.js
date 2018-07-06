import { combineReducers } from 'redux';

import menu from './menu/menu.reducer';
import decorator from './decorator/decorator.reducer';

export default combineReducers({
  menu,
  decorator
});
