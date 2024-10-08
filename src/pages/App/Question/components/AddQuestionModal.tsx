import '@umijs/max';
import {Button, Form, Input, message, Modal, Select} from 'antd';
import React, {useState} from 'react';
import {
  addQuestionUsingPost,
  editQuestionUsingPost,
  getQuestionVoByAppIdUsingPost
} from "@/services/backend/questionController";

interface Props {
  id: number,
  visible: boolean,
  onSubmit: (values: API.QuestionContentDTO) => void,
  form: any,
  handleCancel: () => void,
  appType: number | undefined,
  availableOptionKeys: string[],
  options: any[],
  currentRow: any,
  questionContentDTO: API.QuestionContentDTO[],
  setOptions?: (value: (((prevState: API.Option[]) => API.Option[]) | API.Option[])) => void,
  questionId: number
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
const AddQuestionResultModal: React.FC<Props> = (props) => {
  const {
    id,
    visible,
    appType,
    options,
    setOptions,
    onSubmit,
    handleCancel,
    availableOptionKeys,
    questionContentDTO,
    questionId
  } = props;
  const handleAdd = async (values: API.QuestionContentDTO) => {
    const hide = message.loading('正在添加');
    try {
      const questionContent: API.QuestionContentDTO = {
        title: values.title,
        options: values?.options?.map((option: API.Option, index: any) => ({
          key: String(option.key),
          result: option.result,
          score: option.score,
          value: option.value
        }))
      };
      // questionContentDTO.splice(0, questionContentDTO.length);
      questionContentDTO.push(questionContent);
      // 如果已有题目则调用修改接口，如果没有题目则调用添加接口
      const questionVORes = await getQuestionVoByAppIdUsingPost({appId: id})
      const sum = questionVORes?.data?.questionContent?.length;
      let res;
      if (sum && sum > 0) {
        res = await editQuestionUsingPost({
          id: questionId,
          questionContentDTOList: questionContentDTO,
        })
      } else {
        res = await addQuestionUsingPost({
          id: questionId as any,
          appId: id as any,
          questionContentDTOList: questionContentDTO
        });
      }
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
  const addQuestionOption = () => {
    const newOption: API.Option = {key: String(options.length), value: ''};
    if (setOptions) {
      setOptions([...options, newOption]);
    }
  };
  const removeQuestionOption = (key: string) => {
    const newOptions = options.filter(option => option.key !== key);
    // const newAvailableKeys = optionKeys.filter(k => !newOptions.map(o => o.key).includes(k));
    if (setOptions) {
      setOptions(newOptions);
    }
    // setAvailableOptionKeys(newAvailableKeys);
  };

  return (
    <Modal
      destroyOnClose
      title="添加问题"
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
        onFinish={async (values: API.QuestionContentDTO) => {
          const success = await handleAdd(values);
          if (success) {
            onSubmit?.(values);
          }
        }}
      >
        <Form.Item
          label="问题标题"
          name="title"
          rules={[{required: true, message: '请输入问题标题!'}]}
        >
          <Input/>
        </Form.Item>

        {options.map((option, index) => (
          <div key={option.key}>
            <Form.Item
              label={`选项 ${index + 1} 内容`}
              name={['options', index, 'value']}
              rules={[{required: true, message: '请输入选项内容!'}]}
            >
              <Input/>
            </Form.Item>
            {appType === 1 && (
              <Form.Item
                label={`选项 ${index + 1} 结果`}
                name={['options', index, 'result']}
              >
                <Input/>
              </Form.Item>
            )}
            {appType === 0 && (
              <Form.Item
                label={`选项 ${index + 1} 分数`}
                name={['options', index, 'score']}
              >
                <Input type="number"/>
              </Form.Item>
            )}

            <Form.Item
              label={`选项 ${index + 1} key`}
              name={['options', index, 'key']}
              rules={[{required: true, message: '请输入选项key!'}]}
            >
              <Select>
                {availableOptionKeys.map((key, idx) => (
                  <Select.Option key={idx} value={key}>
                    {key}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {options.length > 1 && (
              <Button
                type="text"
                onClick={() => removeQuestionOption(option.key!)}
                icon={<span>&times;</span>}
              >
                删除选项
              </Button>
            )}
          </div>
        ))}

        <Form.Item>
          <Button type="dashed" onClick={addQuestionOption} icon={<span>&#43;</span>}>
            添加选项
          </Button>
        </Form.Item>
        <Button type="primary" htmlType="submit">确定</Button>
      </Form>
    </Modal>
  );
};
export default AddQuestionResultModal;
