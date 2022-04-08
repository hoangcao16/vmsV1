import React, { useState, useEffect } from "react";
import { Card, Modal, Table, Tooltip, Typography, Button, Row } from "antd";
import { useTranslation } from "react-i18next";
import "./AiInforTable.scss";
import { connect, useDispatch } from "react-redux";
import { reactLocalStorage } from "reactjs-localstorage";
import { isEmpty } from "lodash";
import moment from "moment";
import { bodyStyleCard, headStyleCard } from "../user/variables";
import Draggable from "react-draggable";
import ExportEventFileApi from "../../actions/api/exporteventfile/ExportEventFileApi";
import { getBase64Text } from "../../utility/vms/getBase64Text";
import AiInforImage from "./AiInforImage";
import { UPDATE_DATA } from "../../redux/types/live";

const { Text } = Typography;
const dataType = "";

export const renderText = (cellValue, row, t) => {
  const language = reactLocalStorage.get("language");

  if (isEmpty(cellValue)) {
    return (
      <Text type="warning" style={{ float: "left !important" }}>
        {language !== "en" ? "Không có thông tin" : "No Information"}
      </Text>
    );
  }

  if (cellValue == "line_crossing") {
    return (
      <Text placement="top">
        {language !== "en" ? "Vượt rào ảo" : "Line crossing"}
      </Text>
    );
  }

  if (cellValue == "intruding") {
    return (
      <Text placement="top">
        {language !== "en" ? "Xâm nhập" : "Intruding"}
      </Text>
    );
  }

  return (
    <Tooltip placement="top" title={cellValue}>
      <Text>{cellValue}</Text>
    </Tooltip>
  );
};

export const renderTime = (value) => {
  if (value <= 9999999999) {
    return moment(value * 1000).format("HH:mm:ss DD/MM/YYYY");
  } else {
    return moment(value).format("HH:mm:ss DD/MM/YYYY");
  }
};

const AiInforTable = (props) => {
  const { showNotiInfo, isInfoModalVisible, setIsInfoModalVisible, idCamera } =
    props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [imageShowing, setImageShowing] = useState(false);
  const [urlImage, setUrlImage] = useState("");
  const [aIData, setAIData] = useState("");
  const data = props.updateData;

  useEffect(() => {
    if (!isInfoModalVisible) {
      dispatch({
        type: UPDATE_DATA.LOAD_SUCCESS,
        dataBody: { reset: true, cameraUuid: idCamera },
      });
    }
  }, [isInfoModalVisible]);

  const img = async (file) => {
    await ExportEventFileApi.downloadFileAI(
      file.cameraUuid,
      file.trackingId,
      file.uuid,
      file.fileName,
      4
    ).then(async (result) => {
      const blob = new Blob([result.data], { type: "octet/stream" });
      getBase64Text(blob, async (image) => {
        setUrlImage(image);
      });
    });
  };

  const columns = [
    {
      className: "columns--text__color",
      title: `${t("view.category.no")}`,
      dataIndex: "index",
      key: "index",
      width: "8%",
      render: (text, record, index) => index + 1,
    },

    {
      className: "columns--text__color",
      title: `${t("view.live.time")}`,
      dataIndex: "createdTime",
      key: "createdTime",
      width: "24%",
      render: renderTime,
    },
    {
      className: "columns--text__color",
      title: `${t("view.live.alert_type")}`,
      dataIndex: "subEventType",
      key: "subEventType",
      width: "20%",
      render: (cellValue, row) => renderText(cellValue, row, t),
    },
    {
      className: "columns--text__color",
      title: `${t("view.live.camera_record")}`,
      dataIndex: "cameraName",
      key: "cameraName",
      width: "30%",
      render: (cellValue, row) => renderText(cellValue, row, t),
    },
    {
      className: "columns--text__color",
      title: `${t("view.live.img_confirm")}`,
      dataIndex: "fileName",
      key: "fileName",
      width: "18%",
      render: (cellValue, row) => {
        return (
          <Button
            type="primary"
            className={"show--image__button"}
            onClick={(e) => {
              e.stopPropagation();
              showImage(row);
            }}
            style={{ marginTop: 5, marginBottom: 5 }}
          >
            <span className="show--image__button__title">
              {t("view.live.detail")}
            </span>
          </Button>
        );
      },
    },
  ];

  const showImage = (row) => {
    setAIData(row);
    img(row);
    setImageShowing(true);
  };

  const handleOk = () => {
    setIsInfoModalVisible(false);
  };

  const handleCancel = () => {
    setIsInfoModalVisible(false);
  };

  const renderHeader = (dataType) => {
    let name = `${t("view.live.alert_info", { u: t("u"), U: t("U") })}`;
    return <div className="table__title">{name}</div>;
  };

  const draggleRef = React.createRef();

  return (
    <>
      <Modal
        visible={isInfoModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={850}
        className="modal--table"
        modalRender={(modal) => (
          <Draggable>
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Card
          title={renderHeader(dataType)}
          bodyStyle={bodyStyleCard}
          headStyle={headStyleCard}
          className="card--table"
        >
          <Table
            columns={columns}
            dataSource={data[idCamera]}
            pagination={false}
            scroll={{ y: 300 }}
          />
        </Card>
      </Modal>
      <AiInforImage
        idCamera={idCamera}
        showImage={showImage}
        imageShowing={imageShowing}
        urlImage={urlImage}
        aIData={aIData}
        setImageShowing={setImageShowing}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  updateData: state.updateData,
});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AiInforTable);
