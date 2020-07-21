// 检测官方文档: https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
/** 类型检测掩码集合 */
const patternMask = [
  {
    name: 'image/x-icon',
    mask: [0xff, 0xff, 0xff, 0xff],
    byte: [0x00, 0x00, 0x01, 0x00],
  },
  {
    name: 'image/x-icon',
    mask: [0xff, 0xff, 0xff, 0xff],
    byte: [0x00, 0x00, 0x02, 0x00],
  },
  {
    name: 'image/bmp',
    mask: [0xff, 0xff],
    byte: [0x42, 0x4d],
  },
  {
    name: 'image/gif',
    mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    byte: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
  },
  {
    name: 'image/gif',
    mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    byte: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  },
  {
    name: 'image/webp',
    mask: [0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    byte: [0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50],
  },
  {
    name: 'image/png',
    mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    byte: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  },
  {
    name: 'image/jpeg',
    mask: [0xff, 0xff, 0xff],
    byte: [0xff, 0xd8, 0xff],
  },
]

/** 判断是否是空对象 */
export function isEmptyObj(data) {
  if (!data) return true
  return JSON.stringify(data) === '{}'
}

/** 生成随机字符串 */
export function createId() {
  return Math.random()
    .toString(36)
    .substring(2)
}

/**
 * 检测是否是动图
 * 主要针对 Gif 和 Webp 两种格式
 */
export async function checkIsAnimated({ file, fileUrl, fileType }) {
  // 参数验证
  if (!file || !(file instanceof File)) {
    console.error('isAnimated param check fail: param expected to be File object')
    return false
  }
  // 如果不是 gif 和 webp, 默认作为非动图
  if (fileType !== 'image/webp' && fileType !== 'image/gif') {
    return false
  }

  if (fileType === 'image/webp') {
    return new Promise(resolve => {
      const request = new XMLHttpRequest()
      request.open('GET', fileUrl, true)
      request.addEventListener('load', () => {
        resolve(request.response.indexOf('ANMF') !== -1)
      })
      request.send()
    })
  }
  if (fileType === 'image/gif') {
    return new Promise(resolve => {
      const request = new XMLHttpRequest()
      request.open('GET', fileUrl, true)
      request.responseType = 'arraybuffer'
      request.addEventListener('load', () => {
        const arr = new Uint8Array(request.response)
        // make sure it's a gif (GIF8)
        if (arr[0] !== 0x47 || arr[1] !== 0x49 || arr[2] !== 0x46 || arr[3] !== 0x38) {
          resolve(false)
          return
        }

        // ported from php http://www.php.net/manual/en/function.imagecreatefromgif.php#104473
        // an animated gif contains multiple "frames", with each frame having a
        // header made up of:
        // * a static 4-byte sequence (\x00\x21\xF9\x04)
        // * 4 variable bytes
        // * a static 2-byte sequence (\x00\x2C) (some variants may use \x00\x21 ?)
        // We read through the file til we reach the end of the file, or we've found
        // at least 2 frame headers
        let frames = 0
        for (let i = 0, len = arr.length - 9; i < len && frames < 2; ++i) {
          if (
            arr[i] === 0x00
            && arr[i + 1] === 0x21
            && arr[i + 2] === 0xf9
            && arr[i + 3] === 0x04
            && arr[i + 8] === 0x00
            && (arr[i + 9] === 0x2c || arr[i + 9] === 0x21)
          ) {
            frames++
          }
        }

        // if frame count > 1, it's animated
        resolve(frames > 1)
      })
      request.send()
    })
  }
}

/**
 * 检测文件类型
 * 使用文件编码进行检测
 * 支持模式参看: patternMask 定义
 */
export async function getFileType(file) {
  if (!(file instanceof File)) {
    return 'unknown'
  }
  return new Promise(resolve => {
    const fileReader = new FileReader()
    fileReader.onloadend = e => {
      const header = new Uint8Array(e.target.result).slice(0, 20)
      let type = 'unknown'

      // eslint-disable-next-line arrow-body-style
      const index = patternMask.findIndex(item => {
        // eslint-disable-next-line arrow-body-style
        return item.mask.every((subItem, subI) => {
          // subItem 掩码标志
          // item.byte[subI] 规范值
          // header[subI] 文件实际值
          // eslint-disable-next-line
          return (subItem & (header[subI] ^ item.byte[subI])) === 0
        })
      })

      if (index >= 0) {
        type = patternMask[index].name
      }

      resolve(type)
    }
    fileReader.readAsArrayBuffer(file)
  })
}
