import silo from './logic.mjs'
export default silo
const {config,util,logic,input}=silo()

input.file=function({target},state)
{
	const {files}=target
	if(files.length)
	{
		const
		[file]=files,
		blob=file.slice(0,file.size),
		handlers={onloadend:evt=>input.onloadend(evt,state)}

		Object.assign(new FileReader(),handlers).readAsText(blob)
	}
}
input.onloadend=function({target:{readyState,result}},state)
{
	if(readyState===FileReader.DONE) logic.open(state,result)
}
input.accountHistory=function({target},state)
{
	if(target.nodeName.toLowerCase()!=='dd') return
	state.view.transactions=target.getAttribute('data-account')//@todo move into logic
}