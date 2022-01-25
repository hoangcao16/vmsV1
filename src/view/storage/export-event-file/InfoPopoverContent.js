import { Col, Input, Popconfirm, Row, Tooltip } from "antd";
import { FiBookmark, FiDownload, FiFilm, FiImage } from "react-icons/fi";
import moment from "moment";
import { RiDeleteBinLine } from "react-icons/ri";
import React, { useState } from "react";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from "react-icons/all";
import debounce from "lodash/debounce";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const InfoPopoverContent = (props) => {
  const { t } = useTranslation();
  const path =
    props.viewFileType === 0
      ? props.fileCurrent.path
      : props.fileCurrent.pathFile;
  const [currNode, setCurrNode] = useState(props.fileCurrent.note);
  const [editMode, setEditMode] = useState(false);
  const { TextArea } = Input;

  const getRecordDate = () => {
    if (props.viewFileType === 0) {
      return props.fileCurrent.startRecordTime === -1
        ? ""
        : moment(props.fileCurrent.startRecordTime * 1000).format(
            "hh:mm DD/MM/YYYY"
          );
    } else {
      return props.fileCurrent.violationTime === -1
        ? ""
        : moment(props.fileCurrent.violationTime * 1000).format(
            "hh:mm DD/MM/YYYY"
          );
    }
  };

  const getCreatedTime = () => {
    if (props.viewFileType === 0) {
      return props.fileCurrent.createdTime === -1
        ? ""
        : moment(props.fileCurrent.createdTime * 1000).format(
            "hh:mm DD/MM/YYYY"
          );
    } else {
      return props.fileCurrent.createdTime === -1
        ? ""
        : moment(props.fileCurrent.createdTime).format("hh:mm DD/MM/YYYY");
    }
  };

  const changeNoteHandler = (event) => {
    setCurrNode(event.target.value);
  };

  const cancelChangeNoteHandler = () => {
    setCurrNode(props.fileCurrent.note);
    setEditMode(false);
  };

  const saveFileHandler = (isImportant, note) => {
    props.onEditFile(isImportant, note);
    setEditMode(false);
  };

  return (
    <>
      <Row gutter={[16, 30]} className="rootRow">
        <Col span={12}>
          <div className="title">{t("view.storage.file_name")}</div>
          <div>{props.fileCurrent.name}</div>
        </Col>
        <Col span={1} />
        <Col span={11}>
          <div className="title">
            {t("view.storage.camera_name", { cam: t("camera") })}
          </div>
          <div>{props.fileCurrent.cameraName}</div>
        </Col>
        <Col span={12}>
          <div className="title">{t("view.storage.path")}</div>
          <div className="pathFile">{path}</div>
        </Col>
        <Col span={1} />
        <Col span={11}>
          <div className="title">{t("view.storage.type")}</div>
          <div>
            {props.fileCurrent.type !== 1 && <FiFilm className="iconType" />}
            {props.fileCurrent.type === 1 && <FiImage className="iconType" />}
          </div>
        </Col>
        <Col span={12}>
          <div className="title">{t("view.storage.violation_time")}</div>
          <div>{getRecordDate()}</div>
        </Col>
        <Col span={1} />
        <Col span={11}>
          <div className="title">{t("view.storage.created_time")}</div>
          <div>{getCreatedTime()}</div>
        </Col>
        <Col span={12}>
          <div className="title">{t("view.storage.length")}</div>
          <div>
            {new Date(+props.fileCurrent.length * 1000)
              .toISOString()
              .substr(11, 8)}
          </div>
        </Col>
        <Col span={1} />
        <Col span={11}>
          <div className="title">{t("view.map.location")}</div>
          <div className="address">{props.fileCurrent.address}</div>
        </Col>
        <Col span={12}>
          <div className="title">
            <span>{t("view.common_device.note")}</span>
            {!editMode && (
              <AiOutlineEdit
                className="iconEdit"
                onClick={() => {
                  setEditMode(true);
                }}
              />
            )}
            {editMode && (
              <AiOutlineCheck
                className="iconEdit"
                onClick={() => saveFileHandler(null, currNode)}
              />
            )}
            {editMode && (
              <AiOutlineClose
                className="iconEdit"
                onClick={() => cancelChangeNoteHandler()}
              />
            )}
          </div>
          <div>
            {!editMode && <span>{props.fileCurrent.note}</span>}
            {editMode && (
              <TextArea
                defaultValue={currNode}
                rows={4}
                onChange={debounce(changeNoteHandler, 500)}
              />
            )}
          </div>
        </Col>
        <Col span={1} />
        <Col span={11}>
          <div className="title">{t("view.common_device.action")}</div>
          <div>
            <div className="actionFile">
              {!props.fileCurrent.isImportant && (
                <Tooltip placement="bottomLeft" title={t("view.storage.tick")}>
                  <FiBookmark
                    className="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onEditFile(true, null);
                    }}
                  />
                </Tooltip>
              )}
              {props.fileCurrent.isImportant && (
                <Tooltip placement="bottomLeft" title={t("view.storage.tick")}>
                  <FiBookmark
                    className="icon-active"
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onEditFile(false, null);
                    }}
                  />
                </Tooltip>
              )}
              <Tooltip
                placement="bottomLeft"
                title={t("view.storage.download_file")}
              >
                <FiDownload
                  className="icon"
                  onClick={() => {
                    props.onDownloadFile();
                  }}
                />
              </Tooltip>
              <Tooltip placement="bottomLeft" title={t("view.storage.delete")}>
                <Popconfirm
                  title={t("noti.delete_file", { this: t("this") })}
                  okText={t("view.user.detail_list.confirm")}
                  cancelText={t("view.map.button_cancel")}
                  onConfirm={() => {
                    props.onDeleteFile();
                  }}
                >
                  <RiDeleteBinLine className="icon" />
                </Popconfirm>
              </Tooltip>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

function infoPopoverContentPropsAreEqual(prevPopContent, nextPopContent) {
  return _.isEqual(prevPopContent.fileCurrent, nextPopContent.fileCurrent);
}

export const MemoizedInfoPopoverContent = React.memo(
  InfoPopoverContent,
  infoPopoverContentPropsAreEqual
);
