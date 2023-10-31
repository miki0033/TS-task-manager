import DOMElement from "./DOMElement.ts";

export interface TableOptions {
  className?: string[];
  theadClass?: string[];
  thClass?: string[];
  trClass?: string[];
  tbodyClass?: string[];
  tdClass?: string[];
  colText: string[];
}

export class Table extends DOMElement {
  p: HTMLTableElement;
  pthead;
  ptrhead;
  pth: HTMLTableCellElement[] = [];

  ptbody;
  bodyRow: HTMLTableRowElement[] = [];
  tdClass: string[] = [];

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
   * createRow
   */
  public createRow(rowData: string[]) {
    let tr = document.createElement("tr");
    this.bodyRow.push(tr);
    for (let index = 0; index < rowData.length; index++) {
      const th = document.createElement("td");
      th.textContent = rowData[index];
      th.id = String(index);
    }
  }
}
