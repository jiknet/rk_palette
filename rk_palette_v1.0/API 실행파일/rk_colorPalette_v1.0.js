var rk_colorVal=[];//id(보여줄위치 id),type(hex,bk)(hex숫자형식, 배경색형식),배열형식안에 object형식

//canvas 초기 셋팅값
function rk_colorPalette_init(idVal){
	rk_colorPalette_html(idVal);//html 생성
	
	//모든 색상
	var canvas1=document.getElementById("rk_can1");
	var cas1=canvas1.getContext("2d");
	//세부색상 선택
	var canvas2=document.getElementById("rk_can2");
	var cas2=canvas2.getContext("2d");
	
	rk_can1Draw(cas1);//canvas에 rgb색상 표시
	rk_can2Draw_init(cas2);//canvas에 흑백 표시
	rk_colorShow(canvas1,cas1,canvas2,cas2);//canvas에 색상선택시 div에 표시(이벤트 효과)
}
//팔랫트 html 형식
function rk_colorPalette_html(idVal){
	var htmlWrap=document.getElementById(idVal);
	var htmlCon=
	'<div id="rk_palette_wrap">'
		+'<canvas id="rk_can1" width="306" height="25"></canvas>'
		+'<canvas id="rk_can2" width="306" height="25"></canvas>'
		+'<br>'
		+'<div id="rk_selColor"></div>'
		+'<input type="text" id="rk_hex_color" placeholder="hex색상번호">'
		+'<input type="text" id="rk_rgba_red" placeholder="red" title="red" readonly>'
		+'<input type="text" id="rk_rgba_green" placeholder="green" title="green" readonly>'
		+'<input type="text" id="rk_rgba_blue" placeholder="blue" title="blue" readonly>'
		+'<div id="rk_btn_tot">'
			+'<input type="button" id="rk_sel_btn" value="선택">'
			+'<input type="button" id="rk_cen_btn" value="닫기">'
		+'</div>'
	+'</div>';
	
	htmlWrap.innerHTML=htmlCon;
}
//팔랫트 css
function rk_colorPalette_css(url){
	var cssLink=document.createElement("link");
	cssLink.href=url;
	cssLink.rel="stylesheet";
	cssLink.type="text/css";
	document.body.appendChild(cssLink);
}
//rgba 모든 색상
//색갈순서 : 255,0,0 -> 255,255,0 -> 0,255,0 -> 0,255,255 -> 0,0,255 -> 255,0,255 -> 255,0,0
function rk_can1Draw(cas1){
	var xLocLen=0; //좌표위치(이전값 더함)
	var xLoc=0.2; //x좌표 공통값
	var yLoc=0; //y좌표 공통값
	var xWid=0.5; //넓이
	var yHei=25; //높이

	for(var i=0; i<=255; i++){//255,0,0 -> 255,255,0
		cas1.fillStyle="rgba(255,"+i+",0,1)";
		cas1.fillRect(i*xLoc, yLoc, xWid, yHei);
		xLocLen=i;
	}
	for(var i=255; i>=0; i--){//255,255,0 -> 0,255,0
		cas1.fillStyle="rgba("+i+",255,0,1)";
		cas1.fillRect(xLocLen*xLoc, yLoc, xWid, yHei);
		xLocLen+=1;
	}
	for(var i=0; i<=255; i++){//0,255,0 -> 0,255,255
		cas1.fillStyle="rgba(0,255,"+i+",1)";
		cas1.fillRect(xLocLen*xLoc, yLoc, xWid, yHei);
		xLocLen+=1;
	}
	for(var i=255; i>=0; i--){//0,255,255 -> 0,0,255
		cas1.fillStyle="rgba(0,"+i+",255,1)";
		cas1.fillRect(xLocLen*xLoc, yLoc, xWid, yHei);
		xLocLen+=1;
	}
	for(var i=0; i<=255; i++){//0,0,255 -> 255,0,255
		cas1.fillStyle="rgba("+i+",0,255,1)";
		cas1.fillRect(xLocLen*xLoc, yLoc, xWid, yHei);
		xLocLen+=1;
	}
	for(var i=255; i>=0; i--){//255,0,255 -> 255,0,0
		cas1.fillStyle="rgba(255,0,"+i+",1)";
		cas1.fillRect(xLocLen*xLoc, yLoc, xWid, yHei);
		xLocLen+=1;
	}
}
//canvas에 색상선택시 div에 표시(이벤트 효과)
function rk_colorShow(canvas1,cas1,canvas2,cas2){
	var wrap=document.getElementById("rk_palette_wrap");
	//버튼 이벤트
	var rkSelBtn=document.getElementById("rk_sel_btn");
	var rkCenBtn=document.getElementById("rk_cen_btn");
	
	//hex색상번호 표시
	var hex_color=document.getElementById("rk_hex_color");
	
	//div에 선택한 색상표시
	var selColor=document.getElementById("rk_selColor");
	//rgba색상번호 표시
	var selRGBA_red=document.getElementById("rk_rgba_red");
	var selRGBA_green=document.getElementById("rk_rgba_green");
	var selRGBA_blue=document.getElementById("rk_rgba_blue");
	
	var valArr=[selRGBA_red, selRGBA_green, selRGBA_blue];//넘길 변수
	
	//모든색상canvas 클릭시
	canvas1.addEventListener("click",function(){
		var hexColor=rk_getColorHex(cas1,valArr)[0];//hex색상
		var rgbaColor=rk_getColorHex(cas1,valArr)[1];//rgb색상
		//hex색상 표시
		hex_color.value=hexColor;//text에 표시
		selColor.style.backgroundColor=hex_color.value;//div에 색상표시
		//세부색상 선택
		if(hexColor=="#ffffff" || hexColor=="#000000"){//검은색,백색의 경우는 초기 세부색상보여줌(안그러면 세부섹상 이상하게 표기됨)
			rk_can2Draw_init(cas2);
		}else{
			rk_can2Draw(cas2, rgbaColor);//canvas, rgba컬러값 배열
		}
	});
	
	//세부색상canvas 클릭시
	canvas2.addEventListener("click",function(){
		//hex색상 표시
		hex_color.value=rk_getColorHex(cas2, valArr)[0];
		selColor.style.backgroundColor=hex_color.value;
	});
	//hex텍스트 창에 값넣고 엔터 누를시
	hex_color.addEventListener("keyup",function(){
		if(window.event.keyCode==13){//엔터누르면 색상정보가 변경
			//div에 색상변경 표시
			selColor.style.backgroundColor=hex_color.value;
			//rgba번호 표시
			var rgbNumTot=rk_rgbNum(hex_color.value);//16진수값을 10진수로 변환후 rgb값 가져옴
			selRGBA_red.value=rgbNumTot[0];
			selRGBA_green.value=rgbNumTot[1];
			selRGBA_blue.value=rgbNumTot[2];
		}
	});
	
	//선택버튼(선택한 색상정보 보여줌)
	rkSelBtn.addEventListener("click",function(){
		rk_colorValFnc(hex_color.value);//선택한 색상을 출력해주는(사용자가 원하는 위치와 타입에 따라)
		wrap.style.display="none";
	});
	//취소버튼(팔레트 창 닫기)
	rkCenBtn.addEventListener("click",function(){
		wrap.style.display="none";
	});
}
//클릭한 좌표의 도형정보로 hex색상 가져오는 함수
function rk_getColorHex(cas, valArr){
	var selRGBA_red=valArr[0];
	var selRGBA_green=valArr[1];
	var selRGBA_blue=valArr[2];
	
	var evX=event.offsetX;//클릭한 x좌표
	var evY=event.offsetY;//클릭한 y좌표
	var color=cas.getImageData(evX,evY,1,1).data;//클릭한 canvas도형 정보(색상추출)
	
	//rgba색상을 div에 표시
	selRGBA_red.value=color[0];
	selRGBA_green.value=color[1];
	selRGBA_blue.value=color[2];

	//rgba컬러->hex컬러로 변경
	var hexColor="#"+rk_hexChange(color[0])+rk_hexChange(color[1])+rk_hexChange(color[2]);
	
	return [hexColor,color];//hex색상, rgba색상 반환
}
//세부색상 초기화면
function rk_can2Draw_init(cas){
	var xLocLen=0; //좌표위치(이전값 더함)
	var xLoc=1.2; //x좌표 공통값
	var yLoc=0; //y좌표 공통값
	var xWid=2.4; //넓이
	var yHei=25; //높이
	
	for(var i=255; i>=0; i--){
		cas.fillStyle="rgba("+i+","+i+","+i+",1)";
		cas.fillRect(xLocLen*xLoc, yLoc, xWid, yHei);
		xLocLen+=1;
	}
}
//세부색상 선택(하얀색->선택한색->검은색)
function rk_can2Draw(cas, color){
	var xLocLen=0; //좌표위치(이전값 더함)
	var xLoc=0.6; //x좌표 공통값
	var yLoc=0; //y좌표 공통값
	var xWid=1.2; //넓이
	var yHei=25; //높이
	
	//배열에 rgb색상 번호 넣는다(가장 값이 큰것 계산위해)
	var colorSet=new Array();
	colorSet=[color[0],color[1],color[2]];
	rgbMax=Math.max.apply(null,colorSet);//rgb3개중 가장 값이 큰것
	rgbMin=Math.min.apply(null,colorSet);//rgb3개중 가장 값이 가장작은것

	colorSet=[255,255,255];//초기값(하얀색부터 시작시)
	//255,255,255 -> 0,205,156 (백색->선택한색)
	for(var i=0; i<=255-rgbMin; i++){//최소값0이면 255번 돌려야되
		if(colorSet[0]!=color[0]){
			colorSet[0]-=1;
		}if(colorSet[1]!=color[1]){
			colorSet[1]-=1;
			
		}if(colorSet[2]!=color[2]){
			colorSet[2]-=1;
		}
		cas.fillStyle="rgba("+colorSet[0]+","+colorSet[1]+","+colorSet[2]+",1)";
		cas.fillRect(i*xLoc, yLoc, xWid, yHei);
		xLocLen=i;
	}
	
	colorSet=[0,0,0];//마지막값(검은색으로 종료)
	//0,205,156-> 0,0,0 (선택한색->흑색)
	for(var i=0; i<=rgbMax; i++){//최대값 255이면 255번 돌려야되
		if(colorSet[0]!=color[0]){
			color[0]-=1;
		}if(colorSet[1]!=color[1]){
			color[1]-=1;
			
		}if(colorSet[2]!=color[2]){
			color[2]-=1;
		}
		cas.fillStyle="rgba("+color[0]+","+color[1]+","+color[2]+",1)";
		cas.fillRect((xLocLen+i)*xLoc, yLoc, xWid, yHei);
	}
}
//10진수->16진수변환
function rk_hexChange(num){//10진수 값을 받고
	var hexNum=(num).toString(16);
	if(hexNum.length==1){//자릿수는 2자리어야함(2가아니라 02)
		hexNum="0"+hexNum;
	}
	return hexNum;
}
//hex->rgba 숫자로 변환
function rk_rgbNum(hexNum){
	var rgbaRed;
	var rgbaGreen;
	var rgbaBlue;
	
	//#000 or #fff의 경우
	if(hexNum.length==4){
		hexNum=hexNum.substring(1,hexNum.length);
		rgbaRed=hexNum.substring(0,2);
		rgbaGreen=rgbaRed;
		rgbaBlue=rgbaRed;
	}else if(hexNum.length==7){
		hexNum=hexNum.substring(1,hexNum.length);
		rgbaRed=hexNum.substring(0,2);
		rgbaGreen=hexNum.substring(2,4);
		rgbaBlue=hexNum.substring(4,6);
	}
	
	//16진수 -> 10진수로 변환
	rgbaRed=parseInt(rgbaRed,16);
	rgbaGreen=parseInt(rgbaGreen,16);
	rgbaBlue=parseInt(rgbaBlue,16);
	
	return [rgbaRed,rgbaGreen,rgbaBlue];
}
//팔랫트 색상 열기
function rk_openPalette(){
	var wrap=document.getElementById("rk_palette_wrap");
	wrap.style.display="block";
}
function rk_colorValFnc(color){//선택한 색상을 출력해주는(사용자가 원하는 위치와 타입에 따라)
	
	for(key in rk_colorVal){
		var loc=document.getElementById(rk_colorVal[key].id);
		if(loc.tagName=="INPUT"){//태그정보가 INPUT인 경우 VALUE로 값넣어줘야되
			if(rk_colorVal[key].type=="hex"){//hex형식으로 텍스트로 보여줌
				loc.value=color;
			}
		}else{//INPUT이 아닌경우는 innerHTML로 넣어줌
			if(rk_colorVal[key].type=="hex"){//hex형식으로 텍스트로 보여줌
				loc.innerHTML=color;
			}
		}
		//배경색은 태그와 관계없이 적용가능하므로
		if(rk_colorVal[key].type=="bk"){
			loc.style.backgroundColor=color;
		}
	}
}