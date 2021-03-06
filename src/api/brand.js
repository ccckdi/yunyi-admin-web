import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/brand/list',
    method:'get',
    params:params
  })
}
export function createBrand(data) {
  return request({
    url:'/brand/create',
    method:'post',
    data:data
  })
}
export function updateStatus(id,data) {
  return request({
    url:'/brand/updateStatus/'+id,
    method:'post',
    data:data
  })
}

export function deleteBrand(id) {
  return request({
    url:'/brand/delete/'+id,
    method:'post',
  })
}

export function getBrand(id) {
  return request({
    url:'/brand/'+id,
    method:'get',
  })
}

export function updateBrand(id,data) {
  return request({
    url:'/brand/update/'+id,
    method:'post',
    data:data
  })
}

