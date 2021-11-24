import { Skeleton, Tooltip } from "antd";
import { isEmpty } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";

const MapAdminisUnitList = ({
  adUnits,
  handleSelectAdUnitCallback,
  isOpenForm,
  handleFocusAdUnitCallback,
  isLoading,
}) => {
  const { t } = useTranslation();
  const handleSelectAdUnit = (adUnit, index) => {
    if (isOpenForm) {
      handleSelectAdUnitCallback(adUnit, index);
    } else {
      handleFocusAdUnitCallback(adUnit);
    }
  };

  return (
    <ul className="mt-1 list-unstyled border p-1 h-100">
      <Skeleton loading={isLoading} active paragraph={{ rows: 10 }}>
        {!isEmpty(adUnits) ? (
          adUnits?.map((ad, index) => (
            <li key={index}>
              <div
                className="camera-list__cam"
                onClick={() => handleSelectAdUnit(ad, index)}
                value={index}
              >
                <Tooltip
                  placement="left"
                  zIndex={190000000}
                  align={"center"}
                  autoAdjustOverflow={true}
                  arrowPointAtCenter={true}
                  overlayClassName="camera-list__cam__tooltip"
                  title={() => (
                    <div>
                      <p>
                        {t("view.map.name")}: {ad.name}
                      </p>
                      <p>
                        {t("view.map.address")}: {ad.address}
                      </p>
                      <p>
                        {t("view.map.phone_number")}: {ad.tel}
                      </p>
                    </div>
                  )}
                >
                  <span className="camera-list__cam__text">{ad.name}</span>
                </Tooltip>
              </div>
            </li>
          ))
        ) : (
          <div style={{ color: "white", padding: 10 }}>
            {t("view.user.detail_list.no_valid_results_found")}
          </div>
        )}
      </Skeleton>
    </ul>
  );
};

export default MapAdminisUnitList;
