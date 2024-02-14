import { salva, recupera } from "/fetch.js"; // Specify the correct path to your "fetch.js" file
import {render} from "/render.js";
//DOM
const titoloTODO = document.getElementById("titoloInput");
const aggiungiTODO = document.getElementById("aggiungiButton");
const tbodyTODO = document.getElementById("contenutoTableTodo");
//variabili e template
const todoTemplate = (title) => {
  return {
    name: title,
    completed: false,
  };
};

//programma

/**
 * Gestione click button per l'aggiunta di una todo all'elenco di todo salvato su server
 */
aggiungiTODO.onclick = () =>{
  if (titoloTODO.value != "" && titoloTODO.value.length < 20) {
    //se il contorno è rosso lo elimino
    if (titoloTODO.classList.contains("border-danger"))
      titoloTODO.classList.remove("border-danger");
    //salvo su server l'oggetto todo
    salva(todoTemplate(titoloTODO.value))
    .then(response => {
      //recupero l'array di todo aggiornato 
      recupera()
      .then(response => render(response,tbodyTODO));
    });
    titoloTODO.value = "";
  }else
    titoloTODO.classList.add("border-danger");
}

/**
 * Gestione caricamento prima volta della pagina per avere i dati inseriti precedentemente gia in tabella
 */
window.onload = () => {
  recupera()
  .then(response => render(response,tbodyTODO));
}

/**
 * Gestione sincronizzazione dati
 */
setInterval(() => {
  recupera()
  .then(response => render(response,tbodyTODO));
},5000);