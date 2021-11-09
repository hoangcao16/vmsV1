import {axiosLionInstance} from '../../@core/api/boot/axios'
import useService from '../../@core/api/lion/useService'

const {lionApi} = useService(axiosLionInstance, {})

export default lionApi
