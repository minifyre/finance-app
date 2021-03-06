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
		transactions:false,
		type:'finance-app'
	}
}
config.style=`
html,
body,
main
{
	font:Arial, Helvetica, sans-serif;
	display:flex;
	flex-direction:column;
	height:100%;
	margin:0;
	padding:0;
	width:100%;
}
.list
{
	background-color:#eee;
	height:calc(100% - 2rem);
	position:relative;
	overflow-y:scroll;
	width:100%;
}
.list dd
{
	background-image:linear-gradient(#cfc,#cfc);
}
dd:before
{
	content:attr(data-percent);
}
/*settings*/
.hide-zeros [data-value="0"]
{
	display:none;
}
[data-day]:before
{
	content:attr(data-day);
}
[data-type="assets"] [data-type="1"]:before,
[data-type="liabilities"] [data-type="1"]:before
{
	background-color:#c00;
}
[data-type="assets"] [data-type="-1"]:before,
[data-type="liabilities"] [data-type="-1"]:before
{
	background-color:#0c0;
}

.list
{
	background:#eee;
	box-sizing:border-box;
}
.list dd,
.list dt
{
	box-sizing:border-box;
	display:block;
	border-bottom:1px solid #222;
	position:relative;
	-webkit-margin-start:0;
}
.list dd
{
	background-color:#fff;
	background-position:1.5rem 0%;
	background-repeat:no-repeat;
	color:#222;
	padding:0.25rem 0.5rem;
	padding-left:1.75rem;
	width:100%;
}
.list dt
{
	color:#222;
	padding:0.125rem;
	padding-left:0.25rem;
}

.list dd:before
{
	background-color:#666;
	background-position:50% 50%;
	background-repeat:no-repeat;
	background-size:100% auto;
	color:#fff;
	content:"";
	font-size:1rem;
	font-weight:bold;
	height:100%;
	left:0;
	line-height:1.5rem;
	position:absolute;
	text-align:center;
	top:0;
	vertical-align:middle;
	width:1.5rem;
}
.list dd:after
{
	content:"";
	height:100%;
	position:absolute;
	right:0;
	top:0;
	width:0.5rem;
}
.list dd:hover
{
	cursor:pointer;
}`