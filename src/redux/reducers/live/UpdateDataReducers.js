import { UPDATE_DATA } from "../../types/live";

const dataMaxLength = 100;

const firstData = [];

const updateData = (data = [], action) => {
  switch (action.type) {
    case UPDATE_DATA.LOAD_SUCCESS:
      firstData.unshift(action.dataBody);
      while (firstData.length > dataMaxLength) {
        firstData.pop();
      }
      let dataSource = [];
      firstData.forEach((i) => {
        const changeData = JSON.parse(i);
        dataSource.push(changeData);
      });
      const arrayIndex = [];
      for (let i = 0; i < dataSource.length; i++) {
        let a = Object.keys(dataSource[i]).length;
        if (a < 1) {
          arrayIndex.push(dataSource.indexOf(dataSource[i]));
        }
      }
      const min = Math.min(...arrayIndex)
      const lastData = dataSource.slice(0, min)
      return lastData;
    default:
      return data;
  }
};

export default updateData;
