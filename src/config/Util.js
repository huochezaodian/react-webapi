import fetch from 'isomorphic-fetch';
import {message as Message} from 'antd';

export default {
  fetchData (url, config = {}) {
    if (!url) return;
    let method = config.method || 'POST';
    let body = config.data || {};
    if (method.toUpperCase() === 'GET') {
      body = undefined;
    } else {
      body = body && JSON.stringify(body);
    }
    config.method = method.toUpperCase();
    config.body = body;

    return new Promise((resolve, reject) => {
      fetch(url, {
        ...config
      }).then(res => {
        if (res.status >= 200 && res.status < 300) {
          return res.json();
        }
      }).then(json => {
        resolve(json);
      }).catch(error => {
        reject(error);
        Message.error(error.message);
        throw error;
      });
    });
  }
};
