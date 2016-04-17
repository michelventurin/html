var config = {
	velocidade: 100,
	tempoQuadradoAtivo: 5000,
	largura:15
}

var contexto;
var Canvas = {
	iniciar:function(){
		var objCanvas = document.getElementById('canvas');
		contexto = objCanvas.getContext("2d");
		Canvas.maxWidth = parseInt(objCanvas.width);
		Canvas.maxHeight = parseInt(objCanvas.height);		
		Canvas.background();
	},
	background:function(){
		contexto.clearRect(0,0,Canvas.maxWidth,Canvas.maxHeight);
		contexto.beginPath();
		contexto.fillStyle = "#FFFFFF";
		contexto.fillRect(0, 0, Canvas.maxWidth, Canvas.maxHeight);			
		contexto.closePath();
	},
	preencher:function(){
		Canvas.background();
		for(i=0;i<cobra.tamanho;i++){
			contexto.fillStyle = "#000";;
			contexto.beginPath();
			contexto.fillRect(cobra.corpo[i].x * config.largura, cobra.corpo[i].y * config.largura, config.largura, config.largura);			
			contexto.closePath();					
		}
		
		cobra.mover();
		Jogo.tempo += config.velocidade;
		if(Jogo.tempo % (config.velocidade*50) ==0) quadrados.adicionar();
		quadrados.preencher();
		quadrados.capturar();
	}
}	

var quadrados = {
	lista:new Array(),
	adicionar:function(){
	
		var lugar_ocupado = true;
		var estrela_x, estrela_y;
		
		while(lugar_ocupado==true){
			lugar_ocupado = false;
			estrela_x = parseInt(Math.random()* (Canvas.maxWidth / config.largura));
			estrela_y = parseInt(Math.random()* (Canvas.maxHeight / config.largura));
			for(i=0;i<cobra.tamanho;i++){
				if(cobra.corpo[i].x == estrela_x && cobra.corpo[i].y == estrela_y) lugar_ocupado = true;
			}				
		}		
		quadrados.lista.push({
			x:estrela_x,
			y:estrela_y,
			inicio:Jogo.tempo
		});
	},
	preencher:function(){
		for(i=0;i<quadrados.lista.length;i++){
			contexto.fillStyle = "blue";
			contexto.beginPath();
			contexto.fillRect(quadrados.lista[i].x * config.largura, quadrados.lista[i].y * config.largura, config.largura, config.largura);			
			contexto.closePath();					
		}	
		if(quadrados.lista.length>0)	if(quadrados.lista[0].inicio + config.tempoQuadradoAtivo < Jogo.tempo) quadrados.lista.shift();	
	},
	capturar:function(){
		for(i=0;i<quadrados.lista.length;i++){
			if(quadrados.lista[i].x == cobra.corpo[cobra.tamanho-1].x && quadrados.lista[i].y == cobra.corpo[cobra.tamanho-1].y){
				cobra._crescer();
				Jogo.pontos += 1000;
				return quadrados.remover(i);
			}
		}	
	},
	remover:function(Indice){
		for(i=Indice;i + 1<quadrados.lista.length;i++){
			quadrados.lista[i].x = quadrados.lista[i+1].x;
			quadrados.lista[i].y = quadrados.lista[i+1].y;
		}	
		quadrados.lista.pop();
	}
}

var cobra = {
	tamanho: 0,
	direcao: 0,
	ultimaDirecao: 0, 
	corpo: new Array(),
	mover:function(){
		Jogo.placar();
		
		var novo_x = cobra.corpo[cobra.tamanho-1].x;
		var novo_y = cobra.corpo[cobra.tamanho-1].y;
		if(cobra.direcao==0) novo_y--;
		if(cobra.direcao==1) novo_x++;
		if(cobra.direcao==2) novo_y++;
		if(cobra.direcao==3) novo_x--;
		cobra.ultimaDirecao = cobra.direcao;
		
		for(i=0;i<cobra.tamanho-1;i++){
			cobra.corpo[i].x = cobra.corpo[i+1].x;
			cobra.corpo[i].y = cobra.corpo[i+1].y;
			if(cobra.corpo[i].x==novo_x && cobra.corpo[i].y==novo_y) return Jogo.gameOver();			
		}
		
		cobra.corpo[cobra.tamanho-1].x = novo_x;
		cobra.corpo[cobra.tamanho-1].y = novo_y;
		
		// Verifica colisão
		if(cobra.corpo[cobra.tamanho-1].x * config.largura >= Canvas.maxWidth || cobra.corpo[cobra.tamanho-1].x < 0) return Jogo.gameOver();
		if(cobra.corpo[cobra.tamanho-1].y * config.largura >= Canvas.maxHeight || cobra.corpo[cobra.tamanho-1].y < 0) return Jogo.gameOver();
	},
	_crescer:function(){
		cobra.corpo.unshift({
			x:cobra.corpo[0].x-1,
			y:cobra.corpo[0].y
		},{
			x:cobra.corpo[0].x-1,
			y:cobra.corpo[0].y
		},{
			x:cobra.corpo[0].x-1,
			y:cobra.corpo[0].y
		});
		cobra.tamanho += 3;
	}
}

var Jogo = {
	play:'',
	pontos: 0,
	tempo: 0,
	inic:function(){
		cobra.tamanho = 15;
		cobra.direcao = 1;
		Jogo.tempo = 0;
		Jogo.pontos = 0;
		quadrados.lista = new Array();
		for(i=0;i<cobra.tamanho;i++){ cobra.corpo[i]={ x:i, y:0 } }	
		Jogo._play();
		document.getElementById('pontos').innerHTML = '0';
		document.getElementById('score').style.visibility = 'visible';		
	},
	placar:function(){
		Jogo.pontos++;
		if(Jogo.pontos%10==0) document.getElementById('pontos').innerHTML = Jogo.pontos;
	},
	_play:function(){
		if(Jogo.play!='') clearInterval(Jogo.play);
		Jogo.play = setInterval(Canvas.preencher, config.velocidade);	
	},
	gameOver:function(){
		if(Jogo.play!='') clearInterval(Jogo.play);
	},
	controles:function(e, event){
		if (window.event){  e = window.event; }
		switch(e.keyCode){
			case 13:
				Jogo.inic();
				e.preventDefault();
				break;
			case 38:
				if(cobra.ultimaDirecao!=2) cobra.direcao = 0; //Seta para cima
				e.preventDefault();
				break;
			case 39:
				if(cobra.ultimaDirecao!=3) cobra.direcao = 1; //Seta para direita
				e.preventDefault();
				break;
			case 40:
				if(cobra.ultimaDirecao!=0) cobra.direcao = 2; //Seta para baixo
				e.preventDefault();
				break;
			case 37:
				if(cobra.ultimaDirecao!=1) cobra.direcao = 3; //Seta para esquerda
				e.preventDefault();
				break;
		}
	}
}

window.onload = Canvas.iniciar;
document.onkeydown = Jogo.controles;