const modal = document.querySelector<HTMLDivElement>("#modal");
const closemodal = document.querySelector<HTMLButtonElement>("#close");

//EDIT
export function editTask(e: any) {
  const clicked = e.target as Element;

  if (clicked.hasAttribute("data-task")) {
    const id = clicked.getAttribute("data-task");
    console.log(id);
    //predere il campo dell' array con quell'id

    pTable.rowData.forEach((el: any) => {
      if (el["id"] == id) {
        targetTask = el;
      }
    });
    console.log(targetTask);

    if (clicked.classList.contains("edit")) {
      console.log("edit");
      modal!.style.display = "block";
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
export function deleteTask(id: number) {
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
