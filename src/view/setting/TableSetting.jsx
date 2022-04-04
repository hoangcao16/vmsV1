import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

const TableSetting = () => {
  useEffect(() => {
    document.title = "CCTV | Setting";
  }, []);

  return (
    <>
      <h1>Setting</h1>
    </>
  );
};

export default withRouter(TableSetting);
