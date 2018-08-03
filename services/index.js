import createUserService from './user'
import createItemService from './item'
import createOrderService from './order'
import createBalanceService from './balance'
import createMiscService from './misc'
import createChatService from './chat'

export default function injectService(axiosInst) {
  const services = {
    user: createUserService(axiosInst),
    item: createItemService(axiosInst),
    order: createOrderService(axiosInst),
    misc: createMiscService(axiosInst),
    balance: createBalanceService(axiosInst),
    chat: createChatService(axiosInst),
  }

  Object.assign(axiosInst, services)

  return axiosInst
}
