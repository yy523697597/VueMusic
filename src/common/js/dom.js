// 为元素添加类名
export function addClass(el, className) {
    if (hasClass(el, className)) {
        return
    } else {
        let newClassName = el.className.split(' ')
        newClassName.push(className)
        el.className = newClassName.join(' ')
    }
}

// 判断元素是否有指定类名
export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}