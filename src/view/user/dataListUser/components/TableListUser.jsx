import {
  CheckOutlined,
  CloseOutlined,
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
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import UserApi from "../../../../actions/api/user/UserApi";
import permissionCheck from "../../../../actions/function/MyUltil/PermissionCheck";
import Notification from "../../../../components/vms/notification/Notification";
import { ShowTotal } from "../../../../styled/showTotal";
import "../../../commonStyle/commonAuto.scss";
import "../../../commonStyle/commonSelect.scss";
import "./TableListUser.scss";

const { Option } = Select;
const { Text } = Typography;

export const renderText = (cellValue, row, t) => {
  const language = reactLocalStorage.get("language");

  if (isEmpty(cellValue)) {
    return (
      <Text type="warning" style={{ float: "left !important" }}>
        {language !== "en" ? "Không có thông tin" : "No Information"}
      </Text>
    );
  }
  return (
    <Tooltip placement="top" title={cellValue}>
      <Text>
        {cellValue.length > 25
          ? `${cellValue.slice(0, 15)}...${cellValue.slice(
              cellValue.length - 15,
              cellValue.length
            )}`
          : `${cellValue}`}
      </Text>
    </Tooltip>
  );
};

const UNIT = {
  ALL: "all",
  POSITION: "position",
  NAME: "name",
  EMAIL: "email",
  PHONE: "phone",
  UNIT: "unit",
  GROUP: "group",
  ROLE: "role",
};

const TableListUser = (props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [unit, setUnit] = useState(UNIT.ALL);
  const [form] = Form.useForm();
  const history = useHistory();
  let { path } = useRouteMatch();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    const data = {
      page: page,
      size: size,

      filter: "",
      type: "",
    };
    UserApi.getAllUser(data).then((result) => {
      setListUsers(result.payload);
      setTotal(result?.metadata?.total);
    });
  }, [page, size]);

  const renderHeader = () => {
    return (
      <div className="header d-flex justify-content-between align-items-center">
        <h4 className="font-weight-700">
          {t("view.user.detail_list.user_list", { u: t("u"), U: t("U") })}
        </h4>
        <Tooltip
          placement="rightTop"
          title={t("view.user.detail_list.add_user", {
            add: t("add"),
            u: t("u"),
            U: t("U"),
          })}
        >
          <Button
            type="primary"
            className="btnAddUser height-40 mr-1"
            style={{ borderRadius: "6px", border: "0" }}
            disabled={!permissionCheck("add_user")}
            onClick={() => {
              history.push(`${path}/add`);
            }}
          >
            <PlusOutlined className="d-flex justify-content-between align-center" />
          </Button>
        </Tooltip>
      </div>
    );
  };

  const handleUpdateStatus = async (e, uuid) => {
    let status;
    if (e) {
      status = 1;
    } else {
      status = 0;
    }

    await UserApi.update({ uuid: uuid, status: status });
  };

  const handleSearch = async (value) => {
    setSearch(value);
    if (value !== null) {
      const data = {
        // page: page,
        // size: size,
        filter: value.trim(),
        type: unit,
      };
      UserApi.getAllUser(data).then((result) => {
        setListUsers(result.payload);
        setTotal(result?.metadata?.total);
      });
    }
  };

  const handleBlur = (event) => {
    const value = event.target.value.trim();
    setSearch(value);
  };
  const handlePaste = (event) => {
    const value = event.target.value.trimStart();
    setSearch(value);
  };

  const onChangeUnit = async (value) => {
    setUnit(value);
    setSearch("");

    form.setFieldsValue({ searchForm: null });

    const data = {
      page: 1,
      size: size,
      filter: "",
      type: unit,
    };
    UserApi.getAllUser(data).then((result) => {
      setListUsers(result.payload);
      setTotal(result?.metadata?.total);
    });
  };

  const handleDeleteUser = async (uuid) => {
    const isDeleted = await UserApi.deleteUser(uuid);

    if (isDeleted) {
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_deleted_user", {
          u: t("u"),
          this: t("this"),
        })}`,
      };
      Notification(notifyMess);

      const data = {
        page: 1,
        size: size,
        filter: "",
        type: unit,
      };
      UserApi.getAllUser(data).then((result) => {
        setListUsers(result.payload);
        setTotal(result?.metadata?.total);
      });
    }
  };

  const columns = [
    {
      title: `${t("view.user.detail_list.user_name", {
        u: t("u"),
        U: t("U"),
      })}`,
      dataIndex: "name",
      with: "20%",
      render: (cellValue, row) => renderText(cellValue, row, t),
    },
    {
      title: `${t("view.user.detail_list.user_email")}`,
      dataIndex: "email",
      render: (cellValue, row) => renderText(cellValue, row, t),
    },
    {
      title: `${t("view.user.detail_list.user_phone_number")}`,
      dataIndex: "phone",
      render: (cellValue, row) => renderText(cellValue, row, t),
    },
    {
      title: `${t("view.user.detail_list.user_status")}`,
      dataIndex: "status",
      render: (text, record) => {
        return (
          <Space>
            <Tooltip
              placement="top"
              title={t("view.user.detail_list.change_status")}
            >
              <Switch
                defaultChecked={record.status === 1 ? true : false}
                onChange={(e) => handleUpdateStatus(e, record.uuid)}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                disabled={!permissionCheck("deactivate_user")}
              />
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: `${t("view.user.detail_list.action")}`,
      fixed: "right",
      render: (text, record) => {
        return (
          <div className="table__list--user__toolbar">
            {permissionCheck("edit_user") && (
              <Tooltip
                placement="top"
                title={t("view.user.detail_list.edit")}
                arrowPointAtCenter={true}
              >
                <EditOutlined
                  onClick={() => {
                    history.push(`${path}/detail/${record.uuid}`);
                  }}
                />
              </Tooltip>
            )}

            {/* <div> */}
            {permissionCheck("delete_user") && (
              <Popconfirm
                title={t("noti.delete_user", { this: t("this"), u: t("u") })}
                onConfirm={() => handleDeleteUser(record.uuid)}
                cancelText={t("view.user.detail_list.cancel")}
                okText={t("view.user.detail_list.confirm")}
              >
                <Tooltip
                  placement="top"
                  title={t("delete")}
                  arrowPointAtCenter={true}
                >
                  <DeleteOutlined />
                </Tooltip>
              </Popconfirm>
            )}
            {/* </div> */}
          </div>
        );
      },
    },
  ];

  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  return (
    <div className="user__list--tab mt-2">
      <Row gutter={24} className="userTableContent__menu-search">
        <Col span={6} className="height-40">
          <Select
            className="selected__user--by full-width full-height"
            placeholder={t("view.user.detail_list.search_by")}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={(value) => onChangeUnit(value)}
          >
            <Option value={UNIT.ALL}>{t("view.user.detail_list.all")}</Option>
            <Option value={UNIT.POSITION}>
              {t("view.user.detail_list.position")}
            </Option>
            <Option value={UNIT.NAME}>{t("view.user.detail_list.name")}</Option>
            <Option value={UNIT.EMAIL}>
              {t("view.user.detail_list.user_email")}
            </Option>
            <Option value={UNIT.PHONE}>
              {t("view.user.detail_list.user_phone_number")}
            </Option>
            <Option value={UNIT.UNIT}>{t("view.user.detail_list.unit")}</Option>
            <Option value={UNIT.GROUP}>{t("G")}</Option>
            <Option value={UNIT.ROLE}>{t("R")}</Option>
          </Select>
        </Col>
        <Col span={18}>
          <Form className="bg-grey searchData search--user">
            <AutoComplete
              className=" full-width height-40"
              value={search}
              onSearch={handleSearch}
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
          </Form>
        </Col>
      </Row>

      <Table
        className="table__list--user mt-2"
        rowKey="uuid"
        columns={columns}
        dataSource={listUsers}
        title={renderHeader}
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
};

export default TableListUser;
