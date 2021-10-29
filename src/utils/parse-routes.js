export const parseRoutes = (routes) => {
  let psRoutes = []
  routes.forEach(router => {
    let {
      path,
      component,
      name,
      meta,
      parentId,
      children,
      folder
    } = router
    if (children && children instanceof Array) {
      children = parseRoutes(children)
    }
    let psRouter = {
      path: path,
      name: name,
      meta: meta,
      parentId: parentId,
      children: children,
      folder: folder,
      component(resolve) {
        // 此处的动态路由拼接必须至少要在前面加'@/'或者'../',('@/'表示src的目录)这样在编译的所有模块，但是运行时才会确定变量的值，这样来实现懒加载。
        // '@/'和'../'区别：../是可以直接ctrl路径找到该文件，@/则不能。
        if (parentId === 1) {
          // require(['../components' + component], resolve)
          require(['@/components' + component], resolve)
        } else {
          // require(['../views' + component], resolve)
          require(['@/views' + component], resolve)
        }
      }
    }
    psRoutes.push(psRouter)
  })
  return psRoutes
}
