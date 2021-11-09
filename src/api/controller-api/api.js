import {
    axiosCoreInstance,
} from '../../@core/api/boot/axios';
import useControllerSvc from '../../@core/api/controller/useService';

const {controllerApi} = useControllerSvc(axiosCoreInstance, {});


export default controllerApi;
