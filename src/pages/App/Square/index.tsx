import React, {useEffect} from "react";
import {Avatar, Button, Card, Col, Form, Input, Pagination, Row, Tag} from "antd";
import Meta from "antd/es/card/Meta";
import {listAppVoByPageUsingPost, listMyAppVoByPageUsingPost} from "@/services/backend/appController";
import {Link} from "umi";
import {DotChartOutlined, PlusOutlined} from "@ant-design/icons";

const AppSquare: React.FC = () => {

  const [appList, setAppList] = React.useState<API.AppVO[]>([]);
  const [myAppList, setMyAppList] = React.useState<API.AppVO[]>([]);


  const pageSize = 9; // 每页显示10条数据
  const [current, setCurrent] = React.useState(1); // 当前页码
  const [total, setTotal] = React.useState(0); // 总数据量
  const [showMyAppsCard, setShowMyAppsCard] = React.useState(true);

  const loadData = async () => {
    const res = await listAppVoByPageUsingPost({
      current: current,
      pageSize: pageSize,
      sortField: "updateTime",
      sortOrder: "descend",
    })
    const myRes = await listMyAppVoByPageUsingPost({
      current: 1,
      pageSize: 5,
      sortField: "updateTime",
      sortOrder: "descend",
    })
    // console.log(myRes?.data?.records)
    if (res.data) {
      setAppList(res.data.records || []);
      setTotal(res.data.total || 0);
    }
    if (myRes.data) {
      setMyAppList(myRes.data.records || [])
    }
  }

  useEffect(() => {
    loadData();
  }, [current]);

  return (
    <>
      <div style={{display: "flex", alignItems: "center"}}>
        {showMyAppsCard && (
          <>
            <span style={{fontSize: 20, marginLeft: "5px", marginRight: "5px", fontWeight: "bold"}}>我创建的</span>
            <Button
              type="primary"
              style={{
                backgroundColor: "#333", // 按钮背景色，根据图片调整
                color: "white", // 文字颜色，根据图片调整
                borderColor: "#333", // 边框颜色，根据图片调整
                height: "30px", // 按钮高度，根据图片调整
                lineHeight: "1.5", // 行高，用于垂直居中文本
                padding: "0 15px", // 内边距，根据图片调整
              }}>
              <DotChartOutlined />创作者中心
            </Button>
          </>
        )}

        <Form
          layout="inline"
          style={{display: "flex", marginLeft: "auto"}}
          onFinish={async (values) => {
            const res = await listAppVoByPageUsingPost({
              current: current,
              pageSize: pageSize,
              searchText: values?.search
            })
            if (res.data) {
              setAppList(res.data.records || []);
              setTotal(res.data.total || 0);
              setShowMyAppsCard(false)
            }
          }}
          onReset={() => {
            // 在重置表单时执行的逻辑
            setShowMyAppsCard(true); // 显示“我创建的”卡片
            // 这里可以添加其他重置逻辑，比如重置分页等
          }}
        >
          <Button
            type="primary"
            style={{
              display: "flex",
              marginLeft: "auto",
              marginRight:"5px",
              backgroundColor: "#333", // 按钮背景色，根据图片调整
              color: "white", // 文字颜色，根据图片调整
              borderColor: "#333", // 边框颜色，根据图片调整
              height: "30px", // 按钮高度，根据图片调整
              lineHeight: "1.5", // 行高，用于垂直居中文本
              padding: "0 15px", // 内边距，根据图片调整
            }}
            htmlType="reset" // 设置按钮类型为重置
          >
            重置
          </Button>
          <Form.Item name="search">
            <Input placeholder="搜索应用"/>
          </Form.Item>
        </Form>
      </div>


      {showMyAppsCard && (
        <div style={{marginTop: '16px', marginBottom: '16px'}}>
          <Card
          >
            <Row gutter={[32, 32]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                <Link to={`/app/create/`}>
                  <Card
                    hoverable
                    style={{width: '100%', height: '100%'}} // 确保使用宽度100%
                  >
                    <Meta
                      avatar={
                        <Avatar
                          shape="circle"
                          size={60}
                          icon={<PlusOutlined/>}
                          style={{backgroundColor: 'rgba(0, 123, 255, 0.18)'}} // 浅蓝色背景，带有透明度
                        />
                      }
                      title="创建应用"
                    />
                  </Card>
                </Link>
              </Col>
              {myAppList.map((app, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
                  <Link to={`/app/detail/${app.id}`}>
                    <Card
                      hoverable
                      cover={
                        <img
                          src={app.appIcon}
                        />
                      }
                      style={{width: '100%'}} // 确保使用宽度100%
                    >
                      <Meta
                        avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8"/>}
                        title={
                          <div>
                            {index === 0 &&  <Tag color="red" style={{ fontSize: 15,position: 'absolute', top: 0, left: 0, zIndex: 1, paddingLeft: 4, paddingRight: 4 }}>
                              new
                            </Tag>}
                            {app.appName}
                          </div>
                        }
                        description={app.appDesc}
                      />
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      )}

      <Card
        title={
          <div style={{display: "flex", alignItems: "center"}}>
            <span style={{marginRight: "5px", fontWeight: "bold"}}>应用广场</span>
          </div>
        }
        headStyle={{fontSize: 25}}
      >
        <Row gutter={[32, 32]}>
          {appList.map((app, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
              <Link to={`/app/detail/${app.id}`}>
                <Card
                  hoverable
                  style={{width: '100%'}}
                  cover={
                    <img
                      alt="example"
                      src={app.appIcon}
                    />
                  }
                >
                  <Meta
                    avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8"/>}
                    title={app.appName} // 假设app对象有一个title属性
                    description={app.appDesc} // 假设app对象有一个description属性
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Card>
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={(page) => setCurrent(page)}
        style={{marginTop: 16, textAlign: 'center'}}
      />
    </>
  )
}
export default AppSquare;
