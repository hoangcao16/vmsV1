import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Card, Space, Table, Tag, Tooltip } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import PlaybackApi from "../../../actions/api/playback/PlaybackApi";
import Loading from "../../Loading";
import "./../../commonStyle/commonTable.scss";
import "./../../commonStyle/commontextArea.scss";
import ModalEditPlayback from "./ModalEditPlayback";
import "./stylePlayback.scss";
import { bodyStyleCard, headStyleCard } from "./variables";

const TablePlayback = () => {
  const { t } = useTranslation();
  const [selectedPlaybackIdEdit, setSelectedPlaybackIdEdit] = useState(null);
  const [listPlayback, setListPlayback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [size] = useState(50);
  const [val, setVal] = useState("");
  const page = 0;

  useEffect(() => {
    setLoading(true);
    const data = {
      name: "",
      page: page,
      size: size,
    };
    if (!selectedPlaybackIdEdit) {
      PlaybackApi.getAllPlayback(data)
        .then(setListPlayback)
        .finally(setLoading(false));
    }
    setLoading(false);
  }, [selectedPlaybackIdEdit, page, size]);

  const handleShowModalEdit = () => {
    setSelectedPlaybackIdEdit(null);
  };

  const handleSearch = async (value) => {
    setVal(value);
    const data = {
      name: encodeURIComponent(value),
      page: page,
      size: size,
    };
    const dataPlaybackSearch = await PlaybackApi.getAllPlayback(data).finally(
      setLoading(false)
    );
    setListPlayback(dataPlaybackSearch);
  };

  const handleBlur = async (event) => {
    const value = event.target.value.trim();
    setVal(value);
  };

  const handlePaste = async (event) => {
    const value = event.target.value.trimStart();
    setVal(value);
  };

  const renderTag = (cellValue) => {
    return (
      <Tag
        color={cellValue === "UP" ? "#1380FF" : "#FF4646"}
        style={{ color: "#ffffff" }}
      >
        {cellValue === "UP"
          ? `${t("view.camera.active")}`
          : `${t("view.camera.inactive")}`}
      </Tag>
    );
  };

  const PlaybackColumns = [
    {
      title: `${t("view.category.no")}`,
      key: "index",
      className: "headerColums",
      width: "5%",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("view.common_device.playback_name")}`,
      dataIndex: "name",
      key: "name",
      width: "20%",
      className: "headerColums",
      fixed: "left",
    },

    {
      title: `${t("view.common_device.desc")}`,
      dataIndex: "description",
      width: "20%",
      className: "headerColums",
      key: "description",
    },

    {
      title: `${t("view.common_device.note")}`,
      dataIndex: "note",
      width: "20%",
      className: "headerColums",
      key: "note",
    },
    {
      title: `${t("view.common_device.status")}`,
      dataIndex: "status",
      key: "status",
      width: "20%",
      className: "headerColums",
      render: renderTag,
    },
    {
      title: `${t("view.common_device.action")}`,
      className: "headerColums",
      fixed: "right",
      width: "15%",
      render: (text, record) => {
        return (
          <Space>
            <Tooltip placement="rightTop" title={t("view.common_device.edit")}>
              <EditOutlined
                style={{ fontSize: "16px", color: "#6E6B7B" }}
                onClick={() => {
                  setSelectedPlaybackIdEdit(record.uuid);
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="tabs__container--device">
      <div className="search mt-2">
        <AutoComplete
          maxLength={255}
          className=" full-width height-40"
          onSearch={debounce(handleSearch, 1000)}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={
            <div className="placehoder height-40 justify-content-between d-flex align-items-center">
              <span>
                {" "}
                &nbsp;{" "}
                {t("view.common_device.please_enter_playback_name", {
                  plsEnter: t("please_enter"),
                })}{" "}
              </span>{" "}
              <SearchOutlined style={{ fontSize: 22, pointer: "cussor" }} />
            </div>
          }
        />
      </div>
      <Card
        title={t("view.common_device.playback_list")}
        // extra={
        //   <Button>
        //     <PlusOneOutlined />
        //   </Button>
        // }
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--listDevice"
      >
        <Table
          scroll={{ y: 300 }}
          pagination={false}
          rowKey="id"
          columns={PlaybackColumns}
          dataSource={listPlayback}
          locale={{
            emptyText: `${t("view.user.detail_list.no_valid_results_found")}`,
          }}
        />
      </Card>

      {selectedPlaybackIdEdit && (
        <ModalEditPlayback
          selectedPlaybackIdEdit={selectedPlaybackIdEdit}
          handleShowModalEdit={handleShowModalEdit}
        />
      )}

      {loading ? <Loading /> : null}
    </div>
  );
};

export default withRouter(TablePlayback);
