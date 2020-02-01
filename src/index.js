import './index.css';

import {h,useState} from 'preact-plus';
import {List} from 'List'

import * as utils from 'utils';
import {topLevelCategories} from 'enum'

import data from './old/data.js'

const defaultDate=new Date('1/1/2019')

const mkTransactions=(csv=data)=>utils.csv2json(csv)
	.filter(({from=''})=>!!from.length)
	.map(({amount,...props})=>({...props,amount:amount.length?parseFloat(amount):0}))
	// .map(
	// 	({date,...props})=>(
	// 		{date:(date.length?new Date(date):defaultDate).valueOf(),...props}
	// 	)
	// )



const mkState=transactions=>
{
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

	return {accounts,subTotals}
}

const decimal2bgSize=decimal=>`background-size:${(decimal*100).toFixed(2)}% 100%;`

export default ()=>
{
	//state
	const [transactions]=useState(mkTransactions())
	const [state,setState]=useState(mkState(transactions))
	//view
	const [dateString,setDate]=useState(new Date().toLocaleDateString('en-ca'))
	console.log(state)
	//ui
	const header=h.header({},
		h.input(
			{
				type:'date',
				value:dateString,
				onchange:evt=>
				{
					const dateString=evt.currentTarget.value
					const viewDate=new Date(dateString)

					setDate(dateString)
					setState(mkState(transactions.filter(({date})=>new Date(date)<=viewDate)))
				}
			}
		)
	);
	const list= List({
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
	return [header,list]
}
