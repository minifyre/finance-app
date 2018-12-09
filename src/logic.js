import silo from './util.mjs'
export default silo
const {config,util,logic}=silo(function logic(opts)
{
	return Object.assign({},config.state,opts)
})

logic.addAccount=function(state,type,name,balance)
{
	if(!state.file.accounts[type][name]) state.file.accounts[type][name]=balance||0
}
logic.getEntriesForAccount=(state,acct)=>state.file.entries.filter(entry=>entry.from==acct||entry.to==acct)
//determines if transaction is a net gain or loss based on account type
logic.getModifiers=(from,to)=>[[-1,0,1,1],[1,1,-1,0]][from][to]
logic.getTypes=()=>['assets','expenses','liabilities','revenue']//@todo replace with Object.keys(state.accounts)
logic.parseJSON=function(arr)
{
	const
	state=logic(),
	{addAccount,getTypes}=logic,
	types=getTypes()

	arr.forEach(function(entry)
	{
		const {date,from,to,value}=entry

		if(types.indexOf(from)!==-1) addAccount(state,from,to,parseFloat(value))
		else
		{
			entry.date=new Date(date||0).valueOf()//Date.now()?!!//variable type changes, bad perf...!!
			entry.value=parseFloat(value)
			state.file.entries.push(entry)
		}
	})
	return state
}
logic.open=function(state,data)
{
	state.file=logic.parseJSON(util.csv2json(data)).file//@todo use compose here
}
logic.searchAccounts=function({file:{accounts}},str)
{
	return Object.keys(accounts).find(type=>accounts[type][str]!==undefined)
}