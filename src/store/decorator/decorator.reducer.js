const initialState = {
  data: []
};

const getDecoratorData = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_DECORATOR_DATA':
      return Object.assign({}, state, {
        data: action.value
      });
    default:
      return state;
  }
};

export default getDecoratorData;
