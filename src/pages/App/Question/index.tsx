import React, {useEffect, useRef, useState} from "react";
import {PageContainer, ProTable} from "@ant-design/pro-components";
import {Button, Divider, Form, Input, message, Modal, Radio, Select, Space, Typography} from "antd";
import {
  editQuestionUsingPost,
  listQuestionVoByPageUsingPost,
} from "@/services/backend/questionController";
import {getAppVoByIdUsingGet} from "@/services/backend/appController";
import {useParams} from "react-router";
import {PlusOutlined} from "@ant-design/icons";
import AddScoringResultModal from "@/pages/App/Score/components/AddScoringResultModal";
import AddQuestionResultModal from "@/pages/App/Question/components/AddQuestionModal";
import EditQuestionModal from "@/pages/App/Question/components/EditQuestionModal";

const QuestionVOManagementPage: React.FC = () => {
  const {id} = useParams();
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


  const showModal = (record: { options: API.Option[] }) => {
    setIsModalVisible(true);
    if (record && record.options) {
      const usedKeys = record.options.map(option => option.key);
      const availableKeys = optionKeys.filter(key => !usedKeys.includes(key));
      setAvailableOptionKeys(availableKeys);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setOptions([]);
  };


  const optionKeys = ['A', 'B', 'C', 'D'];

  const [form] = Form.useForm();

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
              id: Number(id),
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

  // 打开修改窗口时需要加载的数据
  const showEditModal = (record: any) => {
    setIsEditModalVisible(true);
    setCurrentQuestion(record);
    // 初始化表单值，包括所有选项
    console.log(record.options)
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

  const loadData = async () => {
    const res = await getAppVoByIdUsingGet({id: Number(id)});
    const {data} = await listQuestionVoByPageUsingPost({
      appId: Number(id),
    });
    setQuestionContentDTO(data?.records?.[0]?.questionContent || []);
    if (res.data) {
      setAppType(res.data.appType ?? undefined);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const usedKeys = currentRow?.options?.map((option: { key: any; }) => option.key) || [];
    const availableKeys = optionKeys.filter(key => !usedKeys.includes(key));
    setAvailableOptionKeys(availableKeys);
  }, [currentRow, options]);

  AddScoringResultModal

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
            handleDeleteQuestion(record, index);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <>
      <PageContainer>
        <ProTable
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
            <Button type="primary" key="primary" onClick={showModal}>
              <PlusOutlined/> 添加题目
            </Button>,
          ]}
        />
      </PageContainer>
      <AddQuestionResultModal
        id={Number(id)}
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
        questionContentDTO={questionContentDTO}/>

      <EditQuestionModal
        id={Number(id)}
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
        setCurrentQuestion={setCurrentQuestion}
        currentQuestion={currentQuestion}
      ></EditQuestionModal>
    </>
  );
};
// @ts-ignore
export default QuestionVOManagementPage;
