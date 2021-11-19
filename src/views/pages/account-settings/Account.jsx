import React from "react";
import { Tabs } from "antd";
import 'antd/dist/antd.css';
import General from "./General";
const { TabPane } = Tabs;

const ACCOUNT_TYPE = {
  USER: 1,
  GROUP: 2,
  ROLE: 3
}


function Account(props) {

  return (
    <div>
      <Tabs defaultActiveKey={ACCOUNT_TYPE.USER} onChange={callback} type='card' >
        <TabPane tab='Người dùng' key={ACCOUNT_TYPE.USER}>
          <General />
        </TabPane>
        <TabPane tab='Nhóm' key={ACCOUNT_TYPE.GROUP}>
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab='Vai trò' key={ACCOUNT_TYPE.ROLE}>
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Account;
