import React, { useState } from 'react';
import { Button, Divider, Form, Input, message, Modal, Select } from 'antd';
import { editScoringResultUsingPost } from "@/services/backend/scoringResultController";

interface ScoringResultModalProps {
  id?: number;
  visible: boolean;
  onSubmit: (values: API.ScoringResultVO) => void;
  onCancel: () => void;
  scoringResultVO: API.ScoringResultVO | null;
  appType: number | undefined;
  form: any
}

const EditScoringResultModal: React.FC<ScoringResultModalProps> = (props) => {
  const {
    id,
    visible,
    appType,
    scoringResultVO,
    onSubmit,
    onCancel,
    form,
  } = props;
  
  const handleEdit = async (values: API.ScoringResultVO) => {
    const hide = message.loading('正在修改');
    try {
      // 在这里可以进行API调用等操作
      const res = await editScoringResultUsingPost({
        id: scoringResultVO?.id,
        ...values
      });
      if (res) {
        hide();
        message.success('修改成功');
        return true;
      }
    } catch (error: any) {
      hide();
      message.error('修改失败，' + error.message);
      return false;
    }
  };

  return (
    <Modal
      destroyOnClose
      title="修改评分结果"
      visible={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <Form
        form={form}
        name="edit_scoring_result"
        layout="vertical"
        onFinish={async (values: API.ScoringResultVO) => {
          const success = await handleEdit(values);
          if (success) {
            onSubmit?.(values);
          }
        }}
        // @ts-ignore
        initialValues={scoringResultVO}
      >
        <Form.Item
          name="resultName"
          label="结果名称"
          rules={[{ required: true, message: '请输入结果名称!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="resultDesc"
          label="结果描述"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="resultPicture"
          label="结果图片"
        >
          <Input />
        </Form.Item>
        {appType === 1 && (
          <Form.Item
            name="resultProp"
            label="结果属性集合"
            rules={[{ required: true, message: '请输入结果属性集合!' }]}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="请输入结果属性"
            />
          </Form.Item>
        )}
        {appType === 0 && (
          <Form.Item
            name="resultScoreRange"
            label="结果得分范围"
            rules={[{ required: true, message: '请输入结果得分范围!' }]}
          >
            <Input type="number" />
          </Form.Item>
        )}
        <Button type="primary" htmlType="submit">确定</Button>
      </Form>
    </Modal>
  );
};

export default EditScoringResultModal;
