import useAuth from '../../@core/api/authz/useService.js'
import { axiosAuthzInstance } from '../../@core/api/boot/axios'

const { authzApi } = useAuth(axiosAuthzInstance, {})
export default authzApi
