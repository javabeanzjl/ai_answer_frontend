import React, {useRef, useState} from "react";
import {type ActionType, PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import {message, Modal, Space, Typography} from "antd";

import {
  deleteUserAnswerUsingPost,
  listMyUserAnswerVoByPageUsingPost,
  listUserAnswerByPageUsingPost
} from "@/services/backend/userAnswerController";
import {history} from "@umijs/max";

const UserAnswerResultPage: React.FC = () => {

  // 是否显示审核窗口
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.App>();

  const [reviewStatus, setReviewStatus] = useState<number>(0);

  // 用于控制弹出框的显示与隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 存储当前点击的题目内容
  const [currentQuestionContent, setCurrentQuestionContent] = useState<string | null>(null);
  const [userAnswerVOList, setUserAnswerVOList] = useState<API.UserAnswerVO[]>([]);
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


  const handleDelete = async (row: API.App) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      console.log(row)
      await deleteUserAnswerUsingPost({
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
  const isAppTypeEvaluation = (record: { appType: number; }) => record.appType === 0; // 判断是否为得分类

  const resultScoreColumn = {
    title: '结果分数',
    dataIndex: 'resultScore',
    valueType: 'text',
    // 你可以在这里添加一个条件来决定是否渲染内容
    // 如果是测评类，不渲染内容
    render: (text: any, record: any) => (isAppTypeEvaluation(record) ? text : null),
  };
  // 其他列定义保持不变...
  const otherColumns: ProColumns<API.UserAnswerVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '结果名称',
      dataIndex: 'resultName',
      valueType: 'text',
    },
    {
      title: '结果描述',
      dataIndex: 'resultDesc',
      valueType: 'text',
    },
    {
      title: '结果图片',
      dataIndex: 'resultPicture',
      valueType: 'text',
    },
    {
      title: '用户答案',
      dataIndex: 'choices',
      valueType: 'text',
      hideInSearch: true,
      render: (text, record, index, action) => {
        return text;
      },
    },
    {
      title: '应用Id',
      dataIndex: 'appId',
      valueType: 'text',
    },
    {
      title: '应用类型',
      dataIndex: 'appType',
      valueEnum: {
        0: {
          text: '得分类',
        },
        1: {
          text: '测评类',
        },
      },
    },
    {
      title: '评分策略',
      dataIndex: 'scoringStrategy',
      valueEnum: {
        0: {
          text: '自定义',
        },
        1: {
          text: 'AI',
        },
      },
    },
    {
      title: '用户id',
      dataIndex: 'userId',
      valueType: 'text',
      hideInSearch: true,
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
          <Typography.Link onClick={() => history.push(`/app/answer/result/${record.id}`)}>
            查看
          </Typography.Link>
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];

  const userAnswerColumnIndex = otherColumns.findIndex(column => column.title === '用户答案');
  if (userAnswerColumnIndex !== -1) {
    // 在“用户答案”列后面插入“结果分数”列
    otherColumns.splice(userAnswerColumnIndex + 1, 0, resultScoreColumn);
  } else {
    // 如果找不到“用户答案”列，则将“结果分数”列添加到数组末尾
    otherColumns.push(resultScoreColumn);
  }
  const columns = userAnswerVOList.some(isAppTypeEvaluation) ? otherColumns : otherColumns.filter(column => column.title !== '结果分数');

  return (
    <>
      <PageContainer>
        <ProTable<API.UserAnswerVO>
          headerTitle={'结果列表'}
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
            const pageSize = 5;

            const {data, code} = await listMyUserAnswerVoByPageUsingPost({
              ...params,
              sortField: 'updateTime',
              sortOrder: 'descend',
              pageSize,
              ...filter,
            } as API.UserAnswerQueryRequest);

            setUserAnswerVOList(data?.records || []);
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
        title="结果内容"
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
export default UserAnswerResultPage;
