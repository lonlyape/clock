$.extend({
	clock:function (options){
		var option={
			eleId:'',//element的id   字符串
			//时钟的边界
			border:{
				type:"circle",//边界类型（圆、四边形）;circle(圆形) 、 rectangle(四边形)
				setCircle:{
					radius:150,
					lineWidth:6,
					color:'#bbb'
				},
				setRectangle:{
					width:300,
					height:300,
					lineWidth:6,
					color:'#bbb'
				}
			},
			//针
			needle:{
				second:{
					length:100,
					color:'#aaa',
					lineWidth:3
				},
				minute:{
					length:110,
					color:'#999',
					lineWidth:4
				},
				hour:{
					length:70,
					color:'#888',
					lineWidth:4
				},
			},
			//刻度
			dial:{
				isDial:true,//是否要刻度
				distance:0, //刻度与边界的距离
				maxLength:8,
				minLength:5,
				maxWidth:3,
				minWidth:2,
				color:'#888'
			},
			//时钟的数字
			number:{
				isNumber:true,//是否要数字
				type:"arabic",//数字类型
				color:"#777",
				fontSize:"19px",
				fontWeight:"normal",
				fontFamily:"微软雅黑",
				radius:125,
			}
		}
		option=$.extend(true,option,options);
		if(option.border.type=='rectangle'){
			if(option.border.setRectangle.width<=option.border.setRectangle.height){
				option.border.setCircle.radius=option.border.setRectangle.width/2;
			}else{
				option.border.setCircle.radius=option.border.setRectangle.height/2;
			}
		}
		var sAngle, mAngle,hAngle;
		var clockCanvas=document.createElement('canvas');
		clockCanvas.width=$('#'+option.eleId).width();
		clockCanvas.height=$('#'+option.eleId).height();
		$('#'+option.eleId).append(clockCanvas);
		var context=clockCanvas.getContext('2d');

		//初始时间
		function newData(){

			var nd=new Date();
			var hour=nd.getHours();
			var minute=nd.getMinutes();
			var second=nd.getSeconds();

			sAngle=Math.PI*2*(second%60)/60;
			mAngle=Math.PI*2*(minute%60)/60+sAngle/60;
			hAngle=Math.PI*2*(hour%12)/12+mAngle/12;

		}


		//边界
		function rounds(){
			if(option.border.type=='rectangle'){
				rectangle();
				return;
			}
			context.save();
			context.translate(clockCanvas.width/2,clockCanvas.height/2);
			context.beginPath();	
			context.arc(0,0,option.border.setCircle.radius,0,Math.PI*2,true);
			context.closePath();
			context.strokeStyle=option.border.setCircle.color;
			context.lineWidth=option.border.setCircle.lineWidth;
			context.stroke();
			context.restore();
		}
		function rectangle(){
			context.save();
			context.translate(clockCanvas.width/2,clockCanvas.height/2);
			context.beginPath();	
			context.rect(-option.border.setRectangle.width/2,-option.border.setRectangle.height/2,option.border.setRectangle.width,option.border.setRectangle.height);
			context.closePath();
			context.strokeStyle=option.border.setRectangle.color;
			context.lineWidth=option.border.setRectangle.lineWidth;
			context.stroke();
			context.restore();
		}

var image=new Image();
image.width=option.border.type=='rectangle'?-option.border.setRectangle.width:option.border.setCircle.radius*2;
				var pattern = context.createPattern(image, "no-repeat");
		//背景图片
		function bgImag(url){
			
			//image.onload=function(){
				context.save();
				context.translate(clockCanvas.width/2,clockCanvas.height/2);
				context.beginPath();
				if(option.border.type=='rectangle')	
					context.rect(-option.border.setRectangle.width/2,-option.border.setRectangle.height/2,option.border.setRectangle.width,option.border.setRectangle.height);
				else
					context.arc(0,0,option.border.setCircle.radius,0,Math.PI*2,true);
				context.closePath();
				context.fillStyle=pattern;
				context.fill();
				context.restore();
			//}
		}
			image.src="bg.jpg";

		//数字
		function number(){
			if(!option.number.isNumber)return;
			var num=[];
			for(var i=1; i<13; i++){
				num[i-1]=i+3;
				if((i+3)>12){
					num[i-1]=3-(12-i);
				}
			}
			if(option.number.type=='roman'){
				for(var i=0; i<12; i++){
					num[i]=toRman(num[i]);
				}
			}
			var ar=Math.PI/6;
			context.save();
			context.fillStyle=option.number.color;
			context.font=option.number.fontWeight+' '+option.number.fontSize+' '+option.number.fontFamily;
			context.textBaseline="middle";
			context.textAlign="center";
			context.translate(clockCanvas.width/2,clockCanvas.height/2);
			for(var i=0; i<num.length; i++){
				context.fillText(num[i],option.number.radius*Math.cos(ar*(i+1)),option.number.radius*Math.sin(ar*(i+1)));
			}
			context.restore();
		}
		function toRman(arabic){
	        var alpha=[ 'I', 'V', 'X', 'L', 'C', 'D', 'M' ];
	        var roman="";
	        var bit = 0;
	        while (arabic > 0){  
	            var tempnum = arabic % 10;
	            switch (tempnum){  
	                case 3:{   
	                    roman=alpha[bit]+roman;  
	                    tempnum--;
	                }  
	                case 2:{  
	                    roman=alpha[bit]+roman;  
	                    tempnum--;
	                }  
	                case 1:{  
	                    roman=alpha[bit]+roman;  
	                    break;  
	                }  
	                case 4:{  
	                    roman=alpha[bit + 1]+roman;
	                    roman=alpha[bit]+roman;  
	                    break;  
	                }  
	                case 8:{  
	                    roman=alpha[bit]+roman; 
	                    tempnum--;
	                }  
	                case 7:{  
	                    roman=alpha[bit]+roman; 
	                    tempnum--;
	                }  
	                case 6:{  
	                    roman=alpha[bit]+roman;  
	                    tempnum--;
	                }  
	                case 5:{  
	                    roman=alpha[bit + 1]+roman;  
	                    break;  
	                }  
	                case 9:{ 
	                    roman=alpha[bit + 2]+roman; 
	                    roman=alpha[bit]+roman; 
	                    break;  
	                }  
	                default:{  
	                    break;  
	                }  
	            }  
	            bit += 2;  
	            arabic = Math.floor(arabic / 10);  
	        }  
	     return roman;
	    }

		//针
		function needle(h,m,s){
			context.save();
			context.translate(clockCanvas.width/2,clockCanvas.height/2);
			
			line({x:0,y:15},h,option.needle.hour.length , option.needle.hour.color , option.needle.hour.lineWidth)		//时针
			line({x:0,y:15},m,option.needle.minute.length , option.needle.minute.color , option.needle.minute.lineWidth)	//分针
			line({x:0,y:15},s,option.needle.second.length , option.needle.second.color , option.needle.second.lineWidth) 	//秒针
			
			context.restore();
		}

		//刻度
		function dial(){
			if(!option.dial.isDial)return;
			var degMinute=Math.PI*2/60;
			var degFiveMinut=degMinute*5;
			var degM=0;
			var distance=option.dial.distance?option.dial.distance+option.border.setCircle.lineWidth/2:option.border.setCircle.lineWidth/2;
			if(option.dial.distance==0)distance=option.border.setCircle.lineWidth/2;
			var begainPosition={x:0,y:option.border.setCircle.radius-distance};
			for(var i=0; i<60; i++){
				degM=degMinute*i;
				context.save();
				context.translate(clockCanvas.width/2,clockCanvas.height/2);
				if(i%5==0)line(begainPosition,degM,option.dial.maxLength-begainPosition.y,option.dial.color,option.dial.maxWidth);
				else line(begainPosition,degM,option.dial.minLength-begainPosition.y,option.dial.color,option.dial.minWidth);
				context.restore();
			}
		}
		function line(starp,s,len,col,lw){
			context.save();
			context.beginPath();
			context.rotate(s);
			context.moveTo(starp.x,starp.y);
			context.lineTo(0,-len);
			context.strokeStyle=col;
			context.lineWidth=lw;
			context.stroke();
			context.restore();
		}


		newData();
		bgImag("bg.jpg");
		rounds();
		number();
		needle(hAngle,mAngle,sAngle);
		dial();

		setInterval(function(){
			context.clearRect(0,0,clockCanvas.width,clockCanvas.height);
			newData();
			bgImag("bg.jpg");
			rounds();
			number();
			needle(hAngle,mAngle,sAngle);
			dial();
		},1000)
	}
});