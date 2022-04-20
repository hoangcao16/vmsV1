import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Col,
  Form,
  Popconfirm,
  Row,
  Table,
  Tooltip,
} from "antd";
import { event } from "jquery";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import GroupApi from "../../../actions/api/group/GroupApi";
import UserApi from "../../../actions/api/user/UserApi";
import permissionCheck from "../../../actions/function/MyUltil/PermissionCheck";
import Notification from "../../../components/vms/notification/Notification";
import { ShowTotal } from "../../../styled/showTotal";
import "../../commonStyle/commonAuto.scss";
import "../../commonStyle/commonSelect.scss";
import { renderText } from "../dataListUser/components/TableListUser";
import "./TableListGroup.scss";

export default function TableListGroup() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const history = useHistory();
  let { path } = useRouteMatch();

  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    let data = {
      filter: search,
      page: page,
      size: size,
    };

    GroupApi.getAllGroup(data).then((result) => {
      setGroups(result.payload);
      setTotal(result?.metadata?.total);
    });
  }, [page, size, reload]);

  const renderHeader = () => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="font-weight-700">
          {t("view.user.detail_list.group_user_list", {
            u: t("u"),
            U: t("U"),
            g: t("g"),
            G: t("G"),
          })}
        </h4>
        <Tooltip
          placement="rightTop"
          title={t("view.user.detail_list.add_group", {
            add: t("add"),
            g: t("g"),
            G: t("G"),
          })}
        >
          <Button
            type="primary"
            className="btnAddGroup height-40 mr-1"
            style={{ borderRadius: "6px", border: "0" }}
            onClick={() => {
              history.push(`${path}/add-group`);
            }}
            disabled={!permissionCheck("add_user_group")}
          >
            <PlusOutlined className="d-flex justify-content-between align-center" />
          </Button>
        </Tooltip>
      </div>
    );
  };

  const handleSearch = async (value) => {
    setSearch(value);
    if (search !== null) {
      let data = {
        filter: value,
        // page: 1,
        // size: size
      };

      await GroupApi.getAllGroup(data).then((result) => {
        setGroups(result.payload);
        setTotal(result?.metadata?.total);
      });
    }
  };

  const removePermmision = async (record) => {
    const isDelete = await UserApi.deleteGroup(record?.uuid);

    if (isDelete) {
      const notifyMess = {
        type: "success",
        title: "",
        description: t("noti.successfully_deleted_group", { g: t("g") }),
      };
      Notification(notifyMess);
    }

    setReload(!reload);
  };

  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  const columns = [
    {
      title: `${t("view.user.detail_list.group_user_name", {
        g: t("g"),
        G: t("G"),
        u: t("u"),
      })}`,
      dataIndex: "name",
      width: "40%",
      render: renderText,
    },
    {
      title: `${t("view.user.detail_list.desc")}`,
      dataIndex: "description",
      width: "45%",
      render: renderText,
    },
    {
      title: `${t("view.user.detail_list.action")}`,
      fixed: "top",
      width: "15%",
      render: (text, record) => {
        return (
          <div className="item--toolbar">
            <Tooltip placement="top" title={t("view.user.detail_list.edit")}>
              <EditOutlined
                onClick={() => {
                  history.push(`${path}/group/detail/${record.uuid}`);
                }}
              />
            </Tooltip>
            {permissionCheck("delete_user_group") ? (
              <Popconfirm
                title={t("noti.delete_group", { g: t("g"), this: t("this") })}
                onConfirm={() => removePermmision(record)}
                cancelText={t("view.user.detail_list.cancel")}
                okText={t("view.user.detail_list.confirm")}
              >
                <Tooltip placement="top" title={t("delete")}>
                  <DeleteOutlined />
                </Tooltip>
              </Popconfirm>
            ) : null}
          </div>
        );
      },
    },
  ];
  const handleBlur = (event) => {
    const value = event.target.value.trim();
    setSearch(value);
  };

  const handlePaste = (event) => {
    const value = event.target.value.trimStart();
    setSearch(value);
  };

  return (
    <div className="groupTableContent">
      <Row gutter={24} className="mt-2">
        <Col span={24}>
          <AutoComplete
            className=" full-width height-40"
            onSearch={debounce(handleSearch, 1000)}
            onBlur={handleBlur}
            onPaste={handlePaste}
            maxLength={255}
            placeholder={
              <div className="placehoder height-40 justify-content-between d-flex align-items-center">
                <span style={{ opacity: "0.5" }}>
                  {" "}
                  &nbsp;{" "}
                  {t("view.user.detail_list.please_enter_search_keyword", {
                    plsEnter: t("please_enter"),
                  })}{" "}
                </span>{" "}
                <SearchOutlined style={{ fontSize: 22 }} />
              </div>
            }
          />
        </Col>
      </Row>
      <Table
        rowKey="uuid"
        className="table__list--group-user mt-2"
        columns={columns}
        dataSource={groups}
        title={renderHeader}
        rowClassName="groupRow"
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            onShowSizeChange(current, size);
          },
          hideOnSinglePage: false,
          current: page,
          total: total,
          pageSize: size,
          onChange: (value) => {
            setPage(value);
          },
          showTotal: (total, range) => {
            return (
              <ShowTotal className="show--total">
                {t("view.user.detail_list.viewing")} {range[0]}{" "}
                {t("view.user.detail_list.to")} {range[1]}{" "}
                {t("view.user.detail_list.out_of")} {total}{" "}
                {t("view.user.detail_list.indexes")}
              </ShowTotal>
            );
          },
        }}
        locale={{
          emptyText: `${t("view.user.detail_list.no_valid_results_found")}`,
        }}
      />
    </div>
  );
}
