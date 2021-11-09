import React from 'react';
import {Table} from "antd";

const VmsTable = ({columns, dataSource}) => (
    <div className="vms-table">
        <Table dataSource={dataSource} columns={columns} />;
    </div>

);

export default VmsTable;