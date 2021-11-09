import {axiosCamproxyCtrlInstance} from '../../@core/api/boot/axios'
import useService from '../../@core/api/panda/useService'

const {serviceApi} = useService(axiosCamproxyCtrlInstance, {})
export default serviceApi
