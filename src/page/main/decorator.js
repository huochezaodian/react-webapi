import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Form, Input, Button, message as Message} from 'antd';

import Util from '@src/config/Util';
import { changeMenu } from '../../store/menu/menu.action';

const FormItem = Form.Item;

const formItemLayout = {
  // labelCol: { span: 2 },
  // wrapperCol: { span: 12 }
};
const buttonLayout = {
  wrapperCol: { span: 2, offset: 11 }
};

class DecoratorForm extends React.Component {
  state = {
    name: '',
    des: '',
    id: ''
  };
  componentWillMount () {
    const id = this.props.location.pathname.split('/')[1] || '';
    Util.fetchData('/api/menu/info', {
      data: { id }
    }).then(res => {
      if (res.errorCode === 0) {
        this.setState({
          name: res.data[0].name,
          des: res.data[0].des,
          id: res.data[0].id
        });
      } else {
        Message.error(res.errorMessage || '获取菜单信息失败');
      }
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Util.fetchData('/api/add/decorator', {
          data: values
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
  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="目录名称"
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
          label="目录描述"
        >
          {getFieldDecorator('des', {
            initialValue: this.state.des
          })(
            <Input size='large' placeholder='请输入目录的描述'/>
          )}
        </FormItem>
        <FormItem {...buttonLayout}>
          <Button size='large' type="primary" onClick={this.handleSubmit}>保存</Button>
        </FormItem>
      </Form>
    );
  };
}

DecoratorForm.propTypes = {
  form: PropTypes.object.isRequired,
  updateMenu: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired
};

const Decorator = Form.create()(DecoratorForm);

const mapStateToProps = state => ({
  navs: state.menu.navs
});

const mapDispatchToProps = dispatch => ({
  updateMenu: () => dispatch(changeMenu())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Decorator);
