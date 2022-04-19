import React from "react";
import { Row, Col, Popconfirm, Button, Space, Spin } from "antd";
import { StyledEventFileDetail, ActionButton } from "./style";
import { useTranslation } from "react-i18next";
import SelectType from "./select-type";
import "./../../../commonStyle/commonPopconfirm.scss";
import { CloseOutlined } from "@ant-design/icons";
import { MemoizedTableDetailList } from "./tableDetailList";

const Viewfiletype4 = ({
  // handleSelectType,
  // objectType,
  detailAI,
  processState,
  handleSelectProgessState,
  imageOther,
  deleteImageHandler,
  viewImageAIHandler,
  handleShowTicketModal,
  tracingList,
  onClickRow,
  //   handleUpdateTHXL,
}) => {
  const { t } = useTranslation();
  const AI_SOURCE = process.env.REACT_APP_AI_SOURCE;
  // const typeObjects = [
  //   {
  //     value: "unknow",
  //     label: `${t("view.ai_events.type_object.unknow")}`,
  //   },
  //   {
  //     value: "vehicle",
  //     label: `${t("view.ai_events.type_object.vehicle")}`,
  //   },
  //   {
  //     value: "human",
  //     label: `${t("view.ai_events.type_object.human")}`,
  //   },
  // ];
  console.log("detailAI", detailAI);
  const processingstatusOptions = [
    {
      value: "process",
      label: `${t("view.ai_events.processing-status.process")}`,
    },
    {
      value: "processed",
      label: `${t("view.ai_events.processing-status.processed")}`,
    },
    {
      value: "not_processed",
      label: `${t("view.ai_events.processing-status.not_processed")}`,
    },
  ];
  const hasImage = imageOther.find((item) => item.type === "mp4");
  return (
    <>
      <StyledEventFileDetail className="eventDetail4">
        <Col span={14}>
          <div className="title">{t("view.ai_events.err_image")}</div>
          <div className="err_image">
            {AI_SOURCE !== "philong" ? (
              <ul>
                {imageOther
                  ? imageOther.map((item, index) => (
                      <li
                        key={item.uuid}
                        style={{
                          listStyleType: "none",
                          display: "inline-block",
                          marginRight: "20px",
                        }}
                      >
                        <div style={{ width: "90%", paddingBottom: "10px" }}>
                          <div
                            className="img__item"
                            style={{ position: "relative" }}
                          >
                            {item.uuid !== detailAI.uuid ? (
                              <Popconfirm
                                title={t("noti.sure_to_delete")}
                                onCancel={(event) => {
                                  event.stopPropagation();
                                }}
                                onConfirm={(event) => {
                                  event.stopPropagation();
                                  deleteImageHandler(item.uuid);
                                }}
                              >
                                <Button
                                  className="button-photo-remove"
                                  size="small"
                                  type="danger"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "red",
                                    // padding: '15px'
                                  }}
                                >
                                  <CloseOutlined style={{}} />
                                </Button>
                              </Popconfirm>
                            ) : null}

                            <img
                              onClick={(event) => {
                                event.stopPropagation();
                                viewImageAIHandler(item);
                              }}
                              style={{ width: "120px", height: "120px" }}
                              className="cursor-pointer"
                              src={"data:image/jpeg;base64," + item.image}
                              alt="Avatar"
                            />
                          </div>
                        </div>
                      </li>
                    ))
                  : null}
              </ul>
            ) : (
              <ul>
                {imageOther
                  ? imageOther.map((item, index) => (
                      <li
                        key={item.id}
                        style={{
                          listStyleType: "none",
                          display: "inline-block",
                          marginRight: "20px",
                        }}
                      >
                        <div style={{ width: "90%", paddingBottom: "10px" }}>
                          <div
                            className="img__item"
                            style={{ position: "relative" }}
                          >
                            {item.uuid !== detailAI.uuid ? (
                              <Popconfirm
                                title={t("noti.sure_to_delete")}
                                onCancel={(event) => {
                                  event.stopPropagation();
                                }}
                                onConfirm={(event) => {
                                  event.stopPropagation();
                                  deleteImageHandler(item.uuid);
                                }}
                              ></Popconfirm>
                            ) : null}

                            {item.type === "mp4" ? (
                              <div
                                className="img__item"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  viewImageAIHandler(item);
                                }}
                              >
                                {/* <video id={item.id} refs="rtsp://10.0.0.66:8554/proxy6" /> */}
                                <Space size="middle">
                                  <Spin
                                    className="video-js"
                                    size="large"
                                    id={"spin-slot-" + item.id}
                                    style={{ display: "none" }}
                                  />
                                </Space>
                                <video
                                  style={{
                                    width: "120px",
                                    height: "120px",
                                  }}
                                  className="video-container video-container-overlay cursor-pointer"
                                  loop
                                  autoPlay
                                >
                                  <source src={item.url} type="video/mp4" />
                                </video>
                              </div>
                            ) : (
                              <img
                                onClick={(event) => {
                                  event.stopPropagation();
                                  viewImageAIHandler(item);
                                }}
                                style={{
                                  width: "120px",
                                  height: "120px",
                                }}
                                className="cursor-pointer"
                                src={item.image}
                                alt="Avatar"
                              />
                            )}
                          </div>
                        </div>
                      </li>
                    ))
                  : null}
              </ul>
            )}
          </div>
        </Col>
        <Col span={10}>
          <Row className="detail-item">
            <Col span={10}>
              <div className="title">
                {t("view.penalty_ticket.vehicle_type")} :{" "}
              </div>
            </Col>
            <Col span={14}>
              {detailAI?.vehicleType}
              {/* <SelectType
                option={typeObjects}
                onChange={(e) => handleSelectType(e)}
                value={objectType}
              /> */}
            </Col>
          </Row>
          <Row className="detail-item">
            <Col span={10}>
              <div className="title">{t("view.ai_events.plateNumber")} : </div>
            </Col>
            <Col span={14}>
              {detailAI.plateNumber
                ? detailAI.plateNumber
                : t("view.ai_events.UnKnow")}
            </Col>
          </Row>
          <Row className="detail-item">
            <Col span={10}>
              <div className="title">Video :</div>
            </Col>
            <Col span={14}>
              {hasImage ? (
                <a
                  href={detailAI.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Link
                </a>
              ) : null}
            </Col>
          </Row>
          <Row className="detail-item">
            <Col span={10}>
              <div className="title">{t("view.common_device.state")} : </div>
            </Col>
            <Col span={14}>
              {detailAI?.status &&
                t(`view.ai_events.processing-status.${detailAI.status}`)}
              {/* <SelectType
                option={processingstatusOptions}
                // className="react-select"
                // classNamePrefix="select-progess-state"
                value={processState}
                onChange={(value) => handleSelectProgessState(value)}
              ></SelectType> */}
            </Col>
          </Row>
        </Col>
      </StyledEventFileDetail>
      <MemoizedTableDetailList
        tracingList={tracingList}
        detailAI={detailAI}
        onClickRow={onClickRow}
      ></MemoizedTableDetailList>
      <ActionButton>
        <Col span={4} offset={20}>
          <Row>
            <Col>
              <Button
                disabled={
                  processState?.value === processingstatusOptions[2]?.value
                    ? true
                    : false
                }
                type="primary"
                onClick={handleShowTicketModal}
                className="vms-ant-btn"
              >
                {t("view.common_device.ticket")}
              </Button>
            </Col>
            {/* <Col className="ml-8">
              <Button
                type="primary"
                className="vms-ant-btn"
                onClick={handleUpdateTHXL}
              >
                {t("view.common_device.update_state_THXL")}
              </Button>
            </Col> */}
          </Row>
        </Col>
      </ActionButton>
    </>
  );
};
export default Viewfiletype4;
