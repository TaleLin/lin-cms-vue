import pluginViewConfig from '../plugins/configs.json'

function foramtViewConfig(view) {
  return {
    path: view.route,
    name: view.name,
    component: () => import(`@/${view.filePath}`),
    meta: {
      title: view.title,
      icon: view.icon,
    },
  }
}

function deepAddViewRoute(obj, fuc) {
  if (obj.type === 'directory') {
    obj.children.forEach((item) => {
      deepAddViewRoute(item, fuc)
    })
  } else if (obj.type === 'view') {
    fuc(obj)
  }
}

const pluginRoute = []

Object.keys(pluginViewConfig).forEach((plugin) => {
  deepAddViewRoute(pluginViewConfig[plugin], (viewObj) => {
    pluginRoute.push(foramtViewConfig(viewObj))
  })
})

export default pluginRoute
