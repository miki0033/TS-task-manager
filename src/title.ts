import DOMElement from "./DOMElement.ts";

export interface TitleAttribute {
  hn: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  classList?: string[];
  text: string;
  id?: string;
}

export class Title extends DOMElement {
  p: HTMLHeadingElement;
  constructor(attribute: TitleAttribute) {
    super();
    this.p = document.createElement(attribute.hn);
    if (attribute.classList) {
      attribute.classList.forEach((cl) => {
        this.p.classList.add(cl);
      });
    }
    if (attribute.text) {
      this.p.textContent = attribute.text;
    }
    if (attribute.id) {
      this.p.id = attribute.id;
    }
  }
}
