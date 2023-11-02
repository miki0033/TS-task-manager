//import css
import "./tailwind.css";
import "./style.css";
//import component
//import DOMElement from "./DOMElement.ts";
import * as Form from "./form.ts";
import * as Button from "./button.ts";
import { Div } from "./div.ts";
import { Title, TitleAttribute } from "./title.ts";
import { Table, TableOptions } from "./table.ts";
//selector
const pApp = document.querySelector<HTMLDivElement>("#app");
const pAppTable = document.querySelector<HTMLDivElement>("#table");
const modal = document.querySelector<HTMLDivElement>("#modal");
const closemodal = document.querySelector<HTMLButtonElement>("#close");
//Creazione HTML
const div1 = new Div(classIntoList("flex flex-col items-center"));
pApp?.appendChild(div1.getNode());
const div2 = new Div(classIntoList("w-6/12 flex flex-col items-center"));
div1.append(div2.getNode());
const hattribute: TitleAttribute = {
  hn: "h1",
  classList: classIntoList("text-red-600 text-5xl font-extrabold"),
  text: "To Do List",
};
const h1 = new Title(hattribute);
div2.append(h1.getNode());

const pForm = new Form.Form(
  "post",
  "",
  classIntoList("w-6/12 flex flex-row items-center")
);
div1.append(pForm.getNode());
let inpOptions: Form.divInputOptions = {
  inputType: "text",
  labelText: "Task:",
  className: classIntoList("flex flex-col justify-start mx-2"),
  inputId: "titolo",
  inputClass: classIntoList("border border-gray-300 rounded-md p-2"),
};
const pInputTitolo = pForm.addInput(inpOptions);
let selectOptions: Form.divSelectOptions = {
  className: classIntoList("flex flex-col justify-start mx-2"),
  labelText: "Assegna a:",
  inputId: "teamlist2",
  selectClass: classIntoList("border border-gray-300 rounded-md p-2"),
  options: optionData(await getMember()),
};
const pSelectInput = pForm.addSelect(selectOptions);
let submitOption: Button.ButtonOptions = {
  type: "submit",
  id: "salva",
  btnText: "Salva",
  className: classIntoList(
    "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-[24px] mx-4 rounded-md"
  ),
  onClick: btnSalva,
};
let scadenzaOption: Form.divInputOptions = {
  className: classIntoList("flex flex-col justify-start mx-2"),
  labelText: "Data di scadenza:",
  inputType: "date",
  inputName: "scadenza",
  inputId: "scadenza",
  inputClass: classIntoList("border border-gray-300 rounded-md p-2"),
};
const pScadenzaInput = pForm.addInput(scadenzaOption);
pForm.addSubmitButton(submitOption);

let tableOptions: TableOptions = {
  className: classIntoList("min-w-full divide-y divide-gray-200"),
  colText: [
    "Titolo",
    "Membro",
    "Stato",
    "Data di assegnazione",
    "Data di scadenza",
  ],
  thClass: classIntoList("text-left px-4 py-2 text-gray-800"),
};
const pTable = new Table(tableOptions);
pAppTable?.appendChild(pTable.getNode());
//Stato
let targetTask: any;

//MAIN
getTask();
//FUNZIONI
function classIntoList(cls: string): string[] {
  const lst: string[] = cls.split(" ");
  return lst;
}

async function getMember(): Promise<any> {
  let dt = fetch("http://127.0.0.1:5000/teamMember", {
    //fetch dei membri del team
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    //body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    });

  return await dt;
}

function optionData(data: any): Form.optionData[] {
  const lst: Form.optionData[] = [];
  data.forEach((element: any) => {
    let obj: Form.optionData = {
      value: element["id"],
      optionText: element["nome"] + " " + element["cognome"],
    };
    lst.push(obj);
  });
  return lst;
}

function btnSalva(e: Event) {
  e.preventDefault();
  setTask();
}

interface FormData {
  titolo: string;
  scadenza: string;
  teamid: number;
}
function setTask() {
  let data = <FormData>{
    titolo: pInputTitolo.value,
    scadenza: pScadenzaInput.value,
    teamid: +pSelectInput.value,
  };
  console.log(JSON.stringify(data));

  fetch("http://127.0.0.1:5000/setTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      /*console.log(response.json());*/
      return response.json();
    })
    .then((data) => {
      pTable.createRow(data);
    });
}

async function getTask() {
  let dt: any = fetch("http://127.0.0.1:5000/getTask", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    //body: JSON.stringify(data),
  })
    .then((response) => {
      /*console.log(response.json());*/
      return response.json();
    })
    .then((data) => {
      if (data?.code == 404) {
        //html = "<p> Dati non trovati </p>";
      } else {
        data?.forEach((element: any) => {
          pTable.createRow(element);
          /*newhtml += `<tr class="hover:bg-gray-100">
          <td class="border px-4 py-2">${element["titolo"]}</td>
          <td class="border px-4 py-2">${element["nome"]} ${element["cognome"]}</td>
          <td class="border px-4 py-2">${element["stato"]}</td>
          <td class="border px-4 py-2">${element["assegnazione"]}</td>
          <td class="border px-4 py-2">${element["scadenza"]}</td>
          <td><button data-task="${element["id"]}" class="edit bg-yellow-500 rounded py-2 px-4 active:bg-yellow-600">Modifica</button></td>
          <td><button data-task="${element["id"]}" class="delete bg-red-500 rounded py-2 px-4 active:bg-red-600">Cancella</button></td>
          </tr>`;*/
        });

        /*html = openhtml + newhtml + closehtml;
        arrTask = data;*/
      }
    });
  return await dt;
}

//campi form modale
const modtitolo = document.querySelector("#modtitolo") as HTMLInputElement;
const modscadenza = document.querySelector("#modscadenza") as HTMLInputElement;
const modteamid = document.querySelector("#teamlist2") as HTMLInputElement;
const modstatus = document.querySelector("#status") as HTMLInputElement;

//Modale
modal!.addEventListener("submit", (event) => {
  event.preventDefault();
  let data = {
    id: targetTask["id"],
    titolo: modtitolo?.value,
    scadenza: modscadenza?.value,
    stato: modstatus?.value,
    teamid: +modteamid?.value,
  };

  fetch("http://127.0.0.1:5000/updateTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {});

  modal!.style.display = "none";
  getTask();
});

//Chiusura della modale
closemodal!.addEventListener("click", () => {
  modal!.style.display = "none";
});
window.onclick = function (event) {
  if (event.target == modal) {
    modal!.style.display = "none";
  }
};
