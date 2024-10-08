import React, {useEffect, useRef, useState} from "react";
import {PageContainer, ProTable} from "@ant-design/pro-components";
import {Button, Divider, Form, Input, InputNumber, message, Modal, Radio, Select, Space, Spin, Typography} from "antd";

import {getAppVoByIdUsingGet} from "@/services/backend/appController";
import {useParams} from "react-router";
import {DotChartOutlined, ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import AddQuestionResultModal from "@/pages/App/Question/components/AddQuestionModal";
import EditQuestionModal from "@/pages/App/Question/components/EditQuestionModal";
import {history, useModel} from '@umijs/max';
import {
  createQuestionByAiUsingPost,
  editQuestionUsingPost,
  listQuestionVoByPageUsingPost
} from "@/services/backend/questionController";
import {generateSnowFlakeNextIdUsingGet} from "@/services/backend/baseController";
import {getInvokeCountUsingGet, validateUserInvokeCountUsingGet} from "@/services/backend/userController";

const QuestionVOManagementPage: React.FC = () => {
  const {id} = useParams();
  // 获取登录用户
  const {initialState, setInitialState} = useModel('@@initialState');
  const [userId, setUserId] = useState<number>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [questionContentDTO, setQuestionContentDTO] = useState<API.QuestionContentDTO[]>([]);
  const [options, setOptions] = useState<API.Option[]>([]);
  const [appType, setAppType] = useState<number>();
  const actionRef = useRef<any>();
  // @ts-ignore
  const [availableOptionKeys, setAvailableOptionKeys] = useState<string[]>(optionKeys);
  // 新增状态和方法用于编辑题目
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<API.QuestionContentDTO | null>(null);
  const [questionId, setQuestionId] = useState(0);
  // 临时的questionList
  const [questionList, setQuestionList] = useState<API.QuestionContentDTO[]>([]);
  const [aiAddQuestionModalVisible, setAiAddQuestionModalVisible] = useState(false);
  const modalActionRef = useRef<any>();
  const [aiGenerateType, setAiGenerateType] = useState('ai_one_click');
  const [isLoading, setIsLoading] = useState(false);
  const [isParameter, setIsParameter] = useState(false);
  const [questionNum, setQuestionNum] = useState(0);
  const [optionNum, setOptionNum] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  // 设置倒计时秒数
  const [countdown, setCountdown] = useState(40);
  // 时时生成题目的Modal状态
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(true);

  const getQuestionContent = async (questionNum: number, optionNumber: number) => {

    const baseUrl = "http://localhost:7529/api/question/add/sse";
    const url = `${baseUrl}?appId=${id}&questionNum=${questionNum}&optionNum=${optionNumber}&userId=${userId}`;
    const eventSource = new EventSource(url)
    eventSource.onmessage = (event) => {
      setIsGeneratingQuestion(false)
      const data = JSON.parse(event.data);
      questionList.push(data)
      modalActionRef?.current?.reload();
    }
    // 处理可能发生的错误
    eventSource.onerror = (error) => {
      // 关闭 EventSource 连接
      eventSource.close();
    };

    // 组件卸载时关闭 EventSource 连接
    return () => {
      eventSource.close();
    };

  }
  const showModal = async () => {

    Modal.confirm({
      title: '请选择题目创建方式',
      content: (
        <Radio.Group>
          <Radio value="manual">手动创建</Radio>
          <Radio value="ai">ai创建</Radio>
        </Radio.Group>
      ),
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {

        // 获取用户的选择
        const value = (document.querySelector('.ant-radio-group input:checked') as HTMLInputElement).value;
        setAiGenerateType(value)
        if (value === 'manual') {
          // 用户选择手动创建，弹出对话框
          setIsModalVisible(true);
        } else if (value === 'ai') {
          setIsParameter(true)
        }
      },
    });
  };

  const invokeAiGenerate = async (questionNum: number, optionNum: number) => {
    // 用户选择AI生成，调用后端接口
    try {
      setIsGenerating(true)
      setIsParameter(false)
      const res = await createQuestionByAiUsingPost({
        id: questionId,
      }, {
        appId: id as any,
        questionNum: questionNum,
        optionNum: optionNum
      })
      if (res.data) {
        // 生成题目成功，更新本地状态
        message.success('AI生成题目正在生成中，请于稍后刷新查看');
      } else if (res.code === 50000) {
        setIsGenerating(false)
      }
    } catch (e) {
      message.error('AI生成题目失败');
    }
  }
  const invokeAiGenerateSSE = async (questionNum: number, optionNumber: number) => {
    // 用户选择AI实时生成，调用后端接口
    const res = await validateUserInvokeCountUsingGet({
      id: userId,
    })
    if (!res.data) {
      setIsGeneratingQuestion(false)
      setAiAddQuestionModalVisible(false)
      message.error("用户调用次数不足")
      return;
    }
    setAiAddQuestionModalVisible(true)
    await getQuestionContent(questionNum, optionNumber)
  }

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setOptions([]);
  };


  const optionKeys = ['A', 'B', 'C', 'D'];

  const [form] = Form.useForm();
  const [parameterForm] = Form.useForm();

  const handleDeleteQuestion = async (record: any, index: number) => {
    // 弹出确认对话框
    Modal.confirm({
      title: '确认删除此题目?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 调用删除题目的API
          // await deleteQuestionUsingPost({ id: record.id });
          // 删除成功后，更新本地状态，移除对应的题目
          setQuestionContentDTO(prevQuestions => {
            const newQuestions = [...prevQuestions];
            newQuestions.splice(index, 1);
            editQuestionUsingPost({
              id: questionId,
              questionContentDTOList: newQuestions,
            })
              .then(() => {
                actionRef.current.reload();
              })
            return newQuestions;
          });
          // 可以选择重新加载数据或者仅更新本地状态
          actionRef.current.reload();
          message.success('题目删除成功');
        } catch (error) {
          message.error('题目删除失败');
        }
      },
    });
  };

  const handleEditQuestion = async (record: any) => {
    const res = await editQuestionUsingPost({
      id: Number(questionId),
      questionContentDTOList: record,
    })
    if (res) {
      message.success("添加成功")
      setQuestionList([])
      actionRef.current?.reload();
      form.resetFields();
    }
  }

  // 打开修改窗口时需要加载的数据
  const showEditModal = (record: any) => {
    setIsEditModalVisible(true);
    setCurrentQuestion(record);
    // 初始化表单值，包括所有选项
    if (record.options) {
      const initialValues = {
        title: record.title.replace(/^\d+\./, ''),
        options: record.options.map((option: API.Option) => ({
          key: option.key,
          value: option.value,
          result: option.result,
          score: option.score,
        })),
      };
      form.setFieldsValue(initialValues);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  // 判断是否有数据变更
  const isDataChanged = async (): Promise<boolean> => {
    const {data} = await listQuestionVoByPageUsingPost({
      appId: id as any,
    });
    const newQuestionNum = data?.records?.[0]?.questionContent?.length ?? 0;
    const oldQuestionNum = questionContentDTO.length ?? 0;
    // 如果新题目数量大于旧题目数量，则说明有数据变更
    const res = newQuestionNum > oldQuestionNum
    if (res) {
      setIsGenerating(false)
      message.success("题目生成成功")
      loadData();
    }
    return res;
  }

  const loadData = async () => {

    setUserId(initialState?.currentUser?.id)
    const res = await getAppVoByIdUsingGet({id: id as any});
    const {data} = await listQuestionVoByPageUsingPost({
      appId: id as any,
    });
    setQuestionContentDTO(data?.records?.[0]?.questionContent || []);

    setQuestionId(data?.records?.[0]?.id || 0);

    if (res.data) {
      setAppType(res.data.appType ?? undefined);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // 如果isGenerating为true，开始倒计时
    if (isGenerating) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      // 当倒计时结束时，清除定时器
      return () => clearInterval(timer);
    }
  }, [isGenerating]);
  useEffect(() => {
    // 当倒计时到达0时，提示用户刷新
    if (countdown % 5 === 0) {
      if (countdown === 0) {
        setCountdown(40);
      }
      isDataChanged();
    }
  }, [countdown]);

  useEffect(() => {
    const usedKeys = currentRow?.options?.map((option: { key: any; }) => option.key) || [];
    const availableKeys = optionKeys.filter(key => !usedKeys.includes(key));
    setAvailableOptionKeys(availableKeys);
  }, [currentRow, options]);
  const getSnowFlakeId = async () => {
    // 获取题目id
    const questionIdData = await generateSnowFlakeNextIdUsingGet();
    setQuestionId(questionIdData.data ?? 0)
  }

  useEffect(() => {
    if (questionContentDTO.length === 0) {
      getSnowFlakeId();
    }
  }, [questionContentDTO]);

  const columns: any[] = [
    {
      title: '题目描述',
      dataIndex: 'title',
      valueType: 'textarea',
    },
    {
      title: '题目选项',
      dataIndex: 'options',
      render: (text: any, record: { options: API.Option[]; }) => (
        <Space size="middle">
          {record.options?.map((option: API.Option, index: number) => (
            <div key={index}>{option.key}.{option.value}</div>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text: any, record: any, index: number) => [
        <a
          key="edit"
          onClick={() => {
            showEditModal(record);
          }}
        >
          修改
        </a>,
        <Divider type="vertical"/>,
        <a
          key="delete"
          onClick={() => {
            if (aiAddQuestionModalVisible) {
              // 临时删除
              setQuestionList((prevQuestions: any[]) => {
                const newQuestions = [...prevQuestions];
                newQuestions.splice(index, 1);
                return newQuestions;
              });
            } else {
              handleDeleteQuestion(record, index);
            }
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', marginLeft: '40px'}}>
        <Button
          type="primary"
          style={{
            backgroundColor: "#333", // 按钮背景色，根据图片调整
            color: "white", // 文字颜色，根据图片调整
            borderColor: "#333", // 边框颜色，根据图片调整
            height: "30px", // 按钮高度，根据图片调整
            lineHeight: "1.5", // 行高，用于垂直居中文本
            padding: "0 15px", // 内边距，根据图片调整
          }}
          onClick={() => {
            history.push(`/app/detail/${id}`);
          }}
        >
          <DotChartOutlined/>返回应用详情页
        </Button></div>
      <PageContainer>
        <ProTable
          // loading={isGenerating}
          headerTitle={'题目管理'}
          actionRef={actionRef}
          rowKey="id"
          pagination={false}
          search={false}
          columns={columns}
          dataSource={questionContentDTO}
          // @ts-ignore
          request={loadData}
          toolBarRender={() => [
            // @ts-ignore
            <>{isGenerating && <>
              <Spin/>
              正在生成题目，请稍等 {countdown}秒后刷新
              {countdown === 0 && <ExclamationCircleOutlined/>}
            </>}</>,
            <>{<Button type="primary" key="primary" onClick={showModal}>
              <PlusOutlined/> 添加题目
            </Button>}</>,
          ]}
        />
      </PageContainer>
      <AddQuestionResultModal
        id={id as any}
        visible={isModalVisible}
        onSubmit={() => {
          setIsModalVisible(false);
          actionRef.current?.reload();
          form.resetFields();
        }}
        setOptions={setOptions}
        form={form}
        handleCancel={handleCancel}
        appType={appType}
        availableOptionKeys={availableOptionKeys}
        options={options}
        currentRow={currentRow}
        questionContentDTO={questionContentDTO}
        questionId={questionId}/>

      <EditQuestionModal
        id={questionId}
        visible={isEditModalVisible}
        onSubmit={() => {
          setIsEditModalVisible(false);
          actionRef.current?.reload();
          form.resetFields();
        }}
        setOptions={setOptions}
        form={form}
        handleEditCancel={handleEditCancel}
        appType={appType}
        availableOptionKeys={availableOptionKeys}
        options={options}
        currentRow={currentRow}
        questionContentDTO={questionContentDTO}
        setQuestionContentDTO={setQuestionContentDTO}
        setCurrentQuestion={setCurrentQuestion}
        currentQuestion={currentQuestion}
        aiGenerateType={aiGenerateType}
        questionList={questionList}
        setQuestionList={setQuestionList}
      ></EditQuestionModal>

      <Modal
        visible={aiAddQuestionModalVisible}
        onOk={function () {
          questionList.map(question => {
            questionContentDTO.push(question)
          })
          // 真正更新数据库
          handleEditQuestion(questionContentDTO).then(r => {
            actionRef.current?.reload();
          });
          setAiAddQuestionModalVisible(false);
        }}
        onCancel={function () {
          setAiAddQuestionModalVisible(false);
        }}
      >
        <ProTable
          loading={isGeneratingQuestion}
          headerTitle={'生成题目管理'}
          actionRef={modalActionRef}
          rowKey="newId"
          pagination={false}
          search={false}
          columns={columns}
          dataSource={questionList}
          // @ts-ignore
        />
      </Modal>
      <Modal
        visible={isParameter}
        onOk={() => {
          parameterForm.resetFields()
        }}
        onCancel={() => {
          setIsParameter(false)
        }}
        footer={null}
      >
        <Form
          style={{
            marginTop: 10,
            marginBottom: 10
          }}
          form={parameterForm}
        >
          <Form.Item
            label="题目数量："
            style={{display: 'flex', alignItems: 'center'}}
          >
            <div style={{display: 'flex', alignItems: 'center'}}>
              <InputNumber
                onChange={(value) => {
                  setQuestionNum(Number(value) ?? 0);
                }}
              />
              <div style={{marginLeft: 10}}>提示：请输入1到10之间的数字</div>
            </div>
          </Form.Item>
          <Form.Item
            label="选项数量："
            style={{display: 'flex', alignItems: 'center'}}
          >
            <div style={{display: 'flex', alignItems: 'center'}}>
              <InputNumber
                onChange={(value) => {
                  setOptionNum(Number(value) ?? 0);
                }}
              />
              <div style={{marginLeft: 10}}>提示：请输入1到4之间的数字</div>
            </div>
          </Form.Item>
        </Form>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 10,
          }}
        >
          <Button onClick={() => {
            if (questionNum > 10 || questionNum < 1) {
              message.error('题目数量请输入1到10之间的数字');
              return;
            }
            if (optionNum > 4 || optionNum < 1) {
              message.error('选项数量请输入1到4之间的数字');
              return;
            }
            invokeAiGenerate(questionNum, optionNum)
          }}>ai一键生成</Button>

          <Button onClick={() => {
            if (questionNum > 10 || questionNum < 1) {
              message.error('题目数量请输入1到10之间的数字');
              return;
            }
            if (optionNum > 4 || optionNum < 1) {
              message.error('选项数量请输入1到4之间的数字');
              return;
            }
            setIsParameter(false);
            invokeAiGenerateSSE(questionNum, optionNum)
          }}>ai时时生成</Button>
        </div>
      </Modal>

    </div>
  );
};
// @ts-ignore
export default QuestionVOManagementPage;
