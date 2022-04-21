import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Modal, Tooltip, Popconfirm } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import UserApi from "../../../../actions/api/user/UserApi";
import permissionCheck from "../../../../actions/function/MyUltil/PermissionCheck";
import Notification from "../../../../components/vms/notification/Notification";
import "./ModalWarning.scss";
import "./RolesDetailHearder.scss";

export default function RolesDetailHearder(props) {
  const { t } = useTranslation();
  const his = useHistory();
  const removePermmision = async (props) => {
    const isDelete = await UserApi.deleteRoles(props?.rolesUuid);
    if (isDelete) {
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_delete_role")}`,
      };
      Notification(notifyMess);
      his.go(-1);
    }
  };

  const goBack = () => {
    his.go(-1);
  };
  return (
    <div>
      <Card
        title={
          <>
            <h4 className="font-weight-700 titleUserDetail d-flex align-item-center">
              <ArrowLeftOutlined onClick={goBack} />
              {t("R")}
            </h4>
          </>
        }
        extra={
          permissionCheck("delete_user_group") ? (
            <Popconfirm
              title={t("noti.delete_role", { this: t("this") })}
              onConfirm={() => removePermmision(props)}
              cancelText={t("view.user.detail_list.cancel")}
              okText={t("view.user.detail_list.confirm")}
            >
              <Tooltip placement="top" title={t("delete")}>
                <DeleteOutlined className="deleteBtn" />
              </Tooltip>
            </Popconfirm>
          ) : null
        }
        style={{ width: "100%" }}
        className="detail-role__info"
      >
        <p className="name__role">{props?.name}</p>
        <p className="description__role">{props?.description}</p>
      </Card>
    </div>
  );
}
