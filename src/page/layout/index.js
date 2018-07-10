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

import { changeCurrentMenu } from '../../store/menu/menu.action';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const history = createBrowserHistory();

class LayOut extends React.PureComponent {
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
              curSelect = {...nav};
              curSelect.children = child;
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
    this.setState({
      curParent: curSelect.children ? curSelect : {},
      curChild: curSelect.children ? curSelect.children : curSelect
    }, () => {
      this.props.updateCurrentMenu({...curSelect});
      history.push(params.key, {id: this.state.curParent.id || '', childId: this.state.curChild.key || ''});
    });
  }
  handleBackIndex () {
    window.location.pathname = '/';
  }
  handleBackDecorator () {
    this.setState({
      curChild: {}
    }, () => {
      let curParent = this.state.curParent;
      let path = curParent.key || '/';
      history.push(path, {id: curParent.id || ''});
    });
  }
  handleOpenChange (openKeys) {
    console.log(openKeys);
    let key = openKeys[openKeys.length - 1];
    if (key === '') return;
    let curSelect = {};
    this.state.navs.map(nav => {
      if (key === nav.key) {
        curSelect = nav;
      } else {
        nav.children && nav.children.map(child => {
          if (child.key === key) {
            curSelect = {...nav};
            curSelect.children = child;
          }
        });
      }
    });
    this.setState({
      curParent: curSelect.children ? curSelect : {},
      curChild: curSelect.children ? curSelect.children : curSelect
    }, () => {
      this.props.updateCurrentMenu({...curSelect});
      history.push(key);
    });
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
              selectedKeys={[curChild.key || '']}
              mode="inline"
              openKeys={[curParent.key || '']}
              onSelect={this.handleMenuSelect.bind(this)}
              onOpenChange={this.handleOpenChange.bind(this)}
            >
              {
                this.state.navs.map(nav => nav.children
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
              <BreadCrumbCustom info={{curParent, curChild}} updateBread={this.handleBackDecorator.bind(this)}/>
              <div className={Styles.content}>
                <Switch>
                  <Route path='/' exact component={IndexPage}/>
                  {
                    this.state.navs.map(nav => <Route key={nav.key} path={nav.key} exact component={Decorator}/>)
                  }
                  {
                    this.state.navs.map(nav => {
                      return nav.children && nav.children.map(item => <Route key={item.key} path={item.key} exact component={List}/>);
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
  navs: PropTypes.array.isRequired,
  curSelect: PropTypes.object.isRequired,
  updateCurrentMenu: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  navs: state.menu.navs,
  curSelect: state.menu.curMenu
});

const mapDispatchToProps = dispatch => ({
  updateCurrentMenu: (curMenu) => dispatch(changeCurrentMenu(curMenu))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayOut);
