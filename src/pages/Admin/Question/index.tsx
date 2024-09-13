import React, {useRef, useState} from "react";
import {type ActionType, PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import {message, Modal, Space, Typography} from "antd";
import {deleteQuestionUsingPost, listQuestionByPageUsingPost} from "@/services/backend/questionController";

const QuestionPage: React.FC = () => {

  // 是否显示审核窗口
  const [reviewModalVisible, setReviewModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.Question>();

  // 用于控制弹出框的显示与隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 存储当前点击的题目内容
  const [currentQuestionContent, setCurrentQuestionContent] = useState<string | null>(null);
// 弹出框显示与隐藏的切换函数
  const showModal = (content: string) => {
    setCurrentQuestionContent(content);
    setIsModalVisible(true);
  };

  // 弹出框的确认按钮处理函数
  const handleOk = () => {
    setIsModalVisible(false);
  };

  // 弹出框的取消按钮处理函数
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (row: API.Question) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      console.log(row)
      await deleteQuestionUsingPost({
        id: row.id as any,
      });
      hide();
      message.success('删除成功');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };
  /**
   * 表格列配置
   */
  const columns: ProColumns<API.Question>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '应用Id',
      dataIndex: 'appId',
      valueType: 'text',
    },
    {
      title: '题目内容',
      dataIndex: 'questionContent',
      valueType: 'textarea',
      render: (text, record, index, action) => {
        return (
          <Space size="middle">
            <Typography.Link onClick={() => showModal(text as string)}>
              查看内容
            </Typography.Link>
          </Space>
        );
      },
    },
    {
      title: '用户Id',
      dataIndex: 'userId',
      valueType: 'text',
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (

        <Space size="middle">
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageContainer>
        <ProTable<API.Question>
          headerTitle={'题目管理'}
          // 通常用于刷新表格数据
          actionRef={actionRef}
          // 表格行的key值，用于识别哪行发生了变化
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          pagination={{
            pageSize: 5, // 设置每页显示的条数
          }}
          request={async (params, sort, filter) => {
            const sortField = Object.keys(sort)?.[0];
            const sortOrder = sort?.[sortField] ?? undefined;

            const {data, code} = await listQuestionByPageUsingPost({
              ...params,
              sortField,
              sortOrder,
              pageSize: 5,
              ...filter,
            } as API.QuestionQueryRequest);

            return {
              success: code === 0,
              data: data?.records || [],
              total: Number(data?.total) || 0,
            };
          }}
          columns={columns}
        />
      </PageContainer>
      <Modal
        title="题目内容"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="60%"
      >
        {currentQuestionContent && (
          <pre>{JSON.stringify(JSON.parse(currentQuestionContent), null, 2)}</pre>
        )}
      </Modal>
    </>
  )
}
export default QuestionPage;
