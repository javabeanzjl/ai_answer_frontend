import React, {useEffect} from 'react';
import {Card, Col, Row} from 'antd';
import * as echarts from 'echarts';
import {
  getHotAppDistributionUsingGet, getUserAnswerGrowthRecordUsingGet,
} from "@/services/backend/staticalAnalysisController";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";

const Analysis = () => {

  const chartRef = React.useRef(null);
  const [hotAppData, setHotAppData] = React.useState<API.HotAppDistribution[]>([]);
  const [growthData, setGrowthData] = React.useState<API.UserAnswerGrowthRecord>();

  const loadData = async () => {
    // const res = await getUserAnswerParticipationUsingGet();
    const res = await getHotAppDistributionUsingGet()
    const growthData = await getUserAnswerGrowthRecordUsingGet()
    setGrowthData(growthData.data)
    console.log(res.data);
    setHotAppData(res?.data ?? [])
  }
  const icon = (number: number | undefined) => {
    // @ts-ignore
    if (number > 0) {
      return <ArrowUpOutlined style={{color: 'red'}}></ArrowUpOutlined>
    } else {
      return <ArrowDownOutlined style={{color: 'green'}}></ArrowDownOutlined>
    }
  }
  // 图表选项
  const option = {
    title: {
      text: '热门应用排行',
    },
    tooltip: {},
    legend: {
      data: ['Answer Count'],
    },
    xAxis: {
      type: 'category',
      data: hotAppData.map(item => item.appId),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Answer Count',
        type: 'bar',
        data: hotAppData.map(item => item.answerCount),
      },
    ],
  };
  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (!chartRef.current) return;

    const chartInstance = echarts.init(chartRef.current);
    chartInstance.setOption(option);

    return () => {
      chartInstance.dispose();
    };
  }, []);

  return (
    <>
      <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}> {/* 设置不同屏幕尺寸下的间隔 */}
        {/* 第一个卡片 */}
        <Col span={6}>
          <Card
            title="总答题数"
            bordered={false}
            hoverable
            style={{width: '100%', height: '100%'}} // 确保使用宽度100%
          >
            <p>{growthData?.userAnswerCount}</p>
            <p>周同比 {growthData?.wekIncPercent}%{icon(growthData?.wekIncPercent)}  日同比 {growthData?.dayIncPercent}%{icon(growthData?.dayIncPercent)}</p>
            <p>本日新增题目 {growthData?.userAnswerCount} </p>
          </Card>
        </Col>

        {/* 第二个卡片 */}
        <Col span={6}>
          <Card
            title="总应用数"
            bordered={false}
            hoverable
            style={{width: '100%', height: '100%'}} // 确保使用宽度100%
          >
            <p>8,846</p>
            <p>日访问量 1,234</p>
            {/* 可以在这里添加图表或其他数据可视化元素 */}
          </Card>
        </Col>

        {/* 第三个卡片 */}
        <Col span={6}>
          <Card
            title="总题目数  "
            bordered={false}
            hoverable
            style={{width: '100%', height: '100%'}} // 确保使用宽度100%
          >
            <p>6,560</p>
            <p>转化率 60%</p>
            {/* 可以在这里添加条形图或其他数据可视化元素 */}
          </Card>
        </Col>

        {/* 第四个卡片 */}
        <Col span={6}>
          <Card
            title="总评价评价记录数"
            bordered={false}
            hoverable
            style={{width: '100%', height: '100%'}} // 确保使用宽度100%
          >
            <p>78%</p>
            <p>周同比 12% 日同比 11%</p>
            {/* 可以在这里添加进度条或其他数据可视化元素 */}
          </Card>
        </Col>
      </Row>
      <Card
        style={{
          marginTop: 20
        }}
      >
        <div ref={chartRef} style={{width: '100%', height: '300px'}}></div>
      </Card>
    </>

  );
}
export default Analysis;
