const child_process = require('child_process')

// 执行命令
function exec(cmd) {
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, (error, stdout) => {
      if (error) {
        reject(error)
      }
      resolve(stdout)
    })
  })
}

module.exports = exec
