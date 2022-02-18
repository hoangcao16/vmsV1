import { UPDATE_DATA } from "../../types/live";

const DataMaxLength = 100;

const firstData = [];

const updateData = (data = [], action) => {
  switch (action.type) {
    case UPDATE_DATA.LOAD_SUCCESS:
      firstData.unshift(action.message.body);
      while (firstData.length > 100) {
        firstData.pop()
      }
      let dataSource = [];
      firstData.forEach((i) => {
        const changeData = JSON.parse(i)
        dataSource.push(changeData)
      })
      return dataSource;
    default:
      return data;
  }
};

export default updateData;
