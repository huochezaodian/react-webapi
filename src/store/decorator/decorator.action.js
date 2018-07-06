import Util from '@src/config/Util';
import { message as Message } from 'antd';

export const updateDecoratorData = () => (dispatch) => {
  Util.fetchData('/api/menus', {method: 'get'}).then(res => {
    if (res.errorCode === 0) {
      let newNavs = [];
      res.data.map(item => {
        newNavs.push({
          key: String(item.id),
          name: item.name,
          children: []
        });
        item.children && item.children.map(child => {
          newNavs.children.push({
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
