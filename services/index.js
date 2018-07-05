import createUserService from './user'

export default function injectService(axiosInst) {
  let services = {
    user: createUserService(axiosInst),
  }

  Object.assign(axiosInst, services)

  return axiosInst
}
