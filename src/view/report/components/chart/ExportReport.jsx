import { Image } from "antd";
import React, { useState } from "react";
import exportIcon from "../../../../assets/img/icons/report/file-export 2.png";
import "./ExportReport.scss";
import { useTranslation } from "react-i18next";
import ReportApi from "../../../../actions/api/report/ReportApi";
import fileDownload from "js-file-download";
import moment from "moment";
import { reactLocalStorage } from "reactjs-localstorage";
import { isEmpty } from "lodash";

export default function ExportReport(props) {
  const permissionUser = reactLocalStorage.getObject("permissionUser");
  const { type } = props;
  const { t } = useTranslation();

  const [params, setParams] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("payloadDataChart");

    const initialValue = JSON.parse(saved);
    return initialValue || "";
  });

  const handleExport = async () => {
    const data = {
      ...params,
      typeChart: type,
    };
    await ReportApi.getExportData(data).then((value) => {
      const data = new Blob([value], { type: "application/vnd.ms-excel" });
      fileDownload(
        data,
        `Report_${moment().format("DD.MM.YYYY_HH.mm.ss")}.xlsx`
      );
    });
  };

  if (!isEmpty(permissionUser?.roles)) {
    const checkPermissionUserByRoles = permissionUser?.roles.filter(
      (r) =>
        r.role_code === "superadmin" ||
        r.role_code === "admin" ||
        r.role_code === "chuyen_vien" ||
        r.role_code === "lanh_dao_chuyen_mon" ||
        r.role_code === "lanh_dao_tinh"
    );

    const checkPermissionUserByOthers = permissionUser?.p_others.map(
      (r) => {
        if (Object.values(r) === "export_report") {
          checkPermissionUserByOthers.length = 1;
        }
      }
    );

    if (checkPermissionUserByRoles.length > 0 || checkPermissionUserByOthers.length > 0) {
      return (
        <div className="Export" onClick={handleExport}>
          <Image width={20} src={exportIcon} preview={false} />
          <p className="Export__title">{t("view.report.export_data")}</p>
        </div>
      );
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
}
