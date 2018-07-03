import React from 'react';
import Protypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import _ from 'lodash';
import Styles from './index.css';

import IndexPage from '@src/page/main';
import NotFound from '@src/page/error/NotFound.js';
import List from '@src/page/main/list';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class LayOut extends React.Component {
  state = {
    collapsed: false,
    navs: [{
      key: '1',
      name: '1',
      children: [{key: '1', name: '1'}, {key: '2', name: '2'}]
    }, {
      key: '2',
      name: '2',
      children: [{key: '3', name: '3'}, {key: '4', name: '4'}]
    }, {
      key: '3',
      name: '3',
      children: []
    }],
    curParent: {},
    curChild: {}
  };
  static contextTypes = {
    router: Protypes.object.isRequired
  };
  componentWillMount () {
    let key = this.context.router.route.location.pathname.split('/');
    let curParent = _.find(this.state.navs, {'key': key[1]}) || {};
    let curChild = _.find(curParent.children, {'key': key[2]}) || {};
    this.setState({
      curParent,
      curChild
    });
  }
  handleMenuSelect (params) {
    console.log(params);
    let curChild = {};
    let keys = params.key.split('-');
    let curParent = _.find(this.state.navs, {key: keys[0]});
    keys[1] && (curChild = Object.assign(curChild, _.find(curParent.children, {key: keys[1]})));
    this.context.router.history.push('/' + curParent.key + '/' + (curChild.key || ''));
    this.setState({
      curParent,
      curChild
    });
  }
  render () {
    const { curParent, curChild } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          trigger={null}
        >
          <div className={Styles.logo}>WEB API</div>
          <Menu theme="dark" defaultSelectedKeys={[!curChild.key ? curParent.key : `${curParent.key}-${curChild.key}`]} mode="inline" defaultOpenKeys={[curParent.key || '']}
            onSelect={this.handleMenuSelect.bind(this)}
          >
            {
              this.state.navs.map(nav => nav.children && nav.children.length > 0
                ? <SubMenu
                  key={nav.key}
                  title={<span><Icon type="file" /><span>{nav.name}</span></span>}
                >
                  {
                    nav.children.map(item => <Menu.Item key={nav.key + '-' + item.key}>{item.name}</Menu.Item>)
                  }
                </SubMenu>
                : <Menu.Item key={nav.key}><Icon type="file" />{nav.name}</Menu.Item>
              )
            }
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>{curParent.name}</Breadcrumb.Item>
              <Breadcrumb.Item>{curChild.name}</Breadcrumb.Item>
            </Breadcrumb>
            <div className={Styles.content}>
              <Switch>
                <Route path='/' exact component={IndexPage} />
                {
                  this.state.navs.map(nav => {
                    return nav.children && nav.children.length > 0
                      ? nav.children.map(item => {
                        return <Route key={item.key + '-' + nav.key} path={`/${nav.key}/${item.key}`} exact component={List}/>;
                      })
                      : <Route key={nav.key} path={`/${nav.key}`} exact component={IndexPage}/>;
                  })
                }
                {/* 404 */}
                <Route component={NotFound} />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            webapi @2018
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default LayOut;
