import pandaApi from "../../api/camproxy-ctrl/cameraApi";
import { WarningFilled } from "@ant-design/icons";
import React from "react";
import Notification from "../../components/vms/notification/Notification";
import { NOTYFY_TYPE } from "../../view/common/vms/Constant";
const getServerCamproxyForPlay = async (camUuid) => {
    try {
        const data = await pandaApi.checkPermissionForViewOnline({
            cameraUuid: camUuid
        })
        return data

    } catch (err) {
        Notification({
            type: NOTYFY_TYPE.warning,
            title: 'Xem trực tiếp',
            description: 'Bạn không có quyền để xem trực tiếp camera này. Liên hệ admin. ' + err.toString()
        });
        return null
    }
}

export default getServerCamproxyForPlay;