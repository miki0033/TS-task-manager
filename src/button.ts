import DOMElement from "./DOMElement.ts";
//
export interface ButtonOptions {
  type?: "submit" | "reset" | "button";
  id?: string;
  className?: string[];
  btnText: string;
}

export class Button extends DOMElement {
  pBtn: HTMLButtonElement;
  constructor(options: ButtonOptions) {
    super();
    this.pBtn = document.createElement("button");
    if (options.type) {
      this.pBtn.type = options.type;
    }
    if (options.className) {
      options.className.forEach((cl) => {
        this.pBtn.classList.add(cl);
      });
    }
  }

  public getNode() {
    return this.pBtn;
  }
}
