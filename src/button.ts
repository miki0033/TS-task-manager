import DOMElement from "./DOMElement.ts";
//
export interface ButtonOptions {
  type?: "submit" | "reset" | "button";
  id?: string;
  className?: string[];
  btnText: string;
  onClick: (e: Event) => void;
}

export class Button extends DOMElement {
  pBtn: HTMLButtonElement;
  onClick: (e: Event) => void = () => {};
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
    if (options.id) {
      this.pBtn.id = options.id;
    }
    if (options.btnText) {
      this.pBtn.textContent = options.btnText;
    }
    if (options.onClick) {
      this.onClick = options.onClick;
      this.pBtn.onclick = options.onClick;
    }
  }

  public getNode() {
    return this.pBtn;
  }

  /**
   * addClickListener
   */
  public addClickListener(eventListener: () => {}) {
    this.onClick = eventListener;
    this.pBtn.onclick = this.onClick;
  }
}
