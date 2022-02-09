import AIService from "../ai-service";
import {handleErrCodeAI} from "../../function/MyUltil/ResponseChecker";

const CameraAIApi = {
    getCameraInfoByUuid: async (params) => {
        let result;
        try {
            result = await AIService.getRequestData(
                `/api/v1/camera/${params?.cameraUuid}`
            );
        } catch (error) {
            console.log(JSON.stringify(error));
        }
        if (handleErrCodeAI(result) === null) {
            return [];
        }
        return result.payload;
    },
}

export default CameraAIApi;