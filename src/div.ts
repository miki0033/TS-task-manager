import DOMElement from "./DOMElement.ts";

export class Div extends DOMElement {
  pDiv: HTMLDivElement;
  children: HTMLElement[] = [];
  constructor(classList?: string[], id?: string) {
    super();
    this.pDiv = document.createElement("div");
    //aggiungo le classi
    if (classList) {
      classList.forEach((cl) => {
        this.pDiv.classList.add(cl);
      });
    }
    //aggiungo id
    if (id) {
      this.pDiv.id = id;
    }
  }
  public getNode() {
    return this.pDiv;
  }
  /**
   * appendChild
   */
  public append(p: HTMLElement) {
    this.pDiv.appendChild(p);
    this.children.push(p);
  }
}
