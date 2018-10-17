import silo from './config.mjs'
export default silo
const {config,util}=silo()

import truth from './node_modules/truth/truth.mjs'
import v from './node_modules/v/v.mjs'
Object.assign(util,{truth,v})

util.csv2json=function(csv)
{//@todo handle "values with,commas"
	const
	[props,...entries]=csv.split(/\r?\n/).map(x=>x.split(',')),
	arr2obj=(obj,val,i)=>Object.assign(obj,{[props[i]]:val})

	return entries.map(vals=>vals.reduce(arr2obj,{}))
}
util.flatten=(x,y)=>[...x,...y]
util.num2currency=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format
util.sum=(...nums)=>nums.reduce((sum,num)=>sum+num,0)