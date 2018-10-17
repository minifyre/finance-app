import silo from './output.mjs'
export default silo
const
{config,util,logic,input,output}=silo(),
{truth,v}=util

truth(logic(),truth.compile(({state})=>v.render(document.querySelector('main'),state,output)))