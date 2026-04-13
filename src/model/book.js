import { get, put, request, _delete } from '@/lin/plugin/axios'

export function createBook(data) {
  return request({
    method: 'post',
    url: 'v1/book',
    data,
  })
}

export function getBook(id) {
  return get(`v1/book/${id}`)
}

export function editBook(id, info) {
  return put(`v1/book/${id}`, info)
}

export function deleteBook(id) {
  return _delete(`v1/book/${id}`)
}

export function getBooks() {
  return request({
    method: 'get',
    url: 'v1/book',
  })
}
