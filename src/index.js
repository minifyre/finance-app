import silo from './node_modules/silo/index.js'
import truth from './node_modules/truth/truth.mjs'
import v from './node_modules/v/v.mjs'

const {config,util,logic,output,input}=silo

export default silo(async function()
{
	customElements.define(config.state.view.type,class extends silo.customElement
	{
		constructor(state)
		{
			super(state,silo)
		}
	})
})