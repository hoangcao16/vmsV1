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
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import UserApi from "../../../actions/api/user/UserApi";
import permissionCheck from "../../../actions/function/MyUltil/PermissionCheck";
import Notification from "../../../components/vms/notification/Notification";
import { ShowTotal } from "../../../styled/showTotal";
import "../../commonStyle/commonAuto.scss";
import "../../commonStyle/commonSelect.scss";
import { renderText } from "../dataListUser/components/TableListUser";
import "./TableListRoles.scss";

export default function TableListRoles() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const history = useHistory();
  let { path } = useRouteMatch();

  const [roles, setRoles] = useState([]);

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

    UserApi.getAllRole(data).then((result) => {
      setRoles(result.payload);
      setTotal(result?.metadata?.total);
    });
  }, [page, size, reload, search]);

  const renderHeader = () => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="font-weight-700">
          {t("view.user.detail_list.role_list", { R: t("R"), r: t("r") })}
        </h4>
        <Tooltip
          placement="rightTop"
          title={t("view.user.detail_list.add_role", {
            add: t("add"),
            R: t("R"),
          })}
        >
          <Button
            type="primary"
            className="btnAddRole height-40 mr-1"
            style={{ borderRadius: "6px", border: "0" }}
            onClick={() => {
              history.push(`${path}/add-roles`);
            }}
            disabled={!permissionCheck("add_role")}
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
        // page: page,
        // size: size
      };

      await UserApi.getAllRole(data).then((result) => {
        setRoles(result.payload);
        setTotal(result?.metadata?.total);
      });
    }
  };

  const removePermmision = async (record) => {
    const isDelete = await UserApi.deleteRoles(record?.uuid);
    if (isDelete) {
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_deleted_role")}`,
      };
      Notification(notifyMess);
    }

    setReload(!reload);
  };

  const columns = [
    {
      title: `${t("view.user.detail_list.role_name", {
        R: t("R"),
        r: t("r"),
      })}`,
      dataIndex: "name",
      className: "headerUserColums",
      width: "40%",
      render: renderText,
    },
    {
      title: `${t("view.user.detail_list.desc")}`,
      dataIndex: "description",
      className: "headerUserColums",
      width: "45%",
      render: renderText,
    },

    {
      title: `${t("view.user.detail_list.action")}`,
      className: "headerUserColums",
      fixed: "top",
      width: "15%",
      render: (text, record) => {
        return (
          <>
            <Tooltip placement="top" title={t("view.user.detail_list.edit")}>
              <EditOutlined
                onClick={() => {
                  history.push(`${path}/roles/detail/${record.uuid}`);
                }}
              />
            </Tooltip>
            {permissionCheck("add_role") ? (
              <Popconfirm
                title={t("noti.delete_role", { this: t("this") })}
                onConfirm={() => removePermmision(record)}
                cancelText={t("view.user.detail_list.cancel")}
                okText={t("view.user.detail_list.confirm")}
              >
                <Tooltip placement="top" title={t("delete")}>
                  <DeleteOutlined />
                </Tooltip>
              </Popconfirm>
            ) : null}
          </>
        );
      },
    },
  ];

  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };
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
        className="table_list--role mt-2"
        columns={columns}
        dataSource={roles}
        title={renderHeader}
        rowClassName="roleRow"
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
