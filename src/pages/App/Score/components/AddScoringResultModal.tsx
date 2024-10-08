import {addUserUsingPost} from '@/services/backend/userController';
import '@umijs/max';
import {AutoComplete, Button, Form, Input, InputNumber, message, Modal, Select} from 'antd';
import React, {useEffect, useState} from 'react';
import {addScoringResultUsingPost, editScoringResultUsingPost} from "@/services/backend/scoringResultController";
import FormItem from "antd/es/form/FormItem";
import {generateSnowFlakeNextIdUsingGet} from "@/services/backend/baseController";

interface Props {
  id: number,
  visible: boolean,
  onSubmit: (values: API.ScoringResultVO) => void,
  form: any,
  handleCancel: () => void,
  appType: number | undefined,
  currentRow: any,
  scoringResultId: number | undefined,
  setScoringResultId: (id: number) => void,
}

/**
 * 添加节点
 * @param fields
 */


/**
 * 创建弹窗
 * @param props
 * @constructor
 */
const AddScoringResultModal: React.FC<Props> = (props) => {
  const {
    id,
    visible,
    appType,
    onSubmit,
    handleCancel,
    scoringResultId,
    setScoringResultId,
  } = props;


  const handleAdd = async (values: API.ScoringResultVO) => {
    console.log(scoringResultId)
    const hide = message.loading('正在添加');
    try {
      const addScoringResultRequest = {
        resultName: values.resultName,
        resultDesc: values.resultDesc,
        resultPicture: values.resultPicture,
        resultProp: values.resultProp,
        resultScoreRange: values.resultScoreRange,
        appId: id,
        id: scoringResultId,
      }
      const res = await addScoringResultUsingPost(addScoringResultRequest)
      if (res) {
        hide();
        message.success('创建成功');
        return true;
      }
    } catch (error: any) {
      hide();
      message.error('创建失败，' + error.message);
      return false;
    }
  };
  const getSnowFlakeNextId = async () => {
    const scoringResultIdData = await generateSnowFlakeNextIdUsingGet();
    if (scoringResultIdData.data) {
      setScoringResultId(scoringResultIdData.data)
    }
  }
  useEffect(() => {
    getSnowFlakeNextId();
  }, []);

  return (
    <Modal
      destroyOnClose
      title="添加结果属性集"
      visible={visible}
      footer={null}
      onCancel={() => {
        handleCancel?.();
      }}
    >
      <Form
        form={props.form}
        name="add_question"
        layout="vertical"
        onFinish={async (values: API.ScoringResultVO) => {
          const success = await handleAdd(values);
          if (success) {
            onSubmit?.(values);
          }
        }}
      >
        <Form.Item
          label="结果名称"
          name="resultName"
          rules={[{required: true, message: '请输入结果名称!'}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label="结果描述"
          name="resultDesc"
          rules={[{required: true, message: '请输入结果描述!'}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label="结果图片"
          name="resultPicture"
          rules={[{required: true, message: '请输入结果图片!'}]}
        >
          <Input/>
        </Form.Item>
        {appType === 1 && (
          <Form.Item
            name="resultProp"
            label="结果属性集合"
            rules={[{required: true, message: '请输入结果属性集合!'}]}
          >
            <Select
              mode="tags"
              style={{width: '100%'}}
              placeholder="请输入结果属性"
            />
          </Form.Item>
        )}
        {appType === 0 && (
          <FormItem
            label="结果分数范围"
            name="resultScoreRange"
            rules={[
              {required: true, message: '请输入结果分数范围!'},
              ({getFieldValue}) => ({
                validator(rule, value) {
                  if (value === undefined || (value >= 0 && value <= 100)) {
                    return Promise.resolve();
                  }
                  return Promise.reject('分数必须在0到100之间!');
                },
              }),
            ]}
          >
            <InputNumber min={0} max={100}/>
          </FormItem>
        )}
        <Button type="primary" htmlType="submit">确定</Button>
      </Form>
    </Modal>
  );
};
export default AddScoringResultModal;
