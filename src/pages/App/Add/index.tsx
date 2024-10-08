import React from 'react';
import {Form, Input, Select, Button, message, Card} from 'antd';
import {addAppUsingPost} from "@/services/backend/appController";
import {useParams} from "react-router";
import {history} from "@umijs/max";

const {Option} = Select;

const AppCreatePage: React.FC = () => {
  const [form] = Form.useForm();
  // 获取登录用户
  const {id} = useParams();

  const handleSubmit = async (values: API.AppVO) => {
    let res;
    try {
      // 在这里处理创建应用的逻辑，例如发送请求到后端
      res = await addAppUsingPost(values);
      if (res.data) {
        console.log(res)
        message.success('应用创建成功！');
        // 跳转到应用列表页面
        history.push(`/app/square`)
      }
      // 重置表单
      form.resetFields();
    } catch (error) {
      message.error('应用创建失败，请重试！');
    }
  };

  return (
    <Card>
      <Form
        form={form}
        name="create_app_form"
        onFinish={handleSubmit}
        labelCol={{span: 4}}
        wrapperCol={{span: 16}}
      >
        <Form.Item
          label="应用名"
          name="appName"
          rules={[{required: true, message: '请输入应用名!'}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="应用描述"
          name="appDesc"
          rules={[{required: true, message: '请输入应用描述!'}]}
        >
          <Input.TextArea/>
        </Form.Item>

        <Form.Item
          label="应用图标"
          name="appIcon"
          rules={[{required: false, message: '请输入应用图标URL!'}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="应用类型"
          name="appType"
          rules={[{required: true, message: '请选择应用类型!'}]}
        >
          <Select placeholder="请选择应用类型">
            <Option value={0}>得分类</Option>
            <Option value={1}>测评类</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="评分策略"
          name="scoringStrategy"
          rules={[{required: true, message: '请选择评分策略!'}]}
        >
          <Select placeholder="请选择评分策略">
            <Option value={0}>自定义</Option>
            <Option value={1}>AI</Option>
          </Select>
        </Form.Item>

        <Form.Item
          wrapperCol={{offset: 4, span: 16}}
        >
          <Button type="primary" htmlType="submit">
            创建应用
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
export default AppCreatePage;
