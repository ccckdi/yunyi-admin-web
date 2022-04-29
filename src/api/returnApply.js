import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/order/refundList',
    method:'get',
    params:params
  })
}

export function deleteApply(params) {
  return request({
    url:'/returnApply/delete',
    method:'post',
    params:params
  })
}
export function updateApplyStatus(id,data) {
  return request({
    url:'/returnApply/update/status/'+id,
    method:'post',
    data:data
  })
}
export function agreeRefund(id) {
  return request({
    url:'/order/agreeRefund/'+id,
    method:'post'
  })
}
export function refusedRefund(id) {
  return request({
    url:'/order/refusedRefund/'+id,
    method:'post'
  })
}
export function getApplyDetail(id) {
  return request({
    url:'/returnApply/'+id,
    method:'get'
  })
}
