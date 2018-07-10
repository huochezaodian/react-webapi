import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Form, Input, Button, Checkbox, message as Message, Row, Col} from 'antd';
import Util from '@src/config/Util';
import Styles from './list.css';

import { changeMenu } from '../../store/menu/menu.action';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  // labelCol: { span: 2 },
  // wrapperCol: { span: 12 }
};

const methods = ['get', 'post'];

class ListForm extends React.Component {
  state = {
    parentId: '',
    id: '',
    name: '',
    des: '',
    type: '',
    data: ''
  };
  componentWillMount () {
    const params = this.props.history.location.state;
    if (params) {
      Util.fetchData('/api/api/info', {
        data: {
          url: params.childId
        }
      }).then(res => {
        if (res.errorCode === 0) {
          res.data.length > 0 && this.setState({
            name: res.data[0].name,
            url: res.data[0].url,
            des: res.data[0].des,
            id: res.data[0].id,
            type: res.data[0].type,
            data: res.data[0].data
          });
        } else {
          Message.error(res.errorMessage || '获取信息失败');
        }
      });
    } else {
      window.location.pathname = '/';
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = {...values};
        data.parentId = this.props.history.location.state.id.slice(1);
        data.type = data.type.join(',');
        Util.fetchData('/api/add/api', {
          data
        }).then(res => {
          if (res.errorCode === 0) {
            Message.success('保存成功');
            this.props.updateMenu();
          } else {
            Message.error(res.errorMessage || '提交失败');
          }
        });
      }
    });
  }
  handleDelete = e => {
    e.preventDefault();
    Util.fetchData('/api/delete/api', {
      data: {url: this.state.url}
    }).then(res => {
      if (res.errorCode === 0) {
        Message.success('删除成功');
        this.props.updateMenu();
      } else {
        Message.error(res.errorMessage || '删除失败');
      }
    });
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="接口名称"
        >
          {getFieldDecorator('name', {
            initialValue: this.state.name,
            rules: [{
              required: true, message: '请输入名称!'
            }]
          })(
            <Input size='large' placeholder='请输入名称'/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="接口"
        >
          {getFieldDecorator('url', {
            initialValue: this.state.url,
            rules: [{
              required: true, message: '请输入接口!'
            }, {
              pattern: /^\/\w+/, message: '开头必须有/'
            }]
          })(
            <Input size='large' placeholder='请输入接口'/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="接口描述"
        >
          {getFieldDecorator('des', {
            initialValue: this.state.des
          })(
            <Input size='large' placeholder='请输入接口的描述'/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="请求方式"
        >
          {getFieldDecorator('type', {
            initialValue: this.state.type === '' ? [] : this.state.type.split(','),
            rules: [{
              required: true, message: '请选择请求方式!'
            }]
          })(
            <CheckboxGroup options={methods}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="返回数据"
        >
          {getFieldDecorator('data', {
            initialValue: this.state.data,
            rules: [{
              required: true, message: '请填写返回数据!'
            }]
          })(
            <Input.TextArea placeholder='请填写返回数据' rows={8}/>
          )}
        </FormItem>
        <FormItem>
          <Row type='flex'>
            <Col><Button className={Styles.button} size='large' type="primary" onClick={this.handleSubmit}>保存</Button></Col>
            {
              this.state.id && <Col><Button size='large' type="primary" onClick={this.handleDelete}>删除</Button></Col>
            }
          </Row>
        </FormItem>
      </Form>
    );
  };
}

ListForm.propTypes = {
  form: PropTypes.object.isRequired,
  updateMenu: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const List = Form.create()(ListForm);

const mapStateToProps = state => ({
  curMenu: state.menu.curMenu
});
const mapDispatchToProps = dispatch => ({
  updateMenu: () => dispatch(changeMenu())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
