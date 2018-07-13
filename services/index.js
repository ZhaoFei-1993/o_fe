import createUserService from './user'
import createItemService from './item'
import createOrderService from './order'
import createBalanceService from './balance'

export default function injectService(axiosInst) {
  const services = {
    user: createUserService(axiosInst),
    item: createItemService(axiosInst),
    order: createOrderService(axiosInst),
    balance: createBalanceService(axiosInst),
  }

  Object.assign(axiosInst, services)

  return axiosInst
}
