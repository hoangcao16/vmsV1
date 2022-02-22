import { isEmpty } from "lodash";
import { UPDATE_DATA } from "../../types/live";

const dataMaxLength = 100;

const dataSource = [];
const idArray = [];
let liveModeType = {};

const updateData = (data = [], action) => {
  switch (action.type) {
    case UPDATE_DATA.LOAD_SUCCESS:
      const lastData = [];
      let changeData = JSON.parse(action.dataBody);
      dataSource.unshift(changeData);

      if (isEmpty(changeData.cameraUuid)) {
        dataSource.shift()
      }

      //reject all data after change liveMode (still keep another cameraUuid's data)
      if (Object.values(changeData).length <= 2) {
        liveModeType = changeData.useCase;
        for (let a = dataSource.length - 1; a >= 0; a--) {
          if (dataSource[a].cameraUuid == dataSource[0].cameraUuid) {
            dataSource.splice(a, 1);
          }
        }
      }

      //reject data are different from liveModeType
      for (let a = 0; a < dataSource.length; a++) {
        if (dataSource[a].useCase !== liveModeType) {
          dataSource.splice(a, 1);
        }
      }

      //get list of cameraUuid
      for (let i = 0; i < dataSource.length; i++) {
        if (!idArray.includes(dataSource[i].cameraUuid)) {
          idArray.push(dataSource[i].cameraUuid);
        }
      }

      //make sure cameraUuid's data at most 100 element
      idArray.map((i) => {
        let dataConvert = [];
        dataSource.map((j) => {
          if (j.cameraUuid == i) {
            dataConvert.push(j);
          }
        });

        while (dataConvert.length > dataMaxLength) {
          dataConvert.pop();
        }
        lastData.push(...dataConvert);
      });

      return lastData;
    default:
      return data;
  }
};

export default updateData;
