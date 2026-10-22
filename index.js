/*
 *	pane p1p4 buttons
 *	formatting
 *	reassignment (consider new categories, cards, shield & sword, staples, searchers)
 *	upload on github
 *	get ssl
 */

let p1p2p1p1=document.getElementById('p1p2p1p1');
let p1p3t1=document.getElementById('p1p3t1');
let p1p3t2=document.getElementById('p1p3t2');
let p1p3p1=document.getElementById('p1p3p1');
let p1p3bt1=document.getElementById('p1p3bt1');
let p1p3bt2=document.getElementById('p1p3bt2');
let p1p3t3=document.getElementById('p1p3t3');
let p1p4p1=document.getElementById('p1p4p1');
let p1p4t2=document.getElementById('p1p4t2');
let p1p4bt1=document.getElementById('p1p4bt1');
let p1p4bt2=document.getElementById('p1p4bt2');
let p1p4bt3=document.getElementById('p1p4bt3');
let p1p4bt4=document.getElementById('p1p4bt4');

let cards; /* from cards.json */
let categs; /* from categs.json */

let categDivs=[]; /* divs in p1p2 pane */
let curCategName; /* current categ name */
let mapCateg=new Map(); /* map of categ name to div in p1p2 pane */
let mapCategCount=new Map(); /* map of categ name to categ count */
let categCards=[]; /* cards that belong to the current category */
let categImgs=[]; /* the 12 images in p1p3p1 pane */
let deckImgs=[]; /* the 40 images in p1p4p1 pane */
let nPage; /* number of pages to display all cards of the current category */
let curPage; /* index of the current page */
let curPageCard; /* index of the first card to be displayed in next page */

let deck=[];
let nMon=0;
let nMag=0;
let nTrap=0;

let opa=.2;

start();

function start(){
	/* load data */
	let req1=new XMLHttpRequest();

	req1.open("get","files/data/cards.json",true);
	
	req1.onload=function(){
		cards=JSON.parse(req1.responseText);
		
		let req2=new XMLHttpRequest();
		
		req2.open("get","files/data/categs.json",true);
		
		req2.onload=function(){
			categs=JSON.parse(req2.responseText);
			
			displayCategories();
			createSlots();
			assignCategNameActions();
			assignPageNavigationActions();
			assignImageActions();
			assignButtonActions();

			categDivs[0].click();
		};
		
		req2.send();
	};
	
	req1.send();
}

function displayCategories(){
	for(let [k,v] of Object.entries(categs)){
		let div=document.createElement('div');
		div.className='categ';
		div.innerHTML=v.name+' (0, '+v.min+' to '+v.max+')';
		div.name=k;
		p1p2p1p1.appendChild(div);
		categDivs.push(div);
		mapCateg.set(k,div);
		mapCategCount.set(k,0);
	}
}

function createSlots(){
	/* categ slots */
	for(let i=0;i<12;i++){
		let indexRow=parseInt(i/3);
		let indexCol=parseInt(i%3);

		let img=document.createElement('img');
		img.className='img';
		img.hidden=true;

		let div=document.createElement('div');
		div.className='categSlot';
		div.style.left=indexCol*33.3+'%';
		div.style.top=indexRow*25+'%';
		div.appendChild(img);

		p1p3p1.appendChild(div);

		categImgs.push(img);
	}

	/* deck slots */
	for(let i=0;i<40;i++){
		let indexRow=parseInt(i/10);
		let indexCol=parseInt(i%10);

		let img=document.createElement('img');
		img.className='img';
		img.hidden=true;

		let div=document.createElement('div');
		div.className='deckSlot';
		div.style.left=indexCol*10+'%';
		div.style.top=indexRow*25+'%';
		div.appendChild(img);

		p1p4p1.appendChild(div);

		deckImgs.push(img);
	}
}

function assignCategNameActions(){
	for(let categName of categDivs){
		categName.addEventListener('click',ev=>{
			curCategName=categName.name;

			p1p3t1.innerHTML=categs[curCategName].name;

			if(categs[curCategName].min==0){
				p1p3t2.innerHTML='Choose up to '+categs[curCategName].max+' cards';
			}else if(categs[curCategName].min==categs[curCategName].max && categs[curCategName].min==1){
				p1p3t2.innerHTML='Choose '+categs[curCategName].min+' card';
			}else if(categs[curCategName].min==categs[curCategName].max && categs[curCategName].min>1){
				p1p3t2.innerHTML='Choose '+categs[curCategName].min+' cards';
			}else{
				p1p3t2.innerHTML='Choose '+categs[curCategName].min+' to '+categs[curCategName].max+' cards';
			}

			categCards=[];

			for(let card of cards){
				if(card.category==categName.name){
					categCards.push(card);
				}
			}

			nPage=Math.ceil(categCards.length/12);
			curPage=0;
			curPageCard=Math.min(categCards.length,12);

			p1p3t3.innerHTML=nPage>0?('1/'+nPage):('0/0');

			for(let i=0;i<curPageCard;i++){
				categImgs[i].src='files/pics_mod/'+categCards[i].passcode+'.jpg';
				categImgs[i].card=categCards[i];
				categImgs[i].style.opacity=categCards[i].inDeck?opa:1;

				categImgs[i].hidden=false;
			}

			for(let i=curPageCard;i<12;i++){
				categImgs[i].hidden=true;
			}
		});
	}
}

function assignPageNavigationActions(){
	p1p3bt1.addEventListener('click',ev=>{
		if(curPage>0){
			for(let i=0;i<12;i++){
				let j=curPage*12-(12-i);

				categImgs[i].src='files/pics_mod/'+categCards[j].passcode+'.jpg';
				categImgs[i].card=categCards[j];
				categImgs[i].style.opacity=categCards[j].inDeck?opa:1;

				categImgs[i].hidden=false;
			}

			curPageCard=curPage*12;
			curPage--;

			p1p3t3.innerHTML=(curPage+1)+'/'+nPage;
		}
	});

	p1p3bt2.addEventListener('click',ev=>{
		if(curPage<nPage-1){
			let n=Math.min(categCards.length-(curPage+1)*12,12);

			for(let i=0;i<n;i++){
				let j=curPageCard+i;

				categImgs[i].src='files/pics_mod/'+categCards[j].passcode+'.jpg';
				categImgs[i].card=categCards[j];
				categImgs[i].style.opacity=categCards[j].inDeck?opa:1;

				categImgs[i].hidden=false;
			}

			for(let i=n;i<12;i++){
				categImgs[i].hidden=true;
			}

			curPageCard+=n;
			curPage++;

			p1p3t3.innerHTML=(curPage+1)+'/'+nPage;
		}
	});
}

function assignImageActions(){
	/* categ imgs */
	for(let categImg of categImgs){
		categImg.addEventListener('click',ev=>{
			if(deck.length==40){
				return;
			}

			let card=categImg.card;

			for(let i=0;i<deck.length;i++){
				if(deck[i]==card){
					return;
				}
			}

			let categDiv=mapCateg.get(curCategName);
			let n=mapCategCount.get(curCategName);

			if(n==categs[curCategName].max){
				return;
			}

			categImg.style.opacity=opa;

			deckImgs[deck.length].src='files/pics_mod/'+card.passcode+'.jpg';
			deckImgs[deck.length].hidden=false;

			deck.push(card);
			card.inDeck=true;

			if(card.type=='monster'){
				nMon++;
			}else if(card.type=='magic'){
				nMag++;
			}else if(card.type=='trap'){
				nTrap++;
			}

			p1p4t2.innerHTML=deck.length+' ('+nMon+'/'+nMag+'/'+nTrap+')';

			n++;
			mapCategCount.set(curCategName,n);
			categDiv.innerHTML=categs[curCategName].name+' ('+n+', '+categs[curCategName].min+' to '+categs[curCategName].max+')';
		});
	}

	/* deck imgs */
	for(let deckImg of deckImgs){
		deckImg.addEventListener('click',ev=>{
			let x=parseFloat(p1p4p1.getBoundingClientRect().left);
			let y=parseFloat(p1p4p1.getBoundingClientRect().top);
			let w=parseFloat(p1p4p1.getBoundingClientRect().width);
			let h=parseFloat(p1p4p1.getBoundingClientRect().height);

			let w_=w/10;
			let h_=h/4;
			
			let x_=parseFloat(deckImg.getBoundingClientRect().left);
			let y_=parseFloat(deckImg.getBoundingClientRect().top);

			let indexCol=parseInt((x_-x)/w_);
			let indexRow=parseInt((y_-y)/h_);

			let index=indexRow*10+indexCol;

			let card=deck[index];

			if(curCategName==card.category){
				for(let i=0;i<12;i++){
					if(categImgs[i].hidden){
						break;
					}

					if(categImgs[i].card==card){
						categImgs[i].style.opacity=1;
						break;
					}
				}
			}

			for(let i=index;i<deck.length-1;i++){
				deckImgs[i].src=deckImgs[i+1].src;
			}

			deckImgs[deck.length-1].hidden=true;

			deck.splice(deck.indexOf(card),1);

			card.inDeck=false;

			if(card.type=='monster'){
				nMon--;
			}else if(card.type=='magic'){
				nMag--;
			}else if(card.type=='trap'){
				nTrap--;
			}

			p1p4t2.innerHTML=deck.length+' ('+nMon+'/'+nMag+'/'+nTrap+')';

			let categDiv=mapCateg.get(card.category);
			let n=mapCategCount.get(card.category);

			n--;
			mapCategCount.set(card.category,n);
			categDiv.innerHTML=categs[card.category].name+' ('+n+', '+categs[card.category].min+' to '+categs[card.category].max+')';
		});
	}
}

function assignButtonActions(){
	p1p4bt1.addEventListener('click',ev=>{
		deck.sort(compareByName);
		deck.sort(compareByType);
		deck.sort(compareByLevel);
		deck.sort(compareBySubType);

		for(let i=0;i<deck.length;i++){
			deckImgs[i].src='files/pics_mod/'+deck[i].passcode+'.jpg';
		}
	});

	p1p4bt2.addEventListener('click',ev=>{
		for(let i=0;i<deck.length;i++){
			let index=randomInt(0,deck.length-1);

			let c=deck[i];
			deck[i]=deck[index];
			deck[index]=c;
		}

		for(let i=0;i<deck.length;i++){
			deckImgs[i].src='files/pics_mod/'+deck[i].passcode+'.jpg';
		}
	});

	p1p4bt3.addEventListener('click',ev=>{
		for(let index=deck.length-1;index>=0;index--){
			let card=deck[index];

			if(curCategName==card.category){
				for(let i=0;i<12;i++){
					if(categImgs[i].hidden){
						break;
					}

					if(categImgs[i].card==card){
						categImgs[i].style.opacity=1;
						break;
					}
				}
			}

			for(let i=index;i<deck.length-1;i++){
				deckImgs[i].src=deckImgs[i+1].src;
			}

			deckImgs[deck.length-1].hidden=true;

			deck.splice(deck.indexOf(card),1);

			card.inDeck=false;

			if(card.type=='monster'){
				nMon--;
			}else if(card.type=='magic'){
				nMag--;
			}else if(card.type=='trap'){
				nTrap--;
			}

			p1p4t2.innerHTML=deck.length+' ('+nMon+'/'+nMag+'/'+nTrap+')';

			let categDiv=mapCateg.get(card.category);
			let n=mapCategCount.get(card.category);

			n--;
			mapCategCount.set(card.category,n);
			categDiv.innerHTML=categs[card.category].name+' ('+n+', '+categs[card.category].min+' to '+categs[card.category].max+')';
		}
	});

	p1p4bt4.addEventListener('click',ev=>{
		if(deck.length<40){
			return;
		}

		for(let [k,v] of mapCategCount.entries()){
			if(v<categs[k].min){
				return;
			}
		}

		let text='#created by ... \n#main\n';

		for(let c of deck){
			text+=c.passcode+'\n';
		}

		text+='#extra\n!side\n';

		let blob=new Blob([text],{type: 'text/plain'});
		let a=document.createElement('a');
		a.href=URL.createObjectURL(blob);

		a.download='subway.ydk';

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	});
}

function compareByName(a,b){
	return a.name.localeCompare(b.name);
}

let types=['monster','magic','trap'];

function compareByType(a,b){
	return types.indexOf(a.type)-types.indexOf(b.type);
}

function compareByLevel(a,b){
	if(a.type=='monster' && b.type=='monster'){
		return b.level-a.level;
	}

	return 0;
}

let monsterTypes=['normal','effect','ritual','fusion'];
let magicTypes=['normal','continuous','equip','quick-play','field','ritual'];
let trapTypes=['normal','continuous','counter'];

function compareBySubType(a,b){
	if(a.type=='monster' && b.type=='monster'){
		return monsterTypes.indexOf(a.subType1)-monsterTypes.indexOf(b.subType1);
	}else if(a.type=='magic' && b.type=='magic'){
		return magicTypes.indexOf(a.subType1)-magicTypes.indexOf(b.subType1);
	}else if(a.type=='trap' && b.type=='trap'){
		return trapTypes.indexOf(a.subType1)-trapTypes.indexOf(b.subType1);
	}

	return 0;
}

function randomInt(a,b){
	return Math.floor(Math.random()*(b-a+1))+a;
}