import React, {useEffect, useRef, useState} from "react";
import {Alert, Button, Card, Col, Flex, message, Modal, QRCode, Row, Spin, Tooltip} from "antd";
import {deleteAppUsingPost, getAppVoByIdUsingGet} from "@/services/backend/appController";
import {useParams} from "react-router";
import {getLoginUserUsingGet} from "@/services/backend/userController";
import {ActionType, ProColumns} from "@ant-design/pro-components";
import EditModal from "@/pages/App/Detail/components/EditModal";
import {Link} from "umi";
import {getQuestionVoByAppIdUsingPost, getQuestionVoByIdUsingGet} from "@/services/backend/questionController";
import {history} from "umi";
// @ts-ignore
import {generatePoster} from "@/utils/exportUtils";
import ShareModal from "@/pages/App/Detail/components/PosterModal";
import html2canvas from "html2canvas";

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
  const [isTest, setIsTest] = useState<boolean>(false);
  const [posterModalVisible, setPosterModalVisible] = useState<boolean>(false);


  const columns: ProColumns<API.AppVO>[] = [
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
      hideInForm: true,
    },
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

  const tipMessage = () => {
    if (appInfo?.reviewStatus === 0) {
      return "该应用正在审核中，请耐心等待";
    } else if (appInfo?.reviewStatus === 2) {
      return "该应用未通过审核，请修改后重新提交";
    } else if (appInfo?.reviewStatus === 1) {
      if (!isTest) {
        return "该应用还未设置题目或者评分，请修改后重新提交";
      }
      return "立即开始测试";
    }
  }

  const deleteApp = () => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该应用吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const res = await deleteAppUsingPost({
          id: id as any
        });
        if (res.code === 0) {
          message.success('删除成功');
          history.push('/');
        } else {
          message.error('删除失败');
        }
      }
    });
  }

  const loadData = async () => {
    const res = await getAppVoByIdUsingGet({
      id: id as any
    })
    if (res.data) {
      setAppInfo(res.data)
    }
    // 查询数据库
    const questionRes = await getQuestionVoByAppIdUsingPost({
      appId: id as any
    })
    const sum = questionRes?.data?.questionContent?.length;
    const reviewStatus = res?.data?.reviewStatus
    if (sum && sum > 0 && reviewStatus === 1) {
      setIsTest(true)
    }
  }


  const [posterImage, setPosterImage] = useState('');

  // const handleShare = async () => {
  //   // 这里将调用生成海报的函数
  //   setPosterModalVisible(true)
  //   const posterDataUrl = await generatePoster();
  //   setPosterImage(posterDataUrl); // 设置海报图片
  //   setPosterModalVisible(false); // 隐藏加载指示器
  // };

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
      if (res.data.id === appInfo?.userId || res.data.userRole === 'admin') {
        setIsUserOrAdmin(true);
      } else {
        setIsUserOrAdmin(false);
      }
    }
  }
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleShare = async () => {
    const element = document.getElementById('share-element');
    // 使用transform将元素移动到页面之外
    if (element) {
      element.style.position = 'fixed';
      element.style.left = '-9999px';
      element.style.top = '-9999px';
      element.style.width = '300px'; // 设置海报宽度
      element.style.height = '400px'; // 设置海报高度
      element.style.boxSizing = 'border-box';
      element.style.padding = '0px';
      element.style.transform = 'translate(-10000px, -10000px)'; // 移到屏幕外
      const imgDataUrl = await generateShareImage(element);
      // 生成图片后，恢复元素的transform属性
      element.style.transform = '';
      setImageUrl(imgDataUrl);
      setModalVisible(true);
    }

  };
  // 关闭模态框
  const handleCancel = () => {
    setModalVisible(false);
  };
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = '分享图片.png';
    a.click();
    handleCancel(); // 下载后关闭模态框
  };
  const generateShareImage = async (element: any) => {
    const canvas = await html2canvas(element, {
      logging: false, useCORS: true
    });
    return canvas.toDataURL('image/png');
  };


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
              <p style={{fontSize: 16}}>应用描述：{appInfo?.appDesc}</p>
              <p style={{fontSize: 16}}>应用类型：{appInfo?.appType === 0 ? '得分类' : '测评类'}</p>
              <p style={{fontSize: 16}}>评分策略：{appInfo?.scoringStrategy === 0 ? '自定义' : 'AI'}</p>
              <p style={{fontSize: 16}}>审核状态：{
                appInfo?.reviewStatus === 0 ? '待审核' :
                  appInfo?.reviewStatus === 1 ? '通过' :
                    '不通过'
              }</p>
              <p style={{fontSize: 16}}>作者：{appInfo?.userVO?.userName}</p>
              <p style={{fontSize: 16}}>创建时间：{formatTime(appInfo?.createTime)}</p>
            </div>
            <Flex gap="middle" wrap>
              <Tooltip title={tipMessage}
                       style={{
                         boxShadow: 'none',
                         border: 'none',
                       }}
              >
                <Link to={`/app/${appInfo?.id}/test`}>
                  <Button type="primary" disabled={!isTest}>开始测试</Button>
                </Link>
              </Tooltip>
              <Button onClick={handleShare}>分享应用</Button>
              {isUserOrAdmin && (
                <>
                  <Link to={`/app/${appInfo?.id}/questions`}>
                    <Button type="dashed" onClick={() => {
                      // 跳转到题目页面
                    }}>设置题目</Button>
                  </Link>

                  <Link to={`/app/${appInfo?.id}/scoringResults`}>
                    <Button type="dashed" onClick={() => {
                      // 跳转到评分页面
                    }}>设置评分</Button>
                  </Link>
                  <Button type="dashed" onClick={() => {
                    setEditModalVisble(true)
                  }}>修改应用</Button>
                  <Button onClick={deleteApp}>删除应用</Button>
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
        {modalVisible && (
          <Modal
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={[
              <Button key="download" type="primary" onClick={handleDownload}>
                下载图片
              </Button>,
            ]}
          >
            <img src={imageUrl} alt="分享图片" style={{width: '100%'}}/>
          </Modal>
        )}
        <div
          id="share-element"
          style={{
            position: 'absolute',
            left: '-10000px', // 移到屏幕外
            top: '-10000px', // 移到屏幕外
            textAlign: 'center' /* 其他样式 */,
            borderRadius: "8px", // 圆角边框

          }}
        >
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid #ddd", // 下边框线
            }}
          >
            <h1
              style={{
                fontSize: "24px", // 标题字体大小
                fontWeight: "bold", // 加粗标题
                marginBottom: "10px", // 下边距
              }}
            >
              {appInfo?.appName}
            </h1>
            <p
              style={{
                fontSize: "14px", // 描述文本字体大小
                color: "#666", // 文本颜色
                lineHeight: "1.5", // 行高
              }}
            >
              {appInfo?.appDesc}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center", // 内容居中对齐
              alignItems: "center", // 垂直居中对齐
            }}
          >
            <QRCode
              value={window.location.href}
              size={128}
              bgColor="#ffffff" // 二维码背景色
              fgColor="#000000" // 二维码前景色
            />
          </div>
        </div>
      </Card>
    </>
  )
}
export default AppDetail;
