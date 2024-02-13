import { recupera, elimina, completa } from "/fetch.js";
const templateBTNElimina = `
  <button class="btn btn-danger" id="ELIMINA_%ID">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
  </svg>
  </button>
`;

const templateBTNConferma = `
  <button class="btn btn-success" id="CONFERMA_%ID">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
  </svg>
  </button>
`;

const tbodyTodoTemplate =
    "<tr><td class='td %TESTOCOLOR'>%TITOLO</td><td>%CONFERMABTN</td><td>%ELIMINABTN</td></tr>";

/**
 * Funzione per visualizzare in tabella le todo
 * @param {*} array contiene le todo
 * @param {*} container contenitore della tabella generata dinamicamente
 */
export const render = (
    array,
    container
) => {
    let html = "";
    let count = 0;
    if (array != undefined) {
        array.forEach((element) => {
            let row = tbodyTodoTemplate;
            row = row
                .replace("%TITOLO", element.title)
                .replace("%CONFERMABTN", templateBTNConferma.replace("%ID", count))
                .replace("%ELIMINABTN", templateBTNElimina.replace("%ID", count));
            if (element.completed) {
                row = row.replace("%TESTOCOLOR", "text-success");
            } else {
                row = row.replace("%TESTOCOLOR", "text-black");
            }
            html += row;
            count++;
        });
        //inserimento dell'html
        container.innerHTML = html;
        //gestione button completato
        document.querySelectorAll(".btn-success").forEach(button => {
            if (button.id != "aggiungiButton") {
                button.onclick = () => {
                    const index = button.id.split("_")[1];
                    completa(array[index]).then(response=> {
                        recupera().then(response => {
                            render(response, container)
                        });
                    });
                }
            }
        });
        document.querySelectorAll(".btn-danger").forEach(button => {
            button.onclick = () => {
                const index = button.id.split("_")[1];
                elimina(array[index].id)
                    .then(response => {
                        recupera().then(response => {
                            render(response, container)
                        });
                    })
            }
        });
    }

}