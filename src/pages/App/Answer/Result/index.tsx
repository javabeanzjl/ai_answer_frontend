import React, {useEffect, useState} from 'react';
import {Result, Button, Card, Row, Col, Breadcrumb, Progress, Tag, Typography} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import {useParams} from "react-router";
import {getUserAnswerVoByIdUsingGet} from "@/services/backend/userAnswerController"; // 假设这是您导出PDF和CSV的工具函数
// @ts-ignore
import {exportCSV, exportPDF} from "@/utils/exportUtils.js";
import {history} from "@umijs/max";

const {Title, Paragraph} = Typography;

const ResultDetail = () => {
  const {id} = useParams();
  const [userAnswerResult, setUserAnswerResult] = useState<API.UserAnswerVO>();

  const handleRetry = () => {
    // 重新进行测试的逻辑
    history.push(`/app/${userAnswerResult?.appId}/test`)
  };

  const handleDownloadPDF = () => {
    exportPDF(userAnswerResult);
  };

  const handleDownloadCSV = () => {
    exportCSV(userAnswerResult);
  };

  const loadData = async () => {
    console.log(id)
    const res = await getUserAnswerVoByIdUsingGet({
      id: id as any
    });
    if (res.data) {
      console.log(res.data)
      setUserAnswerResult(res.data);
    }
  }
  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div style={{background: '#fff', padding: 24, minHeight: 280}}>
        <Result
          status="success"
          title={userAnswerResult?.resultName}
          subTitle={userAnswerResult?.resultDesc}
          extra={[
            <Button type="primary" key="console" onClick={handleRetry}>
              重新测试
            </Button>,
            <Button key="buy" onClick={handleDownloadPDF}>
              <DownloadOutlined/> PDF
            </Button>,
            <Button key="buy" onClick={handleDownloadCSV}>
              <DownloadOutlined/> CSV
            </Button>,
          ]}
        >
          <Card title="测试详情">
            {userAnswerResult?.appType === 0 && (<Paragraph>得分：{userAnswerResult?.resultScore}</Paragraph>)}
            {userAnswerResult?.appType === 1 && (<Paragraph>选项：{userAnswerResult?.choices}</Paragraph>)}
            <Paragraph>测试时间：{userAnswerResult?.createTime}</Paragraph>
            <Paragraph>用户：{userAnswerResult?.user?.userName}</Paragraph>
          </Card>
        </Result>
      </div>
    </>
  );
};

export default ResultDetail;
