import DOMElement from "./DOMElement.ts";
import { Button } from "./button.ts";
import { ButtonOptions } from "./button.ts";

export class Form extends DOMElement {
  action = "";
  method = "get";
  p: HTMLFormElement;
  children: any[] = [];
  constructor(
    method: string,
    action?: string,
    classList?: string[],
    children?: HTMLElement[]
  ) {
    super();
    this.p = document.createElement("form");
    this.p.method = method;
    this.method = method;

    if (action) {
      this.p.action = action;
      this.action = action;
    } else this.p.action = this.action;

    if (classList) {
      classList.forEach((cl) => {
        this.p.classList.add(cl);
      });
    }

    children?.forEach((child) => {
      this.p.appendChild(child);
    });
  }

  public getMethod() {
    return this.method;
  }
  public getNode() {
    return this.p;
  }
  /**
   * addInput
   */
  public addInput(options: divInputOptions): HTMLInputElement {
    const pInput = new divInput(options);
    this.p.appendChild(pInput.getNode());
    this.children.push(pInput);
    return pInput.getInputNode();
  }
  public addSelect(options: divSelectOptions) {
    const pInput = new divSelect(options);
    this.p.appendChild(pInput.getNode());
    this.children.push(pInput);
    return pInput.getInputNode();
  }

  /**
   * addSubmitButton
   */
  public addSubmitButton(options: ButtonOptions) {
    const pBtn = new Button(options);
    this.p.appendChild(pBtn.getNode());
    this.children.push(pBtn);
  }

  /**
   * takeFormInputById
   */
  /*public takeFormInputById(takeid: string) {
    let value: any;
    for (let i = 0; i < this.children.length; i++) {
      console.log(this.children[i].pInput);
      if (this.children[i]?.pInput?.getInputId() == takeid) {
        console.log(this.children[i].pInput);
        value = this.children[i].pInput.value;
        break;
      }
    }
    return value;
  }*/
}
export interface divInputOptions {
  className?: string[];
  labelText?: string;
  labelClass?: string[];
  inputName?: string;
  inputType: string;
  inputId?: string;
  inputClass?: string[];
}

export class divInput extends DOMElement {
  pDiv: HTMLDivElement;
  pLabel: HTMLLabelElement;
  pInput: HTMLInputElement;
  constructor(options: divInputOptions, children?: HTMLElement[]) {
    super();
    //creo i puntatori
    this.pDiv = document.createElement("div");
    this.pLabel = document.createElement("label");
    this.pInput = document.createElement("input");
    this.pDiv.append(this.pLabel);
    this.pDiv.append(this.pInput);
    //aggiungo le classi
    if (options.className) {
      options.className.forEach((cl) => {
        this.pDiv.classList.add(cl);
      });
    }

    if (options.labelClass) {
      options.labelClass.forEach((cl) => {
        this.pLabel.classList.add(cl);
      });
    }

    if (options.inputClass) {
      options.inputClass.forEach((cl) => {
        this.pInput.classList.add(cl);
      });
    }
    //LABEL text
    if (options.labelText) {
      this.pLabel.textContent = options.labelText;
    }
    //aggiungo id
    if (options.inputId) {
      this.pInput.id = options.inputId;
      //this.pLabel.id = options.inputId;
    }
    if (options.inputType) {
      this.pInput.type = options.inputType;
    }
    //aggiungo name
    if (options.inputName) {
      this.pInput.name = options.inputName;
    }

    children?.forEach((child) => {
      this.pDiv.appendChild(child);
    });
  }
  public getNode() {
    return this.pDiv;
  }
  public getValue() {
    return this.pInput.value;
  }
  /**
   * getInputId
   */
  public getInputNode() {
    return this.pInput;
  }
}

export interface divSelectOptions {
  className?: string[];
  labelClass?: string[];
  labelText?: string;
  inputId?: string;
  selectName?: string;
  selectClass?: string[];
  options: optionData[];
  optionClass?: string[];
}
export interface optionData {
  value: string;
  optionText: string;
}

export class divSelect extends DOMElement {
  inputType = "select";
  pDiv: HTMLDivElement;
  pLabel: HTMLLabelElement;
  pSelect: HTMLSelectElement;
  pOptions: HTMLOptionElement[] = [];
  constructor(options: divSelectOptions, children?: HTMLElement[]) {
    super();
    this.pDiv = document.createElement("div");
    this.pLabel = document.createElement("label");
    this.pSelect = document.createElement("select");
    this.pDiv.append(this.pLabel);
    this.pDiv.append(this.pSelect);
    //aggiungo le classi
    if (options.className) {
      options.className.forEach((cl) => {
        this.pDiv.classList.add(cl);
      });
    }
    if (options.labelClass) {
      options.labelClass.forEach((cl) => {
        this.pLabel.classList.add(cl);
      });
    }

    if (options.selectClass) {
      options.selectClass.forEach((cl) => {
        this.pSelect.classList.add(cl);
      });
    }
    //aggiungo i testi
    if (options.labelText) {
      this.pLabel.textContent = options.labelText;
    }

    //aggiungo id
    if (options.inputId) {
      this.pSelect.id = options.inputId;
      //this.pLabel.for = options.inputId;
    }
    //aggiungo name
    if (options.selectName) {
      this.pSelect.name = options.selectName;
    }
    //creo le option
    if (options.options) {
      options.options.forEach((opt: optionData) => {
        const pOption: HTMLOptionElement = document.createElement("option");
        pOption.value = opt.value;
        pOption.text = opt.optionText;
        this.pSelect.append(pOption);
        this.pOptions.push(pOption);
      });
    }

    //aggiungo in coda eventuali children
    children?.forEach((child) => {
      this.pDiv.appendChild(child);
    });
  }
  public getNode() {
    return this.pDiv;
  }
  public getInputNode() {
    return this.pSelect;
  }

  /**
   * optionSelected
   */
  public optionSelected(value: string) {
    //console.log(value);

    this.pOptions.forEach((opt) => {
      if (opt.text == value) {
        opt.selected = true;
      }
    });
  }
}
