import { responseCheckerErrorsController } from "../../function/MyUltil/ResponseChecker";
import MyService from "../service";
const TagApi = {
    getAllTags: async(data) => {
        try {
            const result = await MyService.getRequestData(
                `/cctv-controller-svc/api/v1/tags_key?key=${data?.name}`
            );
            if (responseCheckerErrorsController(result) === null) {
                return [];
            }
            return result.payload;
        } catch (error) {
            console.log(error);
        }
    },

    getTagById: async(tagId) => {
        try {
            const result = await MyService.getRequestData(
                `/cctv-controller-svc/api/v1/tags_key/${tagId}`
            );
            if (responseCheckerErrorsController(result) === null) {
                return [];
            }
            return result.payload;
        } catch (error) {
            console.log(error);
        }
    },

    updateTagById: async(tagId, payload) => {
        try {
            const result = await MyService.putRequestData(
                `/cctv-controller-svc/api/v1/tags_key/${tagId}`,
                payload
            );
            if (responseCheckerErrorsController(result) === null) {
                return false;
            }
            return true;
        } catch (error) {
            console.log(error);
        }
    },

    deleteTagById: async(uuid) => {
        let result;
        try {
            result = await MyService.deleteRequestData(
                `/cctv-controller-svc/api/v1/tags_key/${uuid}`
            );
            if (responseCheckerErrorsController(result) === null) {
                return false;
            }
            return true;
        } catch (error) {
            console.log(error);
        }
    },
    addTag: async(payload) => {
        try {
            const result = await MyService.postRequestData(
                "/cctv-controller-svc/api/v1/tags_key",
                payload
            );
            if (responseCheckerErrorsController(result) === null) {
                return false;
            }
            return true;
        } catch (error) {
            console.log(error);
        }
    },
};

export default TagApi;