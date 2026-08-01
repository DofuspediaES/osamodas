let elementos=[
"F","F","F","F",
"A","A","A","A",
"W","W","W","W",
"T","T","T","T"
];


let soluciones=[];

let intento=[];


// Crear todas las combinaciones posibles
function generar(){

soluciones=[];


function combinar(actual){

if(actual.length==4){

soluciones.push(actual);
return;

}


for(let e of ["F","A","W","T"]){

combinar([...actual,e]);

}

}

combinar([]);

}


generar();



function añadir(e){

if(intento.length<4){

intento.push(e);

document.getElementById("prueba").innerHTML=
intento.join(" ");

}

}



function comparar(a,b){

let blancos=0;
let usadosA=[];
let usadosB=[];


// blancos

for(let i=0;i<4;i++){

if(a[i]==b[i]){

blancos++;

usadosA[i]=true;
usadosB[i]=true;

}

}


// negros

let negros=0;


for(let i=0;i<4;i++){

if(!usadosA[i]){

for(let j=0;j<4;j++){

if(!usadosB[j] && a[i]==b[j]){

negros++;

usadosB[j]=true;
break;

}

}

}


}


return [blancos,negros];

}



function guardarResultado(){


let blancos=
Number(document.getElementById("blancos").value);


let negros=
Number(document.getElementById("negros").value);



soluciones=
soluciones.filter(sol=>{

let r=comparar(intento,sol);

return r[0]==blancos && r[1]==negros;

});



intento=[];


document.getElementById("prueba").innerHTML="";

mostrar();

}




function mostrar(){


if(soluciones.length==0){

document.getElementById("respuesta").innerHTML=
"No quedan soluciones";

return;

}



let sugerencia=
soluciones[Math.floor(Math.random()*soluciones.length)];


document.getElementById("respuesta").innerHTML=
sugerencia.join(" ");



}


mostrar();
