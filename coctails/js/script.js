"use strict"
let xmlHttp;
let num = 0;

$(() => {
    xmlHttp = crearConexion();
    if (xmlHttp != undefined) {
        //funcionalidad
        mostrarTipos();

    } else {
        Swal.fire("El navegador no soporta AJAX. Debe actualizar el navegador");
    }
    mostrarIngridientes();
    mostrarCategoria();
    mostrarTiposCopa();
})

// muestra lista de ingridientes, utiliza petición AJAX Fetch
function mostrarIngridientes() {

    fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list")

        .then(response => {
            return response.json();
        })
        .then(response => {
            //ordenar ascedente
            response.drinks.sort((a, b) => {
                return a.strIngredient1.localeCompare(b.strIngredient1)
            })
            //cargar en el select
            $(response.drinks).each((ind, ele) => {
                // crea elemento option con atributo id y texto de nombre del ingridiente
                var elemento = $("<option></option>").text(ele.strIngredient1).attr("id", "ing" + (ind + 1));
                $("#ingr").append(elemento); // inserta elemento como hijo del elemento con id="ingr"
            })

            //evento change
            $("#ingr").on("change", function () {
                //vuelve otros select al estado inicial
                $('#tipocopa option:first').prop('selected', true);
                $('#category option:first').prop('selected', true);
                $('#tipococt option:first').prop('selected', true);

                let selected = $("#ingr option:selected").text(); // elemento seleccionado
                // manda enlace y elemento seleccionado al metodo a mostrar todos coctales que tienen ingridiente seleccionado
                selectCoctail("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=", selected);
            })
        })
        .catch(error => {
            console.error(error);
        })

}

// muestra lista de categorias, utiliza petición AJAX mediante jQuery
function mostrarCategoria() {
    $.ajax({
        url: "https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list",
        type: "GET",
        dataType: "json"
    })
        .done(function (responseText) {
            //ordenar ascedente
            responseText.drinks.sort((a, b) => {
                return a.strCategory.localeCompare(b.strCategory)
            })
            //cargar en el select
            $(responseText.drinks).each((ind, ele) => {
                var element = $("<option></option>").text(ele.strCategory).attr("id", "ctg" + (ind + 1));
                $("#category").append(element) //insertar elemento como hijo de elemento con id="category"
            })

            //evento change
            $("#category").on("change", function () {
                //devuelve otros select al estado inicial

                $('#tipocopa option:first').prop('selected', true);
                $('#ingr option:first').prop('selected', true);
                $('#tipococt option:first').prop('selected', true);

                // crea elemento option con atributo id y texto de nombre del categoria
                let selected = $("#category option:selected").text();
                // manda enlace y elemento seleccionado al metodo a mostrar todos coctales que tienen ingridiente seleccionado
                selectCoctail("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=", selected);
            })
        })
        //muestra modal con mensaje de errores si existen
        .fail(function (responseText, textStatus, xhr) {
            Swal.fire({
                icon: "error",
                title: "Error " + xhr.status,
                text: xhr.statusText
            })
        })

}

// muestra lista de categorias, utiliza petición AJAX mediante XMLHTTPRequest
function mostrarTipos() {

    //preparar el objeto xmlHttp
    xmlHttp.open("GET", "https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list", true);
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {

            let datos = JSON.parse(xmlHttp.responseText);
            //ordenar los tipos
            datos.drinks.sort((a, b) => {
                return a.strAlcoholic.localeCompare(b.strAlcoholic)
            });

            $(datos.drinks).each((ind, ele) => {
                //crea elemento option con id y texto - nombre del tipo
                var elemento = $("<option></option>").attr("id", ele.strAlcoholic).text(ele.strAlcoholic)
                $("#tipococt").append(elemento) // inserta elemento como hiho del elemento con id="tipococt"
            })
            //establecer el evento change al select tipos de bebida
            $("#tipococt").on("change", function () {
                //vuelve otros select al estado inicial
                $('#tipocopa option:first').prop('selected', true);
                $('#ingr option:first').prop('selected', true);
                $('#category option:first').prop('selected', true);

                let selected = $("#tipococt option:selected").text(); //elemento seleccionado
                // manda enlace y elemento seleccionado al metodo a mostrar todos coctales que tienen ingridiente seleccionado
                selectCoctail("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=", selected);
            })
        }
    };

    xmlHttp.send(); //comienza la petición de respuesta al servidor
}

// muestra lista de categorias, utiliza petición AJAX mediante axios
function mostrarTiposCopa() {

    axios.get("https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list")
        .then(function (response) {

            //ordenar ascedente
            response.data.drinks.sort((a, b) => {
                return a.strGlass.localeCompare(b.strGlass)
            })
            //cargar en el select
            $(response.data.drinks).each((ind, ele) => {
                $("#tipocopa").append("<option id=" + "tc" + (ind + 1) + ">" + ele.strGlass + "</option>")
            })
            //evento change
            $("#tipocopa").on("change", function () {
                //vuelve otros select al estado inicial
                $('#tipococt option:first').prop('selected', true);
                $('#ingr option:first').prop('selected', true);
                $('#category option:first').prop('selected', true);


                let selected = $("#tipocopa option:selected").text(); //opcion seleccionada
                // manda enlace y elemento seleccionado al metodo a mostrar todos coctales que tienen ingridiente seleccionado
                selectCoctail("https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=", selected);
            })
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

function selectCoctail(uri, ingridient) {
    num = 0;
    fetch(uri + ingridient)

        .then(function (response) {
            //decodificar como texto
            return response.json(); //la respuesta del servidor es en JSON
        })
        .then(function (datos) {
            $("#result").empty(); //vacia elemento con id="result"
            num = datos.drinks.length;
            Swal.fire("Se han cargado " + num + " coctails");

            $(datos.drinks).each((ind, ele) => {
                let elemento = $("<div></div").addClass("col-3 py-1 px-1") //crea elemento div
                let elemento1 = $("<div></div").addClass("card bg-white py-2 px-2") //crea elemento div
                $('#result').append($(elemento).append(elemento1)) //inserta dos elementos div en elemento con id "result"
                let elemento2 = $("<img>").attr("src", ele.strDrinkThumb).addClass("card-img-top") //crea elemento de imagen con src y clases
                $('.card:last').append(elemento2) //inserta elemento imagen dentro del ultimo elemento de clase "card "
                let elemento3 = $("<div></div>").addClass("card-body") //crea nuevo elemento div con su clase
                $('.card:last').append(elemento3) //inserta elemento imagen dentro del ultimo elemento de clase "card-body "
                // crea elemento h5
                let elemento4 = $("<h5></h5>").addClass("card-title text-center").text(ele.strDrink)
                $('.card-body:last').append(elemento4) //inserta elemento h5 dentro del ultimo elemento de clase "card-body "
                //crea elemento button con clases
                let elemento5 = $("<button></button>").addClass("btn btn-primary btn-lg btn-block").text("Mostrar ingridientes")
                //añade evento click para botón
                elemento5.click(function () {
                    consultarIngr(ele.idDrink)
                })
                $('.card-body:last').append(elemento5)
            })
        })
        .catch(function (err) {
            Swal.fire("Error: " + err.status + " " + err.statusText);
        });
}

function consultarIngr(id) {

    fetch("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + id)

        .then(function (response) {
            //decodificar como texto
            return response.json(); //la respuesta del servidor es en JSON
        })
        .then(function (response) {
            let cadena = "";

            for (let i = 1; i <= 15; i++) {
                let ind = "strIngredient" + i;
                if (response.drinks[0][ind] != null) {
                    cadena = cadena + response.drinks[0][ind] + "\n "; // string con todos ingridientes del coctail seleccionado
                }
            }
            mostrarDrinkIngr(cadena)

        })
        .catch(function (err) {
            Swal.fire("Error: " + err.status + " " + err.statusText);
        });
}


function mostrarDrinkIngr(ing) {

    Swal.fire({
        title: ing,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
}

