import { post, get, put } from '@/lin/plugins/axios'
import { saveTokens } from '../utils/token'

export default class User {
  // 昵称
  nickname = null

  // 邮箱
  email = null

  avatar = null // 头像

  // 所属分组信息
  groups = []

  // 用户名
  username = null

  // 是否为超级管理员
  isSuper = null

  // 拥有的权限
  permissions = []

  constructor(nickname, username, admin, groups, permissions, email, avatar) {
    this.email = email
    this.groups = groups
    this.username = username
    this.avatar = avatar
    this.isSuper = admin
    this.permissions = permissions || []
    this.nickname = nickname
  }

  /**
   * 分配用户
   * @param {object} data 注册信息
   */
  static register(data) {
    return post('cms/user/register', data, { handleError: true })
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
    return new User(info.nickname, info.username, info.admin, info.groups, info.permissions, info.email, info.avatar)
  }

  /**
   * 获取当前用户信息和所拥有的权限
   */
  static async getPermissions() {
    const info = await get('cms/user/permissions')
    return new User(info.nickname, info.username, info.admin, info.groups, info.permissions, info.email, info.avatar)
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
