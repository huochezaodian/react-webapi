const initialState = {
  navs: [],
  curMenu: {}
};

const getMenus = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_MENU':
      return Object.assign({}, state, {
        navs: action.value
      });
    case 'CHANGE_CURRENT_MENU':
      return Object.assign({}, state, {
        curMenu: action.value
      });
    default:
      return state;
  }
};

export default getMenus;
