import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll/ZoomScroll'

ZoomScrollModule.prototype.scroll = () => {} // 只要原型链上这个方法为空即可，方法有很多。

export default {
  __init__: ['zoomScroll'],
  zoomScroll: ['type', ZoomScrollModule]
}
