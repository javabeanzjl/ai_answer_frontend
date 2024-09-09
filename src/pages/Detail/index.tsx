import React, {useEffect} from "react";
import {Button, Card, Flex} from "antd";
import {getAppVoByIdUsingGet} from "@/services/backend/appController";
import {useParams} from "react-router";

const AppDetail: React.FC = () => {

  const {id} = useParams();
  const [appInfo, setAppInfo] = React.useState<API.AppVO>();

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

  return (
    <>
      <Card
        title={
        <span style={{ fontSize: '25px' }}>{appInfo?.appName}</span>}
        style={{fontSize: '18px'}}
      >
        <p>{appInfo?.appDesc}</p>
        <p>应用类型：{appInfo?.appType === 0 ? '得分类' : '测评类'}</p>
        <p>评分策略：{appInfo?.scoringStrategy === 0 ? '自定义' : 'AI'}</p>
        <p>作者：{appInfo?.userVO?.userName}</p>
        <p>创建时间：{formatTime(appInfo?.createTime)}</p>
      </Card>
      <Card>
        <Flex gap="middle" wrap>
          <Button type="primary">开始测试</Button>
          <Button>分享应用</Button>
        </Flex>
      </Card>
    </>
  )
}
export default AppDetail;
