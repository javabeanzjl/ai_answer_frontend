import React, {useEffect, useRef, useState} from "react";
import {PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import {Button, Divider, Form, Input, message, Modal, Radio, Select, Space, Typography} from "antd";
import {getAppVoByIdUsingGet, listAppByPageUsingPost} from "@/services/backend/appController";
import {useParams} from "react-router";
import {PlusOutlined} from "@ant-design/icons";
import AddScoringResultModal from "@/pages/App/Score/components/AddScoringResultModal";
import EditScoringResultModal from "@/pages/App/Score/components/EditScoringResultModal";
import {
  deleteScoringResultUsingPost,
  listScoringResultVoByPageUsingPost
} from "@/services/backend/scoringResultController";

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


  const showModal = (record: { options: API.Option[] }) => {
    setIsModalVisible(true);
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
    const res = await getAppVoByIdUsingGet({id: Number(id)});

    if (res.data) {
      setAppType(res.data.appType ?? undefined);
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
              sortField: "updateTime",
              sortOrder: "descend",
              pageSize,
              ...filter,
            } as API.ScoringResultQueryRequest);
            setScoringResultList(data?.records || []);
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
        id={Number(id)}
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
      />

      <EditScoringResultModal
        id={Number(id)}
        visible={isEditModalVisible}
        onSubmit={() => {
          setIsEditModalVisible(false);
          actionRef.current?.reload();
          editForm.resetFields();
        }}
        appType={appType}
        onCancel={handleEditCancel}
        scoringResultVO={currentScoringResult}
      ></EditScoringResultModal>
    </>
  );
};

export default ScoringResultVOPage;
