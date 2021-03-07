import { Toast } from 'vant';
class Methods{
    verification(o) {
        for (let k in o) {
            if (!o[k].reg.test(o[k].value)) {
                Toast({
                    message: o[k].errorMsg,
                    duration: 2000,
                    forbidClick:true
                })
                return false;
            }
        }
        return true
    }
}
export const methods = new Methods();