output.render=function(state)
{
	const
	{accounts,entries}=JSON.parse(JSON.stringify(state.file)),
	{getModifiers,searchAccounts}=logic,
	types=Object.keys(accounts),
	getCategory=acct=>searchAccounts(state,acct)

	//@todo move this into logic?
	//add entry results to account values
	entries.forEach(function({from,to,value})
	{
		;[from,to]
		.map(acct=>[acct,getCategory(acct)])
		.forEach(([acct,cat],i)=>accounts[cat][acct]+=value*getModifiers(i,types.indexOf(cat)))
	})

	const
	items=types.map(function(type)
	{
		const
		vals=Object.values(accounts[type]),
		total=util.sum(...vals),
		max=Math.max(...vals.sort((a,b)=>b-a).slice(1))//filter out outlier

		return [v('dt',{},type+': '+util.num2currency(total)),
			...Object.entries(accounts[type])
			.map(function([account,value])
			{
				const
				percent=(value/max)*100,
				style='background-size:calc('+percent+'% - 1.5rem) 100%;',
				data={account,percent:Math.floor(percent),value}
	
				return v('dd',{data,style},account+': '+util.num2currency(value))
	
			})
		]
	})
	.filter(arr=>arr.length>1)
	.reduce(util.flatten,[]),
	click=evt=>input.accountHistory(evt,state)//@todo curry state

	return [v('header',{},
			v('input',{on:{change:evt=>input.file(evt,state)},type:'file'})
		),
		v('dl.list',{on:{click}},...items)
	]
}
output.list=function(arr)
{
	const state=logic.parseJSON(arr)//@todo eliminate
}
output.acctHistory=function(state,acct)//@todo integrate into output
{
	const type=logic.searchAccounts(state,acct)

	let initial=state.accounts[type][acct]
	
	const entries=logic.getEntriesForAccount(state,acct)

	let lastMonth=''

	const items=entries.reduce(function(items,{date:dateStr,from,to,value})
	{	
		const
		isTo=to===acct,
		transactionType=isTo?0:1,//0=from,1=to
		otherAccount=isTo?from:to,
		txt=otherAccount+': '+util.num2currency(value),
		i=Object.keys(state.accounts).indexOf(type),
		modifier=logic.getModifiers(transactionType,i)

		initial+=value*modifier

		const [_,day,month]=new Date(dateStr).toUTCString().split(' ')
	
		if(lastMonth!==month)
		{
			items.push(v('dt',{},month))
			lastMonth=month
		}

		return [...items,v('dd',{data:{day}},txt)]
	},[])

	return v('dl.list',{data:{type}},
		...items,
		v('dd',{},'Initial Value: '+util.num2currency(initial))
	)
}