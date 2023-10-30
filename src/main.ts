//import css
import "./tailwind.css";
import "./style.css";
//import component
import DOMElement from "./DOMElement.ts";
import * as Form from "./form.ts";
import * as Button from "./button.ts";
import { Div } from "./div.ts";
import { Title, TitleAttribute } from "./title.ts";
//selector
const pApp = document.querySelector<HTMLDivElement>("#app");
const pAppTable = document.querySelector<HTMLDivElement>("#table");

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
  className: classIntoList("flex flex-col justify-start"),
  inputId: "titolo",
  inputClass: classIntoList("border border-gray-300 rounded-md p-2"),
};
pForm.addInput(inpOptions);
let selectOptions: Form.divSelectOptions = {
  className: classIntoList("border border-gray-300 rounded-md p-2"),
  labelText: "Assegna a:",
  inputId: "teamlist2",
  selectClass: classIntoList("border border-gray-300 rounded-md p-2"),
  options: optionData(getMember()),
};
pForm.addSelect(selectOptions);

pForm.addSubmitButton();

function classIntoList(cls: string): string[] {
  const lst: string[] = cls.split(" ");
  return lst;
}

async function getMember(): any[] {
  let dt = await fetch("http://127.0.0.1:5000/teamMember", {
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
      return data;
    });
  console.log(dt);

  return dt;
}

function optionData(data: any): Form.optionData[] {
  console.log(data);

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
