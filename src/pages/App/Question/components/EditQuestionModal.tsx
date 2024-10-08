import '@umijs/max';
import {Button, Divider, Form, Input, message, Modal, Select} from 'antd';
import React, {useState} from 'react';
import {editQuestionUsingPost} from "@/services/backend/questionController";

interface Props {
  id: number,
  visible: boolean,
  onSubmit: (values: API.QuestionContentDTO) => void,
  form: any,
  handleEditCancel: () => void,
  appType: number | undefined,
  availableOptionKeys: string[],
  options: any[],
  currentRow: any,
  questionContentDTO: API.QuestionContentDTO[],
  setOptions?: (value: (((prevState: API.Option[]) => API.Option[]) | API.Option[])) => void,
  currentQuestion: API.QuestionContentDTO | null,
  setCurrentQuestion: (value: (prevQuestion: any) => (null | {
    options: API.Option[] | undefined;
    title?: string
  })) => void,
  aiGenerateType: string,
  questionList: API.QuestionContentDTO[],
  setQuestionList: React.Dispatch<React.SetStateAction<API.QuestionContentDTO[]>>
  setQuestionContentDTO: any
}


// 比较两个Option数组是否相等
const areOptionsEqual = (options1: API.Option[], options2: API.Option[]): boolean => {
  if (options1.length !== options2.length) {
    return false;
  }
  return options1.every((option, index) => {
    return option.key === options2[index].key && option.value === options2[index].value;
  });
};
const filterUnmodifiedQuestions = (questionList: API.QuestionContentDTO[], values: API.QuestionContentDTO): API.QuestionContentDTO[] => {
  console.log(values)
  console.log(questionList)
  return questionList.filter(question => {
    // 比较标题是否相同
    const titleIsEqual = question.title !== values.title;
    // 比较选项是否相同
    // const optionsAreEqual = areOptionsEqual(question.options || [], values.options || []);
    // 如果标题和选项都相同，则问题未修改
    return titleIsEqual;
  });
};
/**
 * 创建弹窗
 * @param props
 * @constructor
 */
const EditQuestionModal: React.FC<Props> = (props) => {
  const {
    id,
    visible,
    appType,
    options,
    setOptions,
    onSubmit,
    handleEditCancel,
    availableOptionKeys,
    questionContentDTO,
    form,
    currentQuestion,
    setCurrentQuestion,
    aiGenerateType,
    questionList,
    setQuestionList,
    setQuestionContentDTO
  } = props;
  const handleEdit = async (values: API.QuestionContentDTO) => {
    console.log(aiGenerateType)
    const hide = message.loading('正在修改');
    if (aiGenerateType === 'ai_real_time') {
      console.log("???")
      const newQuestionContentDTO = questionList.filter(question => question.title !== currentQuestion?.title)
      if (values) {
        newQuestionContentDTO.push(values)
      }
      setQuestionList(newQuestionContentDTO)

      return true;
    } else {
      try {
        // 这个values就是你要修改的那个
        const newQuestionContentDTO = questionContentDTO.filter(question => question.title !== currentQuestion?.title)
        if (values) {
          newQuestionContentDTO.push(values)
        }
        console.log(newQuestionContentDTO)
        // 在这里可以进行API调用等操作
        const res = await editQuestionUsingPost({
          id: id as any,
          questionContentDTOList: newQuestionContentDTO,
        })
        if (res && setOptions) {
          setOptions([]);
          hide();
          message.success('修改成功');
          return true;
        }
      } catch (error: any) {
        hide();
        message.error('修改失败，' + error.message);
        return false;
      }
    }

  };

  const addQuestionOption = () => {
    const newOption: API.Option = {key: String(options.length), value: ''};
    if (setOptions) {
      setOptions([...options, newOption]);
    }
    setCurrentQuestion((prevQuestion) => {
      if (!prevQuestion) return null;
      const newOptions = prevQuestion.options;
      newOptions?.push(newOption);
      return {...prevQuestion, options: newOptions};
    })
  };
  const removeOldOption = (key: string) => {
    setCurrentQuestion((prevQuestion: { options: any[]; }) => {
      if (!prevQuestion) return null;
      const newOptions = prevQuestion.options?.filter(option => option.key !== key);
      return {...prevQuestion, options: newOptions};
    });
  }

  return (
    <Modal
      destroyOnClose
      title="修改题目"
      visible={visible}
      footer={null}
      onCancel={handleEditCancel}
    >
      <Form
        form={form}
        name="edit_question"
        layout="vertical"
        onFinish={async (values: API.QuestionContentDTO) => {
          const success = await handleEdit(values);
          if (success) {
            onSubmit?.(values);
          }
        }}
      >
        <Form.Item
          name="title"
          label="题目"
          rules={[{required: true, message: '请输入题目!'}]}
        >
          <Input/>
        </Form.Item>
        {currentQuestion?.options?.map((option, index) => (
          <div key={option.key}>
            <Form.Item
              name={['options', index, 'value']}
              label={`选项`}
              rules={[{required: true, message: '请输入选项!'}]}
            >
              <Input/>
            </Form.Item>
            {appType === 0 && (
              <Form.Item
                name={['options', index, 'score']}
                label="分数"
                rules={[{required: true, message: '请输入分数!'}]}
              >
                <Input type="number"/>
              </Form.Item>
            )}
            {appType === 1 && (
              <Form.Item
                name={['options', index, 'result']}
                label={`结果`}
                rules={[{required: false, message: '请输入分数!'}]}
              >
                <Input/>
              </Form.Item>
            )}
            <Form.Item
              label={`选项`}
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
            {Number(currentQuestion?.options?.length) > 1 && (<Button
              type="text"
              onClick={() => removeOldOption(option.key!)}
              icon={<span>&times;</span>}
            >
              删除选项
            </Button>)}

            <Divider style={{marginTop: '10px', marginBottom: '10px'}}/>
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
export default EditQuestionModal;
