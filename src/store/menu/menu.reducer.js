const initialState = {
  navs: []
};

const getMenus = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_MENU':
      return Object.assign({}, state, {
        navs: action.value
      });
    default:
      return state;
  }
};

export default getMenus;
