import { UPDATE_DATA } from "../../types/live";

const dataMaxLength = 100;

const updateData = (data = {}, action) => {
  switch (action.type) {
    case UPDATE_DATA.LOAD_SUCCESS:
      let changeData = action.dataBody;

      if (changeData.reset) {
        data[changeData.cameraUuid] = [];

        return { ...data };
      }

      if (!changeData || !changeData.cameraUuid) {
        return data;
      }

      if (!data[changeData.cameraUuid]) {
        data[changeData.cameraUuid] = [];
      }

      const currentUseCases = data[changeData.cameraUuid].filter(
        (obj) => obj.useCase === changeData.useCase
      );

      if (currentUseCases.length >= dataMaxLength) {
        data[changeData.cameraUuid].pop();
      }

      data[changeData.cameraUuid] = [
        changeData,
        ...data[changeData.cameraUuid],
      ];

      return {
        ...data,
      };
    default:
      return data;
  }
};

export default updateData;
