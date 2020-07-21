import storage from 'good-storage'

const LOGIN_KEY = '__login__'

export function setLogined(flag) {
  storage.session.set(LOGIN_KEY, flag)
  return flag
}

export function loadLogined() {
  return storage.session.get(LOGIN_KEY, '')
}

export function cleanLogined() {
  storage.session.remove(LOGIN_KEY)
}
