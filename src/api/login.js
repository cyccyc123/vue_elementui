import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/ucenterservice/cyc_user/adminlogin',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/ucenterservice/cyc_user/info',
    method: 'get',
    params: { token }
  })
}


