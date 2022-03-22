import { Modal } from "antd";
import React from "react";
import "./AiInforImage.scss";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";

const AiInforImage = (props) => {
  const { t } = useTranslation();
  const {
    idCamera,
    showImage,
    setImageShowing,
    imageShowing,
    urlImage,
    aIData,
  } = props;
  const handleOk = () => {
    setImageShowing(false);
  };

  const handleCancel = () => {
    setImageShowing(false);
  };
  return (
    <>
      <Modal
        visible={imageShowing}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <div className="image__wrapper">
          <span className="span__color">{t("view.ai_events.err_image")}</span>
          <div className="image__wrapper--content">
            <img src={urlImage} alt="" className="image__size" />
            <div className="image__wrapper--content--info">
              <span className="span__color">{t("view.ai_events.info")}</span>
              <div className="infomation">
                {aIData.useCase == "zac_vehicle" ? (
                  <div>
                    {t("view.live.plate_number")}
                    {": "}
                    {aIData.plateNumber}
                  </div>
                ) : (
                  <>
                    <div>
                      {t("view.ai_events.name")}
                      {": "}
                      {aIData.name}
                    </div>
                    <div>
                      {t("view.ai_events.code")}
                      {": "}
                      {aIData.code}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AiInforImage;
