import './index.css';

import {h,useState} from 'preact-plus';
import {List} from 'List'

import * as utils from 'utils';
import {topLevelCategories} from 'enum'

import data from './old/data.js'

const mkState=()=>
{
	const transactions=utils.csv2json(data)
		.filter(({from=''})=>!!from.length)
		.map(({amount,...props})=>({...props,amount:amount.length?parseFloat(amount):0}))

	const unorderedAccounts=transactions.reduce((accounts,{from,to,amount})=>
	{
		if(topLevelCategories.includes(from)) return Object.assign(accounts,{[to]:{parent:from,amount}})

		const fromMod=utils.getModifiers(true,topLevelCategories.indexOf(accounts[from].parent))
		const toMode=utils.getModifiers(false,topLevelCategories.indexOf(accounts[to].parent))

		accounts[from].amount+=amount*fromMod
		accounts[to].amount+=amount*toMode
		return accounts
	},{})

	const subAccounts=topLevelCategories
	.map(
		cat=>
			Object.entries(unorderedAccounts)
			.filter(([,{parent}])=>parent===cat)
			.sort(([a],[b])=>a.toLowerCase()>b.toLowerCase()?1:-1)
	)

	const accounts=subAccounts.flat()
		.reduce((obj,[prop,val])=>Object.assign(obj,{[prop]:val}),{})

	const subTotals=subAccounts.map(
		accounts=>accounts.reduce((sum,[,{amount}])=>sum+amount,0)
	)
	.reduce((totals,total,i)=>Object.assign(totals,{[topLevelCategories[i]]:total}),{})

	return {accounts,transactions,subTotals}
}

const decimal2bgSize=decimal=>`background-size:${(decimal*100).toFixed(2)}% 100%;`

export default ()=>
{
	const [state,setState]=useState(mkState())

	return List({
		items:Object.entries(state.accounts),
		ui:
		{
			desc:([account,{amount}])=>`${utils.capitalize(account)}: ${utils.num2currency(amount)}`,
			descProps:([,{amount,parent}])=>
				({'data-type':parent,style:decimal2bgSize(amount/state.subTotals[parent])}),
			icon:()=>'',
			subheadings:([,{parent}],i,accounts)=>parent!==(accounts[i-1]||[,{}])[1].parent
				?[parent+': '+utils.num2currency(state.subTotals[parent])]
				:[]
		},
		state:
		{
			selected:[],
			selectMultiple:false,
		}
	})
}
