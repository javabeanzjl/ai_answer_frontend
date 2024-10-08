import {useModel} from '@umijs/max';
import {Descriptions, message, Spin} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {EditOutlined} from "@ant-design/icons";

import Settings from '../../../../config/defaultSettings';
import Paragraph from "antd/lib/typography/Paragraph";
import ProCard from "@ant-design/pro-card";
import {getLoginUserUsingGet, getUserByIdUsingGet, updateUserUsingPost} from "@/services/backend/userController";


export const valueLength = (val: any) => {
  return val && val.trim().length > 0
}
const UserInfo: React.FC = () => {
  const {initialState, setInitialState} = useModel('@@initialState');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<API.UserVO>();
  const [userName, setUserName] = useState<any>();
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  const loadData = async () => {
    setLoading(true)
    const res = await getLoginUserUsingGet();
    if (res.data && res.code === 0) {
      setUserData(res.data);
      setUserName(res.data.userName)
      setLoading(false)
    }
  }
  useEffect(() => {
      loadData()
    },
    [])

  const updateUserInfo = async (value: string) => {
    const res = await updateUserUsingPost({
      id: initialState?.currentUser?.id,
      userName: value
    })
    if (res.data && res.code === 0) {
      const userRes = await getUserByIdUsingGet({
        id: initialState?.currentUser?.id
      })
      if (userRes.data && userRes.code === 0) {
        setInitialState({currentUser: userRes.data, settings: Settings})
      }
      setUserName(value)
      message.success(`信息更新成功`);
    }
  }

  return (
    <>
      <ProCard type="inner"
               bordered
               direction="column">
        <ProCard bordered
                 ref={ref3}
                 type="inner"
                 title={"用户信息"}>
          <Descriptions column={1}>
            <div>
              <h4>用户名：</h4>
              <Paragraph
                editable={
                  {
                    icon: <EditOutlined/>,
                    tooltip: '编辑',
                    onChange: (value) => {
                      updateUserInfo(value)
                    }
                  }
                }
              >
                {userName ? userName : '无名氏'}
              </Paragraph>
            </div>
            <div>
              <h4>角色：</h4>
              <Paragraph>
                {userData?.userRole === 'admin' ? '管理员' : '普通用户'}
              </Paragraph>
            </div>
          </Descriptions>
        </ProCard>
      </ProCard>
      <Spin spinning={loading}>
        <ProCard
          type="inner"
          bordered
          direction="column"
        >
          <br/>
        </ProCard>
      </Spin>
    </>
  );
};

export default UserInfo;
