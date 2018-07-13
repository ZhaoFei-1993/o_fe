import createUserService from './user'
import createItemService from './item'
import createOrderService from './order'

export default function injectService(axiosInst) {
  const services = {
    user: createUserService(axiosInst),
    item: createItemService(axiosInst),
    order: createOrderService(axiosInst),
  }

  Object.assign(axiosInst, services)

  return axiosInst
}
