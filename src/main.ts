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
import { msgData } from "./msgData.ts";
//selector
const pApp = document.querySelector<HTMLDivElement>("#app");
const pAppTable = document.querySelector<HTMLDivElement>("#table");
const modal = document.querySelector<HTMLDivElement>("#modal");
const closemodal = document.querySelector<HTMLButtonElement>("#close");
const modalselect = document.querySelector("#select");
const modalbtn = document.querySelector<HTMLDivElement>("#salvaModifiche");
//Stato
let targetTask: any;
let members: any = [];

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

//MAIN
getTask();
let optionSel: Form.divSelectOptions = {
  labelText: "Assegna a:",
  selectName: "teammember",
  inputId: "teamlist",
  selectClass: classIntoList("border border-gray-300 rounded-md p-2"),
  options: optionData(await getMember()),
};
const modalmember = new Form.divSelect(optionSel);
//console.log(msgData.takeMsg("selectedMember"));
msgData.storeMsg("modalmember", modalmember);
modalselect?.appendChild(modalmember.getNode());

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
  members = await dt;
  return await dt;
}

function getMemberbyId(id: string) {
  let element = undefined;
  console.log(members);

  for (let index = 0; index < members.length; index++) {
    console.log(members[index]["id"]);
    console.log(id);
    if (members[index]["id"] == id) {
      element = members[index];
    }
  }
  return element;
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
  //console.log(JSON.stringify(data));

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
      let newdata = {
        titolo: data["titolo"],
        cognome: getMemberbyId(data["teamid"])["cognome"],
        stato: "ToDo",
        assegnazione: data["assegnazione"],
        scadenza: data["scadenza"],
        id: data["id"],
        nome: getMemberbyId(data["teamid"])["nome"],
      };

      pTable.createRow(newdata);
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
        });
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
/*
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
  }).then((response) => {
    return response.json();
  });
  //.then((data) => {});

  modal!.style.display = "none";
  getTask();
});*/

//Chiusura della modale
closemodal!.addEventListener("click", () => {
  modal!.style.display = "none";
});
window.onclick = (event) => {
  if (event.target == modal) {
    modal!.style.display = "none";
  }
};

/*TODO: Manca da collegare la 
modifica

*/

//modifica il pulsante salva della modifica non va

modalbtn!.addEventListener("click", (event) => {
  event.preventDefault();
  editRow();
});

function editRow() {
  targetTask = msgData.takeMsg("targetTask");
  console.log(targetTask);
  let data = {
    id: targetTask["id"],
    titolo: modtitolo?.value,
    scadenza: modscadenza?.value,
    stato: modstatus?.value,
    teamid: +modteamid?.value,
  };
  console.log(data);

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
    .then((data) => {
      console.log(data);
    });
  //modificare la riga scelta
  let rowData = {
    titolo: data["titolo"],
    cognome: members[data.teamid]["cognome"],
    stato: data["stato"],
    assegnazione: targetTask.assegnazione,
    scadenza: data["scadenza"],
    id: targetTask.id,
    nome: members[data.teamid]["nome"],
  };

  pTable.editRowById(targetTask["id"], rowData);
  pTable.renderRow();
  modal!.style.display = "none";
}
