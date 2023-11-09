import DOMElement from "./DOMElement.ts";
import { Button } from "./button.ts";
import { ButtonOptions } from "./button.ts";

import { msgData } from "./msgData.ts";
//import { editTask, deleteTask } from "./main.ts";

const modal = document.querySelector<HTMLDivElement>("#modal");

export interface TableOptions {
  className?: string[];
  theadClass?: string[];
  thClass?: string[];
  trClass?: string[];
  tbodyClass?: string[];
  tdClass?: string[];
  colText: string[];
}

const fieldRowData = [
  "titolo",
  "cognome",
  "stato",
  "assegnazione",
  "scadenza",
  "id", //"nome",
];

export class Table extends DOMElement {
  p: HTMLTableElement;
  pthead;
  ptrhead;
  pth: HTMLTableCellElement[] = [];

  ptbody;
  bodyRow: HTMLTableRowElement[] = [];
  tdClass: string[] = [];

  rowsData: any = [];

  constructor(options: TableOptions) {
    super();
    this.p = document.createElement("table");
    this.pthead = document.createElement("thead");
    this.ptrhead = document.createElement("tr");
    this.p.appendChild(this.pthead);
    this.pthead.appendChild(this.ptrhead);
    for (let index = 0; index < options.colText.length; index++) {
      const th = document.createElement("th");
      th.textContent = options.colText[index];
      if (options.thClass) {
        options.thClass.forEach((cl) => {
          th.classList.add(cl);
        });
      }
      this.ptrhead.appendChild(th);
      this.pth.push(th);
    }
    this.ptbody = document.createElement("tbody");
    this.p.appendChild(this.ptbody);

    //gestioni classi
    if (options.className) {
      options.className.forEach((cl) => {
        this.p.classList.add(cl);
      });
    }
    if (options.theadClass) {
      options.theadClass.forEach((cl) => {
        this.pthead.classList.add(cl);
      });
    }

    if (options.trClass) {
      if (options.trClass) {
        options.trClass.forEach((cl) => {
          this.ptrhead.classList.add(cl);
        });
      }
    }
    if (options.tbodyClass) {
      options.tbodyClass.forEach((cl) => {
        this.ptbody.classList.add(cl);
      });
    }
    if (options.tdClass) {
      options.tdClass.forEach((cl) => {
        this.tdClass.push(cl);
      });
    }
  }

  /**
   * getRowData
   */
  public getRowsData() {
    return this.rowsData;
  }

  /**
   * createRow
   */
  public createRow(rowData: any) {
    let tr = document.createElement("tr");
    this.bodyRow.push(tr);
    console.log(rowData);

    this.rowsData.push(rowData);
    //console.log(this.getRowsData());
    for (let index = 0; index < Object.keys(rowData).length - 2; index++) {
      const th = document.createElement("td");
      tr.appendChild(th);
      console.log(fieldRowData[index]);

      th.textContent = rowData[fieldRowData[index]];
      th.id = String(index);
    }
    //Bottoni
    let td = document.createElement("td");
    const btnOption: ButtonOptions = {
      type: "button",
      id: rowData["id"],
      btnText: "Modifica",
      className: [
        "edit",
        "bg-yellow-500",
        "rounded",
        "py-2",
        "px-4",
        "active:bg-yellow-600",
      ],
      onClick: this.editTask,
    };
    const btn = new Button(btnOption);
    btn.addAttribute("data-task", rowData["id"]);
    td.appendChild(btn.getNode());
    tr.appendChild(td);
    //2
    let td2 = document.createElement("td");
    const btnOption2: ButtonOptions = {
      type: "button",
      id: rowData["id"],
      btnText: "Cancella",
      className: [
        "delete",
        "bg-red-500",
        "rounded",
        "py-2",
        "px-4",
        "active:bg-red-600",
      ],
      onClick: this.editTask,
    };
    const btn2 = new Button(btnOption2);
    btn2.addAttribute("data-task", rowData["id"]);
    td2.appendChild(btn2.getNode());
    tr.appendChild(td2);

    this.renderRow();
  }

  private renderRow() {
    //controllare se la rimozione funziona

    //rimuove tutte le righr della tabella
    while (this.ptbody.firstChild) {
      this.ptbody.removeChild(this.ptbody.firstChild);
    }
    this.bodyRow.forEach((prow) => {
      //ricrea le righe della tabella

      this.ptbody.appendChild(prow);
    });
  }
  private removeRowById(id: any) {
    for (let i = 0; i < this.bodyRow.length; i++) {
      if (this.bodyRow[i].id == id) {
        let spliced = this.bodyRow.splice(i, 1);
        return spliced;
      }
    }
    return undefined;
  }

  //EDIT
  public editTask = (e: any) => {
    let targetTask: any;
    const clicked = e.target as Element;
    //console.log(this);
    if (clicked.hasAttribute("data-task")) {
      const id = clicked.getAttribute("data-task");
      //console.log(id);
      //predere il campo dell' array con quell'id
      console.log(this.rowsData);

      this.rowsData.forEach((el: any) => {
        if (el["id"] == id) {
          targetTask = el;
        }
      });
      //console.log(targetTask);
      const modalmember = msgData.takeMsg("modalmember");
      //console.log(modalmember);

      modalmember.optionSelected(targetTask.nome + " " + targetTask.cognome);

      if (clicked.classList.contains("edit")) {
        //console.log("edit");
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
        //console.log("delete");
        if (id) {
          console.log(id);

          this.deleteTask(parseInt(id));
        }
      }
    }
  };

  //Delete
  public deleteTask = (id: number) => {
    //TODO
    console.log(id);

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
      .then(() => {
        this.removeRowById(id);
      });
  };
}
