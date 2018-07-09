import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Button, Row, Col } from 'antd';
import Styles from './breadCrumb.css';

class BreadCrumbCustom extends Component {
  state = {
  };
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  static propTypes = {
    info: PropTypes.object.isRequired
  };
  static defaultProps = {
    info: {curParent: {}, curChild: {}}
  };
  handleAddDecorator () {
    this.context.router.history.push('/add/decorator');
  }
  handleAddApi () {
    this.context.router.history.push('/add/api', {id: this.props.info.curParent.key || ''});
  }
  handleAddBread () {
    let key = this.context.router.route.location.pathname.split('/');
    return {
      'parent': key[1] === 'add' ? '添加' : '',
      'child': key[1] === 'add' && key[2] ? key[2] : ''
    };
  }
  render () {
    const { curParent, curChild } = this.props.info;
    const { parent, child } = this.handleAddBread();
    return (
      <Row type='flex' align='middle' justify='space-between' className={Styles.minHeight}>
        <Col>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>{parent || curParent.name || ''}</Breadcrumb.Item>
            <Breadcrumb.Item>{child || curChild.name || ''}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col>
          <Button type='primary' className={Styles.marginLeft} icon='plus' onClick={this.handleAddDecorator.bind(this)}>添加目录</Button>
          {
            curParent.key && <Button type='primary' className={Styles.marginLeft} icon='plus' onClick={this.handleAddApi.bind(this)}>添加接口</Button>
          }
        </Col>
      </Row>
    );
  }
}

export default BreadCrumbCustom;
