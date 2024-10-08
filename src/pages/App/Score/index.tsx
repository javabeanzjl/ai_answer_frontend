import React, {useEffect, useRef, useState} from "react";
import {PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import {Button, Divider, Form, Input, InputNumber, message, Modal, Radio, Select, Space, Typography} from "antd";
import {getAppVoByIdUsingGet, listAppByPageUsingPost} from "@/services/backend/appController";
import {useParams} from "react-router";
import {DotChartOutlined, PlusOutlined} from "@ant-design/icons";
import AddScoringResultModal from "@/pages/App/Score/components/AddScoringResultModal";
import EditScoringResultModal from "@/pages/App/Score/components/EditScoringResultModal";
import {
  createScoringResultByAiUsingPost,
  deleteScoringResultUsingPost,
  listScoringResultVoByPageUsingPost
} from "@/services/backend/scoringResultController";
import {history} from "@@/core/history";

const ScoringResultVOPage: React.FC = () => {
  const {id} = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [scoringResultList, setScoringResultList] = useState<API.ScoringResultVO[]>([]);
  const [options, setOptions] = useState<API.Option[]>([]);
  const [appType, setAppType] = useState<number>();
  const actionRef = useRef<any>();
  // @ts-ignore
  const [availableOptionKeys, setAvailableOptionKeys] = useState<API.ScoringResultVO[]>(optionKeys);
  const [oldNewOptions, setOldNewOptions] = useState<API.Option[]>([]);
// 新增状态和方法用于编辑题目
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentScoringResult, setCurrentScoringResult] = useState<API.ScoringResultVO | null>(null);

  const [scoringResultId, setScoringResultId] = useState(0);

  const [isParameter, setIsParameter] = useState(false);
  const [parameterForm] = Form.useForm();
  const [scoringResultNum, setScoringResultNum] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);


  const showModal = (record: { options: API.Option[] }) => {
    Modal.confirm({
      title: '请选择评分结果创建方式',
      content: (
        <Radio.Group>
          <Radio value="manual">手动创建</Radio>
          <Radio value="ai">AI生成</Radio>
        </Radio.Group>
      ),
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        // 获取用户的选择
        const value = (document.querySelector('.ant-radio-group input:checked') as HTMLInputElement).value;
        if (value === 'manual') {
          // 用户选择手动创建，弹出对话框
          setIsModalVisible(true);
        } else if (value === 'ai') {
          // 用户选择AI生成，调用后端接口
          console.log("success")
          setIsParameter(true)
        }
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    createForm.resetFields();
    setOptions([]);
  };


  const optionKeys = ['A', 'B', 'C', 'D'];

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const handleDeleteScoringResult = async (record: any, index: number) => {
    // 弹出确认对话框
    Modal.confirm({
      title: '确认删除此评分结果吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 调用删除题目的API
          // await deleteQuestionUsingPost({ id: record.id });
          const res = await deleteScoringResultUsingPost({
            id: record.id
          })
          // 删除成功后，更新本地状态，移除对应的题目
          if (res.data === true) {
            // 可以选择重新加载数据或者仅更新本地状态
            actionRef.current.reload();
            message.success('题目评分那结果成功');
          }
        } catch (error) {
          message.error('题目删除失败');
        }
      },
    });
  };

  // 打开修改窗口时需要加载的数据
  const showEditModal = (record: API.ScoringResultVO) => {
    setIsEditModalVisible(true);
    console.log(record)
    setCurrentScoringResult(record);
    // 初始化表单值，包括所有选项
    if (record.resultProp) {
      const initialValues = {
        appId: record.appId,
        id: record.id,
        resultDesc: record.resultDesc,
        resultName: record.resultName,
        resultPicture: record.resultPicture,
        resultProp: record.resultProp,
        resultScoreRange: record.resultScoreRange,
        userId: record.userId
      };
      console.log(initialValues)
      editForm.setFieldsValue(initialValues);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
  };

  const loadData = async () => {
    const res = await getAppVoByIdUsingGet({id: id as any});

    if (res.data) {
      setAppType(res.data.appType ?? undefined);
    }
  }

  const invokeAiGenerate = async (scoringResultNum: number) => {
    // 用户选择AI生成，调用后端接口
    try {
      setIsGenerating(false)
      setIsParameter(false)
      const res = await createScoringResultByAiUsingPost({
        appId: id as any,
        scoringResultNum: scoringResultNum
      })
      if (res.data) {
        // 生成题目成功，更新本地状态
        setIsGenerating(true)
        loadData();
        message.success('评价信息正在生成中，请于稍后刷新查看');
      }
    } catch (e) {
      message.error('AI生成评价失败');
    }
  }
  ``
  useEffect(() => {
    loadData();
  }, []);

  const columns: ProColumns<API.ScoringResultVO>[] = [
    {
      title: '结果名称',
      dataIndex: 'resultName',
      valueType: 'textarea',
    },
    {
      title: '结果描述',
      dataIndex: 'resultDesc',
      valueType: 'textarea',
    },

    {
      title: '结果图片',
      dataIndex: 'resultPicture',
      valueType: 'textarea',
    },
    {
      title: '结果属性集',
      dataIndex: 'resultProp',
      valueType: 'textarea',
      renderText: (text: string) => {
        return JSON.stringify(text);
      }
    },
    {
      title: '结果分数范围',
      dataIndex: 'resultScoreRange',
      valueType: 'textarea',
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
            handleDeleteScoringResult(record, index);
          }}
        >
          删除
        </a>,
      ],
    },
  ];


  return (
    <>
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
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          dataSource={scoringResultList}
          request={async (params, sort, filter) => {
            const sortField = Object.keys(sort)?.[0];
            const sortOrder = sort?.[sortField] ?? undefined;
            const pageSize = 5;
            console.log(sortField)
            console.log(sortOrder)
            const {data, code} = await listScoringResultVoByPageUsingPost({
              ...params,
              appId: id,
              sortField: "updateTime",
              sortOrder: "descend",
              pageSize,
              ...filter,
            } as API.ScoringResultQueryRequest);
            setScoringResultList(data?.records || []);
            setScoringResultId(data?.records?.[0]?.id || 0);
            return {
              success: code === 0,
              data: data?.records || [],
              total: Number(data?.total) || 0,
            };
          }}
          // 开启分页
          pagination={{
            pageSize: 5, // 设置每页显示的条数
          }}
          toolBarRender={() => [
            // @ts-ignore
            <Button type="primary" key="primary" onClick={showModal}>
              <PlusOutlined/> 添加结果集
            </Button>,
          ]}
        />
      </PageContainer>
      <AddScoringResultModal
        id={id as any}
        visible={isModalVisible}
        onSubmit={() => {
          setIsModalVisible(false);
          actionRef.current?.reload();
          createForm.resetFields();
        }}
        form={createForm}
        handleCancel={handleCancel}
        appType={appType}
        currentRow={currentRow}
        scoringResultId={scoringResultId}
        setScoringResultId={setScoringResultId}
      />

      <EditScoringResultModal
        id={scoringResultId}
        visible={isEditModalVisible}
        onSubmit={() => {
          setIsEditModalVisible(false);
          actionRef.current?.reload();
          editForm.resetFields();
        }}
        appType={appType}
        form={editForm}
        onCancel={handleEditCancel}
        scoringResultVO={currentScoringResult}
      ></EditScoringResultModal>
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
            label="评价数量："
            style={{display: 'flex', alignItems: 'center'}}
          >
            <div style={{display: 'flex', alignItems: 'center'}}>
              <InputNumber
                onChange={(value) => {
                  setScoringResultNum(Number(value) ?? 0);
                }}
              />
              <div style={{marginLeft: 10}}>提示：请输入1到10之间的数字</div>
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
            if (scoringResultNum > 10 || scoringResultNum < 1) {
              message.error('评价数量请输入1到10之间的数字');
              return;
            }
            invokeAiGenerate(scoringResultNum)
          }}>ai一键生成</Button>
        </div>
      </Modal>
    </>
  );
};

export default ScoringResultVOPage;
