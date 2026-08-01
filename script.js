let elementos=["F","A","W","T"];

let soluciones=[];

let intentoActual=[];

let historial=[];



function generarCombinaciones(){

let lista=[];


function crear(actual){

if(actual.length==4){

lista.push(actual);
return;

}


for(let e of elementos){

crear([...actual,e]);

}

}


crear([]);

return lista;

}





function comparar(a,b){

let blancos=0;
let negros=0;

let usadosA=[];
let usadosB=[];


for(let i=0;i<4;i++){

if(a[i]==b[i]){

blancos++;

usadosA[i]=true;
usadosB[i]=true;

}

}


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





function crearSolver(){


let cantidades={};


for(let e of elementos){

let blancos=
Number(document.getElementById(e+"_b").value);


cantidades[e]=blancos;

}



soluciones=generarCombinaciones();



soluciones=soluciones.filter(c=>{


let cuenta={
F:0,
A:0,
W:0,
T:0
};


c.forEach(x=>{
cuenta[x]++;
});


return (
cuenta.F==cantidades.F &&
cuenta.A==cantidades.A &&
cuenta.W==cantidades.W &&
cuenta.T==cantidades.T
);


});



document.getElementById("estado").innerHTML=
"Soluciones posibles: "+soluciones.length;


mostrar();

}





function mostrar(){


if(soluciones.length==0){

document.getElementById("sugerencia").innerHTML=
"No quedan soluciones";

return;

}



intentoActual=
soluciones[0];



document.getElementById("sugerencia").innerHTML=
convertir(intentoActual);



}





function guardarResultado(){


let blancos=
Number(document.getElementById("resultadoB").value);


let negros=
Number(document.getElementById("resultadoN").value);



historial.push({
intento:intentoActual,
blancos,
negros
});



soluciones=
soluciones.filter(sol=>{


let r=comparar(intentoActual,sol);


return (
r[0]==blancos &&
r[1]==negros
);


});



document.getElementById("estado").innerHTML=
`
Intentos: ${historial.length}
<br>
Soluciones restantes: ${soluciones.length}
`;



mostrar();


}





function convertir(c){


return c.map(x=>{


if(x=="F") return "🔥";

if(x=="A") return "🌪";

if(x=="W") return "💧";

if(x=="T") return "🌍";


}).join(" ");


}
