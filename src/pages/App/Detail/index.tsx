import React, {useEffect, useRef, useState} from "react";
import {Button, Card, Col, Flex, Form, Input, message, Modal, Row, Select, Space, Typography} from "antd";
import {getAppVoByIdUsingGet, updateAppUsingPost} from "@/services/backend/appController";
import {useParams} from "react-router";
import {getLoginUserUsingGet} from "@/services/backend/userController";
import {ActionType, ProColumns} from "@ant-design/pro-components";
import EditModal from "@/pages/App/Detail/components/EditModal";
import {Link} from "umi";

const AppDetail: React.FC = () => {

  const {id} = useParams();
  const [appInfo, setAppInfo] = React.useState<API.AppVO>();
  const [currentUser, setCurrentUser] = React.useState<API.UserVO | null>(null);
  const [isUserOrAdmin, setIsUserOrAdmin] = React.useState<boolean>(false);
  const [editModalVisble, setEditModalVisble] = useState<boolean>(false);
  // 当前登录用户
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.AppVO>();


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
      render: (text, record, index, action) => {
        // 在表格中显示枚举值
        return <>{text === 0 ? '得分类' : '测评类'}</>;
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
      render: (text, record, index, action) => {
        // 在表格中显示枚举值
        return <>{text === 0 ? '自定义' : 'AI'}</>;
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
      hideInForm: true,    },
  ];

  const formatTime = (timestamp: string | undefined) => {
    if (!timestamp) {
      return;
    }
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  const loadData = async () => {
    const res = await getAppVoByIdUsingGet({
      id: Number(id)
    })
    if (res.data) {
      setAppInfo(res.data)
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (appInfo) {
      verifyIdentity();
    }
  }, [appInfo]); // 添加appInfo作为依赖项

  const verifyIdentity = async () => {
    const res = await getLoginUserUsingGet();
    if (res.data) {
      setCurrentUser(res.data);
      console.log(res.data)
      console.log(appInfo?.userId)
      console.log(appInfo)
      console.log(res.data.id === appInfo?.userId || res.data.userRole === 'admin')
      if (res.data.id === appInfo?.userId || res.data.userRole === 'admin') {
        setIsUserOrAdmin(true);
      } else {
        setIsUserOrAdmin(false);
      }
    }
  }

  return (
    <>
      <Card
        title={
          <span style={{fontSize: '25px'}}>{appInfo?.appName}</span>
        }
        style={{fontSize: '18px'}}
      >
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <div>
              <p style={{fontSize: 16}}>{appInfo?.appDesc}</p>
              <p style={{fontSize: 16}}>应用类型：{appInfo?.appType === 0 ? '得分类' : '测评类'}</p>
              <p style={{fontSize: 16}}>评分策略：{appInfo?.scoringStrategy === 0 ? '自定义' : 'AI'}</p>
              <p style={{fontSize: 16}}>作者：{appInfo?.userVO?.userName}</p>
              <p style={{fontSize: 16}}>创建时间：{formatTime(appInfo?.createTime)}</p>
            </div>
            <Flex gap="middle" wrap>
              <Link to = {`/app/${appInfo?.id}/test`}>
                <Button type="primary" onClick={() => {
                  // 跳转到题目页面
                }}>开始测试</Button>
              </Link>
              <Button>分享应用</Button>
              {isUserOrAdmin && (
                <>
                  <Link to = {`/app/${appInfo?.id}/questions`}>
                    <Button type="dashed" onClick={() => {
                      // 跳转到题目页面
                    }}>设置题目</Button>
                  </Link>

                  <Link to = {`/app/${appInfo?.id}/scoringResults`}>
                    <Button type="dashed" onClick={() => {
                      // 跳转到评分页面
                    }}>设置评分</Button>
                  </Link>
                  <Button type="dashed" onClick={() => {
                    setEditModalVisble(true)
                  }}>修改应用</Button>
                </>
              )}
            </Flex>
          </Col>
          <Col span={8}>
            <img src={appInfo?.appIcon} alt="应用图片" style={{width: '100%', height: 'auto'}}/>
          </Col>
        </Row>
        <EditModal
          visible={editModalVisble}
          columns={columns}
          oldData={appInfo}
          onSubmit={() => {
            setEditModalVisble(false);
            setCurrentRow(undefined)
            loadData();
          }}
          onCancel={() => {
            setEditModalVisble(false);
          }}
        />
      </Card>
    </>
  )
}
export default AppDetail;
