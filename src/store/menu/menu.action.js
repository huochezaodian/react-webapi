import Util from '@src/config/Util';
import { message as Message } from 'antd';

export const changeMenu = () => (dispatch) => {
  Util.fetchData('/api/menus', {method: 'get'}).then(res => {
    if (res.errorCode === 0) {
      let newNavs = [];
      res.data.map((item, idx) => {
        newNavs.push({
          id: item.id,
          key: '/' + item.id,
          name: item.name,
          children: []
        });
        item.children && item.children.map(child => {
          newNavs[idx].children.push({
            id: child.id,
            key: child.url,
            name: child.name
          });
          return child;
        });
        return item;
      });
      return dispatch({
        type: 'CHANGE_MENU',
        value: newNavs
      });
    } else {
      Message.error(res.errorMessage || '请求错误');
    }
  });
};

export const changeCurrentMenu = (curMenu) => {
  return {
    type: 'CHANGE_CURRENT_MENU',
    value: curMenu
  };
};
