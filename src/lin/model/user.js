import _axios, { post, get, put } from '@/lin/plugin/axios'
import { saveTokens } from '../util/token'
import store from '@/store'

export default class User {
  /**
   * 分配用户
   * @param {object} data 注册信息
   */
  static register(data) {
    return _axios({
      method: 'post',
      url: 'cms/user/register',
      data,
      handleError: true,
    })
  }

  /**
   * 登陆获取tokens
   * @param {string} username 用户名
   * @param {string} password 密码
   */
  static async getToken(username, password) {
    const tokens = await post('cms/user/login', {
      username,
      password,
    })
    saveTokens(tokens.access_token, tokens.refresh_token)
    return tokens
  }

  /**
   * 获取当前用户信息，并返回User实例
   */
  static async getInformation() {
    const info = await get('cms/user/information')
    const storeUser = store.getters.user === null ? {} : store.getters.user
    return Object.assign({ ...storeUser }, info)
  }

  /**
   * 获取当前用户信息和所拥有的权限
   */
  static async getPermissions() {
    const info = await get('cms/user/permissions')
    const storeUser = store.getters.user === null ? {} : store.getters.user
    return Object.assign({ ...storeUser }, info)
  }

  /**
   * 用户修改密码
   * @param {string} newPassword 新密码
   * @param {string} confirmPassword 确认新密码
   * @param {string} oldPassword 旧密码
   */
  static updatePassword({ old_password, new_password, confirm_password }) {
    return put('cms/user/change_password', {
      new_password,
      confirm_password,
      old_password,
    })
  }
}
