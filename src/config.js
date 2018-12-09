import silo from './node_modules/silo/index.mjs'
export default silo
const {config}=silo()

config.state=
{
	file:
	{
		accounts:
		{
			assets:{},
			expenses:{},
			liabilities:{},
			revenue:{}
		},
		entries:[]
	},//@used to trigger showing transaction history for an account
	view:
	{
		transactions:false
	}
}