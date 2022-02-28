import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Modal, Tooltip, Popconfirm } from "antd";
import React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import UserApi from "../../../../actions/api/user/UserApi";
import permissionCheck from "../../../../actions/function/MyUltil/PermissionCheck";
import Notification from "../../../../components/vms/notification/Notification";
import "./GroupDetailHeader.scss";
import { useTranslation } from "react-i18next";

export default function GroupDetailHeader(props) {
  const { t } = useTranslation();
  const his = useHistory();
  const removePermmision = async (props) => {
    const isDelete = await UserApi.deleteGroup(props?.groupUuid);
    if (isDelete) {
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_delete_group")}`,
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
            <h4 className=" titleUserDetail">
              <ArrowLeftOutlined className="mr-1" onClick={goBack} />
              {t("view.user.user_group", { G: t("G"), U: t("U"), u: t("u") })}
            </h4>
          </>
        }
        extra={
          permissionCheck("delete_user_group") ? (
            <Popconfirm
              title={t("noti.delete_group", { g: t("g"), this: t("this") })}
              onConfirm={() => removePermmision(props)}
              cancelText={t("view.user.detail_list.cancel")}
              okText={t("view.user.detail_list.confirm")}
            >
              <Tooltip placement="top" title={t("delete")}>
                <DeleteOutlined className="deleteBtn"/>
              </Tooltip>
            </Popconfirm>
          ) : null
        }
        style={{ width: "100%" }}
        className="detail-group-user__info"
      >
        <p className="name__group-user">{props?.name}</p>
        <p className="description__group-user">{props?.description}</p>
      </Card>
    </div>
  );
}
