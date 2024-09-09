import React, {useEffect} from "react";
import {Avatar, Card, Col, Row} from "antd";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import {listAppVoByPageUsingPost} from "@/services/backend/appController";
import {Link} from "umi";

const AppSquare: React.FC = () => {

  const [appList, setAppList] = React.useState<API.AppVO[]>([]);

  const loadData = async () => {
    const res = await listAppVoByPageUsingPost({})
    if (res.data) {
      setAppList(res.data.records || []);
    }
    console.log(res)
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Row gutter={[32,32]}>
        {appList.map((app, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6}>
            <Link to={`/app/detail/${app.id}`}>
              <Card
                hoverable
                style={{ width: '100%' }}
                cover={
                  <img
                    alt="example"
                    src={app.appIcon}
                  />
                }
              >
                <Meta
                  avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                  title={app.appName} // 假设app对象有一个title属性
                  description={app.appDesc} // 假设app对象有一个description属性
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  )
}
export default AppSquare;
