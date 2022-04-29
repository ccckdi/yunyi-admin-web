import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/advertise/list',
    method:'get',
    params:params
  })
}
export function updateStatus(id,params) {
  return request({
    url:'/advertise/updateStatus/'+id,
    method:'post',
    params:params
  })
}
export function deleteHomeAdvertise(id) {
  return request({
    url:'/advertise/delete/'+id,
    method:'post'
  })
}
export function createHomeAdvertise(data) {
  return request({
    url:'/advertise/create',
    method:'post',
    data:data
  })
}
export function getHomeAdvertise(id) {
  return request({
    url:'/advertise/'+id,
    method:'get',
  })
}

export function updateHomeAdvertise(id,data) {
  return request({
    url:'/advertise/update/'+id,
    method:'post',
    data:data
  })
}
