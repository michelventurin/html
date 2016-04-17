function btn(value){
	var salvo = document.calc.visor.value;
	document.calc.visor.value = salvo + value;
}

function limpar(){
	document.calc.visor.value = '';
}