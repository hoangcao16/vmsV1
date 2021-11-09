import {axiosCheetahInstance} from '../../@core/api/boot/axios'
import useService from '../../@core/api/cheetah/useService'

const {cheetahApi} = useService(axiosCheetahInstance, {})

export default cheetahApi
