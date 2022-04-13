import MyService from "../service";

const AICameraApi = {
  getAllCameraAI: async (params) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/cameras/ai`,
        params
      );
    } catch (error) {
      console.log(JSON.stringify(error));
    }
    return result?.payload;
  },
};

export default AICameraApi;
