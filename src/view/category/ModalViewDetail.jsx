import { Avatar, Button, Col, Modal, Row, Typography } from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdDivisionApi from "../../actions/api/advision/AdDivision";
import Loading from "../common/element/Loading";
import ExportEventFileApi from "./../../actions/api/exporteventfile/ExportEventFileApi";
import "./ModalViewDetail.scss";

const { Paragraph } = Typography;

const ModalViewDetail = (props) => {
  const { t } = useTranslation();
  const { handleShowModal, selectedUnitId } = props;

  const [avatarUrl, setAvatarUrl] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(
    !isEmpty(selectedUnitId)
  );

  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    AdDivisionApi.getAdDivisionByUuid(selectedUnitId).then(async (result) => {
      setSelectedUnit(result);
      await ExportEventFileApi.getAvatar(result.avatarFileName).then(
        (result) => {
          if (result.data) {
            let blob = new Blob([result.data], { type: "octet/stream" });
            let url = window.URL.createObjectURL(blob);
            setAvatarUrl(url);
          } else {
            setAvatarUrl("");
          }
        }
      );
    });
  }, []);

  if (isEmpty(selectedUnit)) {
    return <Loading />;
  }

  return (
    <>
      <Modal
        title={t("view.camera.camera_detail", { cam: t("unit") })}
        visible={isModalVisible}
        onOk={handleShowModal}
        onCancel={() => handleShowModal(null)}
        footer={null}
        className="modal--administrative__unit"
        maskStyle={{ background: "rgba(51, 51, 51, 0.9)" }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <div
              style={{
                paddingBottom: 20,
              }}
            >
              <Avatar
                src={avatarUrl}
                className="avatarUser"
                style={{borderRadius:0}}
                size={{
                  xs: 24,
                  sm: 32,
                  md: 40,
                  lg: 64,
                  xl: 80,
                  xxl: 130,
                }}
              />
            </div>
          </Col>

          <Col span={12}>
            <Row gutter={24}>
              <Col span={24}>
                <Paragraph>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>
                    {t("view.category.administrative_unit_name")}
                  </p>
                  <p>{selectedUnit?.name}</p>
                </Paragraph>
              </Col>
              <Col span={24}>
                <Paragraph>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>
                    {t("view.map.phone_number")}
                  </p>
                  <p>{selectedUnit?.tel}</p>
                </Paragraph>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t("view.map.location")}
              </p>
              <p>{selectedUnit?.address}</p>
            </Paragraph>
          </Col>

          <Col span={8}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t("view.map.province_id")}
              </p>
              <p>{selectedUnit?.provinceName}</p>
            </Paragraph>
          </Col>
          <Col span={8}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t("view.map.district_id")}
              </p>
              <p>{selectedUnit?.districtName}</p>
            </Paragraph>
          </Col>
          <Col span={8}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t("view.map.ward_id")}
              </p>
              <p>{selectedUnit?.wardName}</p>
            </Paragraph>
          </Col>

          <Col span={12}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t("view.map.longitude")}
              </p>
              <p>{selectedUnit?.long_}</p>
            </Paragraph>
          </Col>
          <Col span={12}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t("view.map.latitude")}
              </p>
              <p>{selectedUnit?.lat_}</p>
            </Paragraph>
          </Col>
        </Row>

        <div className="btn--submit">
          <Button type="primary" onClick={handleShowModal}>
            {t("view.camera.close")}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ModalViewDetail;
