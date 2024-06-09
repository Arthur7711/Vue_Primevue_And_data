export function throttle (func, ms){
    let isThrottled = false
    let savedArgs
    let savedThis
    function wrapper() {
        if(isThrottled){
            savedThis = this
            savedArgs = arguments
            return
        }
        func.apply(this, arguments)
        isThrottled = true
        setTimeout(function () {
            isThrottled = false
            if(savedArgs){
                wrapper.apply(savedArgs, savedThis)
                savedArgs = savedThis=null
            }
        }, ms)
    }
    return wrapper
}