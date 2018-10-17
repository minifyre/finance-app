import truth from './node_modules/truth/truth.mjs'//@todo get into util
import v from './node_modules/v/v.mjs'

import silo from './output.mjs'
export default silo
const {config,util,logic,input,output}=silo()

truth(logic(),truth.compile(({state})=>v.render(document.querySelector('main'),state,output)))