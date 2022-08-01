/*autor: Yulia Tropin Tropina, 2DAW
    DWEC, tarea 5, Juego de bolas*/

"use strict"

let jugador, btn;

window.addEventListener("load", () => {
    crearEstructura();
    asignarEvComenzar();
})

let crearEstructura = () => {
    let capa = document.createElement("div");
    capa.className = "px-5 py-3";
    document.body.appendChild(capa);

    let capa1 = document.createElement("div");
    capa1.className = "container width-1000";
    capa.appendChild(capa1);

    let capa2 = document.createElement("div");
    capa2.className = "text-center bg-white rounded py-3 height-500";
    capa2.id = 'juego';
    capa1.appendChild(capa2);

    let title = document.createElement("h1");
    title.innerText = "Juego de bolos";
    title.className = "text-center my-1";
    capa2.appendChild(title);

    let capa4 = document.createElement("div");
    capa4.className = "row justify-content-center py-3";
    capa4.id = "jugador1";
    capa2.appendChild(capa4);

    let fila = ['Jugadores', 'Puntuación', 'Jugadas', 'Tiradas'];
    let fila1 = ['Jugador1', '0', '10', '2'];
    let fila2 = ['Jugador2', '0', '10', '2'];

    crearTabla(capa4.id, fila, fila1);
    capa4 = document.createElement("div");
    capa4.className = "row justify-content-center py-3";
    capa4.id = "jugador2";
    capa2.appendChild(capa4);
    crearTabla(capa4.id, fila, fila2);

    crearBoton('btn-comenzar', 'Comenzar', false, capa2, 'btn btn-primary mt-2');
}


function crearTabla(id, fila, fila1) {
    let capa4 = document.getElementById(id);
    let capa, capa1, text1, text2;;
    for (let i = 0; i < 4; i++) {
        capa = document.createElement("div");
        capa.className = "col col-custome";
        capa4.appendChild(capa);
        //primera fila
        capa1 = document.createElement("div");
        capa1.className = "width-90";
        capa.appendChild(capa1);

        text1 = document.createElement("b");
        text1.className = "line-height-1";
        text1.innerText = fila[i];
        capa1.appendChild(text1); //añadir elemento <b> a la capa

        capa1 = document.createElement("div");
        capa1.className = "border border-secondary rounded px-1 py-1 width-90 bg-gray";
        capa.appendChild(capa1);

        text2 = document.createElement("span");
        text2.innerText = fila1[i];
        capa1.appendChild(text2); // añadir el span a la capa
    } //fin de bucle

    capa1 = document.createElement("div"); //columna para colocar imagen de bola despues
    capa1.className = "col col-lg-1";
    capa4.appendChild(capa1); //añadir el div a la capa
}

function crearBoton(idBot, text, hab, capa, clase) {
    let boton = document.createElement("button");
    boton.type = "button";
    boton.id = idBot;
    boton.innerText = text;
    boton.disabled = hab;
    boton.className = clase;
    capa.appendChild(boton); //añadir el botón a la capa
}
//eventos para botón "comenzar"
function asignarEvComenzar() {
    document.getElementById("btn-comenzar").addEventListener("click", comenzar);
}
//inicio de ejecucio'n de juego
let comenzar = () => {
    btn = document.getElementById('btn-comenzar');
    btn.disabled = true; //desabilita el botón
    crearBolos(btn);
    let activo = quienToca(); //primero jugador - aleatorio 
    document.getElementById(activo).children[0].lastChild.classList.remove('bg-gray'); //borra clase 'bg-gray' del elemento
    document.getElementById(activo).children[0].lastChild.classList.add('activo'); //añade clase ál elemento para cambiar background-color
    crearJugada(activo);
}

function crearJugada(turno) {

    let jugadas = obtenerJugadas(turno);
    if (jugadas > 0) {
        jugador = document.getElementById(turno);
        let tiradas = jugador.childNodes[3].lastChild.lastChild; //elemento span con numero de tiradas
        let tirada = parseInt(tiradas.innerText); //converte string a numero intero
        if (tirada == 0) {
            tiradas.innerText = 2;
        }
        mostrarBola(turno);
        asignarEventosBola(turno);
    }
}

//muestra bolos con posición vertical
function crearBolos(btn) {

    let capa = document.createElement("div");
    capa.id = 'bolos';
    capa.style.margin = "25px 0";
    btn.after(capa);
    // inserta 10 bolos
    for (let i = 0; i < 10; i++) {
        let bolo = document.createElement("img");
        bolo.style.width = "30px";
        bolo.className = "mx-4";
        bolo.id = "bolo" + i + 1;
        bolo.src = 'img/imgBolos/bolo.png';
        capa.appendChild(bolo);
    }
}

function eliminarBolos() {
    let capa = document.getElementById('bolos');
    capa.remove(); //elimina toda fila de bolos
}

//metodo para asignar quien empieza 
function quienToca() {
    let number, turno;
    number = aleatorio(11);
    if (number <= 5) {
        turno = "jugador1";
    } else {
        turno = "jugador2";
    }
    return turno;
}

function cambiarTurno(turno) {
    if (turno == "jugador1") {
        turno = "jugador2";
    } else {
        turno = "jugador1";
    }
    return turno;
}

function mostrarBola(turno) {
    let capa = document.getElementById(turno).lastChild;
    let imagen = document.createElement('img');
    imagen.src = 'img/imgBolos/bola.png';
    imagen.className = 'align-middle';
    imagen.id = 'bola-img';
    capa.appendChild(imagen);
}

function eliminarBola() {
    document.getElementById('bola-img').remove();
}

function asignarEventosBola() {
    document.getElementById('bola-img').addEventListener('click', jugar);
}

//obtener numero aleatorio entre 0 y numero enviado como parametro
function aleatorio(num) {
    let number = Math.floor(Math.random() * num); //random integer 0-(num-1)
    return number;
}

function jugar() {
    let x; //numero de bolos a inclinar
    let turno = document.getElementById('bola-img').parentElement.parentElement.id;
    let bolosCaidos = aleatorio(11); // bolos derribados 0-10
    let puntos = getPuntos(turno);
    setPuntos(turno, puntos + bolosCaidos);
    let bolos_incl = obtenerBolosCaidos(turno); //bolos inclinados antes
    if (bolosCaidos + bolos_incl >= 10) {
        x = 10;
    } else {
        x = bolosCaidos + bolos_incl;
    }
    inclinarBolos(x);
    let tiradas = obtenerTiradas(turno);
    mostrarModal(tiradas, turno);
}

function obtenerJugadas(turno) {
    jugador = document.getElementById(turno);
    let jugadas = jugador.childNodes[2].lastChild.lastChild; //elemento span con numero de tiradas
    let jugada = parseInt(jugadas.innerText); //converte string a numero intero
    return jugada;
}

//metodo para cambiar numero de jugada despues de gastar todos tiradas de una jugada
function cambiarJugadas(turno) {
    jugador = document.getElementById(turno);

    let jugadas = jugador.childNodes[2].lastChild.lastChild; //elemento span con numero de tiradas
    let jugada = parseInt(jugadas.innerText);

    jugadas.innerText = jugada - 1;
}

function obtenerTiradas(turno) {
    jugador = document.getElementById(turno);
    let tiradas = jugador.childNodes[3].lastChild.lastChild; //elemento span con numero de tiradas
    let tirada = parseInt(tiradas.innerText); //converte string a numero intero
    return tirada;
}
//metodo para cambiar numero de tiradas despues de realizar tirada 0-2
function cambiarTiradas(turno) {
    jugador = document.getElementById(turno);

    let tiradas = jugador.childNodes[3].lastChild.lastChild; //elemento span con numero de tiradas
    let tirada = parseInt(tiradas.innerText);
    if (tirada > 0) {
        tiradas.innerText = tirada - 1;
    }
}
//metodo para asignar numero de tiradas disponibles
function setTiradas(turno, numTiradas) {
    jugador = document.getElementById(turno);
    let tiradas = jugador.childNodes[3].lastChild.lastChild; //elemento span con numero de tiradas
    tiradas.innerText = numTiradas; //asigna nuevo valor al campo tiradas
}

function mostrarModal(tiradas, turno) {
    let texto; //texto que va a mostrar el modal
    let strike = false;
    let spare = false;
    let bolosCaid = obtenerBolosCaidos(turno);
    if (tiradas == 2 && bolosCaid == 10) {

        texto = "Strike!";
        strike = true;

    } else if (tiradas == 1 && bolosCaid == 10) {
        texto = 'Spare!';
        spare = true;
    } else {
        texto = 'bolos tirados: ' + bolosCaid.toString();
    }

    Swal.fire({
        text: texto,
        confirmButtonColor: '#0D6EFD',
        confirmButtonText: 'Ok'
    }).then((result) => {
        if (result.isConfirmed) {
            cambiarTiradas(turno);

            if (strike) {
                setTiradas(turno, 2);
                eliminarBolos();
                crearBolos(btn);
            } else if (spare) {
                setTiradas(turno, 1);
                eliminarBolos();
                crearBolos(btn);
            }
            let tirada = obtenerTiradas(turno);
            if (tirada <= 0) {
                cambiarJugadas(turno); //cambia numero de jugadas
                document.getElementsByClassName('activo')[0].classList.add('bg-gray');
                document.getElementsByClassName('activo')[0].classList.remove('activo');
                eliminarBola();
                let next = cambiarTurno(turno);
                document.getElementById(next).children[0].lastChild.classList.remove('bg-gray'); //borra clase 'bg-gray' del elemento
                document.getElementById(next).children[0].lastChild.classList.add('activo'); //añade clase ál elemento para cambiar background-color
                eliminarBolos();
                crearBolos(btn);
                crearJugada(next);
            }
        }
    })
}
//inclinar bolos
function inclinarBolos(x) {
    let y = obtenerBolosCaidos();
    let bolos = document.getElementById('bolos');
    //"levanta bolos"
    for (let i = 0; i < y; i++) {
        bolos.childNodes[i].classList.remove('inclinado');
    }
    //inclinar bolos
    for (let i = 0; i < x; i++) {
        bolos.childNodes[i].classList.add('inclinado');
    }
}

function obtenerBolosCaidos() {
    let bolos_caidos = document.getElementsByClassName('inclinado');
    return bolos_caidos.length;
}
//metodo para recibir numero de puntos
function getPuntos(turno) {
    jugador = document.getElementById(turno);
    let puntuacion = jugador.childNodes[1].lastChild.lastChild; //elemento span con numero de tiradas
    let puntos = parseInt(puntuacion.innerText); //converte string a numero intero
    return puntos;
}

//metodo para asignar puntos
function setPuntos(turno, p) {
    jugador = document.getElementById(turno);
    let puntuacion = jugador.childNodes[1].lastChild.lastChild; //elemento span con numero de puntos
    puntuacion.innerText = p;
}
