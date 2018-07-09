import React from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Button, Checkbox, message as Message} from 'antd';
import Util from '@src/config/Util';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  // labelCol: { span: 2 },
  // wrapperCol: { span: 12 }
};
const buttonLayout = {
  wrapperCol: { span: 2, offset: 11 }
};

const methods = ['get', 'post'];

class ListForm extends React.Component {
  state = {
    parentId: ''
  };
  componentWillMount () {
    const params = this.props.history.location.state;
    if (params) {
      this.setState({
        parentId: params.id || ''
      });
    } else {
      this.props.history.goBack();
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = {...values};
        data.parentId = this.state.parentId;
        data.type = data.type.join(',');
        Util.fetchData('/api/add/api', {
          data
        }).then(res => {
          if (res.errorCode === 0) {
            Message.success('保存成功');
            this.props.history.push('/' + this.state.parentId + values.url);
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
          label="接口名称"
        >
          {getFieldDecorator('name', {
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
            rules: [{
              required: true, message: '请输入接口!'
            }, {
              partten: /^\/\w+/, message: '开头必须有/'
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
          })(
            <Input size='large' placeholder='请输入接口的描述'/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="请求方式"
        >
          {getFieldDecorator('type', {
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
            rules: [{
              required: true, message: '请填写返回数据!'
            }]
          })(
            <Input.TextArea placeholder='请填写返回数据' rows={8}/>
          )}
        </FormItem>
        <FormItem {...buttonLayout}>
          <Button size='large' type="primary" onClick={this.handleSubmit}>保存</Button>
        </FormItem>
      </Form>
    );
  };
}

ListForm.propTypes = {
  form: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const List = Form.create()(ListForm);
export default List;
