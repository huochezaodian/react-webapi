import React from 'react';
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon } from 'antd';
import Styles from './index.css';

import BreadCrumbCustom from './breadCrumb';
import IndexPage from '@src/page/main';
import NotFound from '@src/page/error/NotFound.js';
import List from '@src/page/main/list';
import Decorator from '@src/page/main/decorator';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const history = createBrowserHistory();

class LayOut extends React.Component {
  state = {
    collapsed: false,
    navs: [],
    curParent: {},
    curChild: {}
  };
  componentWillReceiveProps (nextProps) {
    if (nextProps.navs.length > 0) {
      let curSelect = {};
      let key = history.location.pathname;
      nextProps.navs.map(nav => {
        if (key === nav.key) {
          curSelect = nav;
        } else {
          nav.children && nav.children.map(child => {
            if (child.key === key) {
              curSelect = child;
            }
          });
        }
      });
      this.setState({
        curParent: curSelect.children ? curSelect : {},
        curChild: curSelect.children ? curSelect.children : curSelect,
        navs: nextProps.navs
      });
    }
  }
  handleMenuSelect (params) {
    let curSelect = {};
    this.state.navs.map(nav => {
      if (params.key === nav.key) {
        curSelect = nav;
      } else {
        nav.children && nav.children.map(child => {
          if (child.key === params.key) {
            curSelect = {...nav};
            curSelect.children = child;
          }
        });
      }
    });
    console.log(curSelect);
    this.setState({
      curParent: curSelect.children ? curSelect : {},
      curChild: curSelect.children ? curSelect.children : curSelect
    }, () => {
      history.push(params.key);
    });
  }
  handleBackIndex () {
    window.location.pathname = '/';
  }
  render () {
    const { curParent, curChild } = this.state;
    return (
      <Router history={history}>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            trigger={null}
          >
            <div className={Styles.logo} onClick={this.handleBackIndex.bind(this)}>WEB API</div>
            <Menu
              theme="dark"
              defaultSelectedKeys={[curChild.key || '']}
              mode="inline"
              defaultOpenKeys={[curParent.key || '']}
              onSelect={this.handleMenuSelect.bind(this)}
            >
              {
                this.state.navs.map(nav => nav.children && nav.children.length > 0
                  ? <SubMenu
                    key={nav.key}
                    title={<span><Icon type="file" /><span>{nav.name}</span></span>}
                  >
                    {
                      nav.children.map(item => <Menu.Item key={item.key}>{item.name}</Menu.Item>)
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
              <BreadCrumbCustom info={{curParent, curChild}}/>
              <div className={Styles.content}>
                <Switch>
                  <Route path='/' exact component={IndexPage}/>
                  {
                    this.props.navs.map(nav => {
                      return nav.children && nav.children.length > 0
                        ? nav.children.map(item => {
                          return <Route key={item.key} path={item.key} exact component={List}/>;
                        })
                        : <Route key={nav.key} path={nav.key} exact component={Decorator}/>;
                    })
                  }
                  {/* add api */}
                  <Route path='/add/api' component={List} />
                  {/* add decorator */}
                  <Route path='/add/decorator' component={Decorator} />
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
      </Router>
    );
  }
}

LayOut.propTypes = {
  navs: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  navs: state.menu.navs
});

export default connect(
  mapStateToProps
)(LayOut);
