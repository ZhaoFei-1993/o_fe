import createUserService from './user'
import createItemService from './item'

export default function injectService(axiosInst) {
  const services = {
    user: createUserService(axiosInst),
    item: createItemService(axiosInst),
  }

  Object.assign(axiosInst, services)

  return axiosInst
}
