import {ProColumns, ProTable} from '@ant-design/pro-components';
import '@umijs/max';
import {message, Modal} from 'antd';
import React from 'react';
import {editAppUsingPost, updateAppUsingPost} from "@/services/backend/appController";

interface Props {
  oldData?: API.AppVO;
  visible: boolean;
  columns: ProColumns<API.AppVO>[];
  onSubmit: (values: API.AppEditRequest) => void;
  onCancel: () => void;
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.AppEditRequest) => {
  const hide = message.loading('正在更新');
  try {
    await editAppUsingPost(fields);
    hide();
    message.success('更新成功');
    return true;
  } catch (error: any) {
    hide();
    message.error('更新失败，' + error.message);
    return false;
  }
};

/**
 * 更新弹窗
 * @param props
 * @constructor
 */
const EditModal: React.FC<Props> = (props) => {
  const {oldData, visible, columns, onSubmit, onCancel} = props;
  const editColumns: ProColumns<API.AppVO>[] = [
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
      title: '应用图标',
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
      render: (text, record, _, action) => {
        console.log(record)
        return text;
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
      hideInForm: true,
      render: (text, record, _, action) => text,
    },
    {
      title: '用户id',
      dataIndex: 'userId',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
  ];
  if (!oldData) {
    return <></>;
  }

  return (
    <Modal
      destroyOnClose
      title={'更新'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <ProTable
        type="form"
        columns={editColumns}
        form={{
          initialValues: oldData,
        }}
        onSubmit={async (values: API.AppEditRequest) => {
          const success = await handleUpdate({
            ...values,
            id: oldData.id as any,
          });
          if (success) {
            onSubmit?.(values);
          }
        }}
      />
    </Modal>
  );
};
export default EditModal;
