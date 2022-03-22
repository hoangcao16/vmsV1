import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidV4 } from "uuid";
import ExportEventFileApi from "../actions/api/exporteventfile/ExportEventFileApi";
import Notification from "../components/vms/notification/Notification";
import { getBase64 } from "../utility/vms/file";

const useHandleUploadFile = (fileName) => {
  const { t } = useTranslation(); 
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgFileName, setImgFileName] = useState(fileName);
  useEffect(() => {
    setImgFileName(fileName);
    const loadImageFileHanleler = (fileName) => {
      if (!isEmpty(fileName)) {
        ExportEventFileApi.getAvatar(fileName).then((result) => {
          if (result.data) {
            let blob = new Blob([result.data], { type: "octet/stream" });
            let url = window.URL.createObjectURL(blob);
            setImageUrl(url);
          } else {
            setImageUrl("");
          }
        });
      } else {
        setImageUrl("");
      }
    };
    loadImageFileHanleler(fileName);
  }, [fileName]);
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    }
  };

  const uploadImage = async (options) => {
    const { file } = options;
    await ExportEventFileApi.uploadAvatar(uuidV4(), file).then((result) => {
      if (
        result.data &&
        result.data.payload &&
        result.data.payload.fileUploadInfoList.length > 0
      ) {
        getBase64(file, (imageUrl) => {
          setLoading(false);
          setImageUrl(imageUrl);
          const fileName = result.data.payload.fileUploadInfoList[0].name;
          setImgFileName(fileName);
        });
      }
    });
  };

  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      Notification({
        type: "error",
        title: "",
        description: `${t('noti.upload_file_desc')}`,
      });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Notification({
        type: "error",
        title: "",
        description: `${t('noti.size_file_desc')}`,
      });
    }
    return isJpgOrPng && isLt2M;
  }
  return [
    imageUrl,
    imgFileName,
    loading,
    handleChange,
    uploadImage,
    beforeUpload,
  ];
};

export default useHandleUploadFile;
