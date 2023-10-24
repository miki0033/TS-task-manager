import "./tailwind.css";
import "./style.css";
//SELECTOR
const formtitolo = document.querySelector("#titolo") as HTMLInputElement;
const formscadenza = document.querySelector("#scadenza") as HTMLInputElement;
const formteamid = document.querySelector("#teamlist") as HTMLInputElement;
const btnsalva = document.querySelector("#salva") as HTMLInputElement;

const modtitolo = document.querySelector("#modtitolo") as HTMLInputElement;
const modscadenza = document.querySelector("#modscadenza") as HTMLInputElement;
const modteamid = document.querySelector("#teamlist2") as HTMLInputElement;
const modstatus = document.querySelector("#status") as HTMLInputElement;

//selettori modale
const modal = document.getElementById("modal") as HTMLElement;
const closemodal = document.getElementsByClassName("close")[0];

//DICHIARAZIONI
let arrTask: any = [];
let targetTask: any = [];
//MAIN
getMember();

getTask();

//VISUALIZZAZIONE DELLE TASK
function getTask() {
  let html = "";
  let openhtml = `
<div class="border border-2xl bg-slate-50">
          <table class="min-w-full border-collapse">
            <tr>
              <th class="text-left px-4 py-2 text-gray-800">Titolo</th>
              <th class="text-left px-4 py-2 text-gray-800">Membro</th>
              <th class="text-left px-4 py-2 text-gray-800">Stato</th>
              <th class="text-left px-4 py-2 text-gray-800">Data assegnazione</th>
              <th class="text-left px-4 py-2 text-gray-800">Data di scadenza</th>
            </tr>
          `;
  let closehtml = ` </table>
</div>`;
  let newhtml = "";
  fetch("http://127.0.0.1:5000/getTask", {
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
      console.log(data);
      if (data?.code == 404) {
        html = "<p> Dati non trovati </p>";
      } else {
        data?.forEach((element: any) => {
          newhtml += `<tr class="hover:bg-gray-100">
          <td class="border px-4 py-2">${element["titolo"]}</td>
          <td class="border px-4 py-2">${element["nome"]} ${element["cognome"]}</td>
          <td class="border px-4 py-2">${element["stato"]}</td>
          <td class="border px-4 py-2">${element["assegnazione"]}</td>
          <td class="border px-4 py-2">${element["scadenza"]}</td>
          <td><button data-task="${element["id"]}" class="edit bg-yellow-500 rounded py-2 px-4 active:bg-yellow-600">Modifica</button></td>
          <td><button data-task="${element["id"]}" class="delete bg-red-500 rounded py-2 px-4 active:bg-red-600">Cancella</button></td>
          </tr>`;
        });
        html = openhtml + newhtml + closehtml;
        arrTask = data;
      }
      document.querySelector("#app")!.innerHTML = html;
    });
}
//VISUALIZZAZIONE DEI MEMBRI DEL TEAM
function getMember() {
  fetch("http://127.0.0.1:5000/teamMember", {
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
      console.log(data);
      let teamlist = "";
      data?.forEach((element: any) => {
        teamlist += `<option value="${element["id"]}">${element["nome"]} ${element["cognome"]}</option>`;
      });
      document.querySelector("#teamlist")!.innerHTML = teamlist;
      document.querySelector("#teamlist2")!.innerHTML = teamlist;
    });
}
//ASSEGNAZIONE TASK
/*
class FormData {
  
  constructor(parameters) {
    
  }
  let ready: boolean=false;
}*/

interface FormData {
  titolo: string;
  scadenza: string;
  teamid: number;
}
function setTask() {
  let data = <FormData>{
    titolo: formtitolo?.value,
    scadenza: formscadenza?.value,
    teamid: +formteamid?.value,
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
      console.log(data);
      getTask();
    });
}
//Invio del Form
btnsalva?.addEventListener("click", (e) => {
  e.preventDefault();
  setTask();
});
let app = document.querySelector("#app");

//Modifica task
app?.addEventListener("click", editTask);
function editTask(e: any) {
  const clicked = e.target as Element;
  if (clicked.hasAttribute("data-task")) {
    const id = clicked.getAttribute("data-task");
    console.log(id);
    //predere il campo dell' array con quell'id

    arrTask.forEach((el: any) => {
      if (el["id"] == id) {
        targetTask = el;
      }
    });
    console.log(targetTask);

    if (clicked.classList.contains("edit")) {
      console.log("edit");
      modal.style.display = "block";
      const modtitolo = document.querySelector(
        "#modtitolo"
      ) as HTMLInputElement;
      modtitolo.value = targetTask["titolo"];
      const modscadenza = document.querySelector(
        "#modscadenza"
      ) as HTMLInputElement;
      modscadenza.value = targetTask["scadenza"];
    } else if (clicked.classList.contains("delete")) {
      console.log("delete");
      if (id) {
        deleteTask(parseInt(id));
      }
    }
  }
}
//Delete
function deleteTask(id: number) {
  //TODO
  let data = {
    id: id,
  };
  fetch("http://127.0.0.1:5000/deleteTask", {
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
      getTask();
    });
}

//Modale
modal.addEventListener("submit", (event) => {
  event.preventDefault();
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

  modal.style.display = "none";
  getTask();
});

//Chiusura della modale
closemodal.addEventListener("click", () => {
  modal.style.display = "none";
});
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
