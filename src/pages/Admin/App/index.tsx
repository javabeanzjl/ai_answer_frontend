import React, {useRef, useState} from "react";
import {type ActionType, PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import {Button, message, Space, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {deleteAppUsingPost, listAppByPageUsingPost, listAppVoByPageUsingPost} from "@/services/backend/appController";
import UpdateModal from "@/pages/Admin/User/components/UpdateModal";
import ReviewModal from "@/pages/Admin/App/components/ReviewModal";

const AppPage: React.FC = () => {

  // 是否显示审核窗口
  const [reviewModalVisible, setReviewModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.App>();

  const [reviewStatus, setReviewStatus] = useState<number>(0);
  const handleDelete = async (row: API.App) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      console.log(row)
      await deleteAppUsingPost({
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
  const columns: ProColumns<API.App>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '应用名',
      dataIndex: 'appName',
      valueType: 'text',
    },
    {
      title: '应用描述',
      dataIndex: 'appDesc',
      valueType: 'textarea',
    },
    {
      title: '应用图表',
      dataIndex: 'appIcon',
      valueType: 'image',
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
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
      title: '审核状态',
      dataIndex: 'reviewStatus',
      valueEnum: {
        1: {
          text: '通过',
        },
        2: {
          text: '未通过',
        },
        0: {
          text: '待审核',
        },
      },
    },
    {
      title: '审核信息',
      dataIndex: 'reviewMessage',
      valueType: 'text',
    },
    {
      title: '审核人id',
      dataIndex: 'reviewerId',
      valueType: 'text',
    },
    {
      title: '用户id',
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
          {(record.reviewStatus === 0 || record.reviewStatus === 2) && (
            <Typography.Link
              onClick={() => {
                // 这里可以添加通过的操作逻辑
                setReviewModalVisible(true)
                setCurrentRow({
                  ...record,
                  reviewStatus: 1,
                });
              }}
            >
              通过
            </Typography.Link>
          )}
          {(record.reviewStatus === 0 || record.reviewStatus === 1) && (
            <Typography.Link
              onClick={() => {
                // 这里可以添加拒绝的操作逻辑
                setReviewModalVisible(true)
                setCurrentRow({
                  ...record,
                  reviewStatus: 2,
                });
              }}
            >
              拒绝
            </Typography.Link>
          )}
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];

  const reviewColumns: ProColumns<API.App>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '审核人id',
      dataIndex: 'reviewerId',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
      valueEnum: {
        0: {
          text: '待审核',
        },
        1: {
          text: '通过',
        },
        2: {
          text: '未通过',
        },
      },
    },
    {
      title: '审核信息',
      dataIndex: 'reviewMessage',
      valueType: 'text',
    },
  ];


  return (
    <>
      <PageContainer>
        <ProTable<API.App>
          headerTitle={'应用管理'}
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

            const {data, code} = await listAppByPageUsingPost({
              ...params,
              sortField: "updateTime",
              sortOrder: "descend",
              pageSize,
              ...filter,
            } as API.AppQueryRequest);

            return {
              success: code === 0,
              data: data?.records || [],
              total: Number(data?.total) || 0,
            };
          }}
          columns={columns}
        />
        <ReviewModal
          visible={reviewModalVisible}
          columns={reviewColumns}
          oldData={currentRow}
          onSubmit={() => {
            setReviewModalVisible(false);
            setCurrentRow(undefined)
            actionRef.current?.reload();
          }}
          onCancel={() => {
            setReviewModalVisible(false);
          }}
        />
      </PageContainer>
    </>
  )
}
export default AppPage;
