import { MAX_SUCCESS_CODE } from '@/config/global'

export function isSuccessfulResponse(response = {}, successCode = MAX_SUCCESS_CODE) {
  return Number.isFinite(response?.code) && response.code < successCode
}

export function isFailedResponse(response = {}, successCode = MAX_SUCCESS_CODE) {
  return !isSuccessfulResponse(response, successCode)
}
