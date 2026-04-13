import { request } from '@/lin/plugin/axios'

export function uploadFiles(data) {
  return request({
    method: 'post',
    url: 'cms/file',
    data,
  })
}

export function uploadSingleFile(file) {
  return request({
    method: 'post',
    url: '/cms/file',
    data: {
      file,
    },
  })
}
