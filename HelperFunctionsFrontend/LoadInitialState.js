"use strict";
import { CreateElementFn } from "./HelperFn.js";
export function LoadInitialState() {
  let CoordsLabelDivList = document.getElementsByClassName("CoordsLabel");
  const EssenceClassList = document.getElementsByClassName("Essence");
  for (let i = 0; i < CoordsLabelDivList.length; i++) {
    CoordsLabelDivList[i].id = `${EssenceClassList[i].id}Div`;
    let CoordsLabel = CreateElementFn(
      "label",
      `${EssenceClassList[i].id}Label`,
      ["XYLabel"],
      "X: , Y: ",
      CoordsLabelDivList[i]
    );
    CoordsLabel.style.display = "flex";
    CoordsLabel.style.opacity = 0.1;
    CoordsLabel.style.margin = "5px";
  }
}
export function ShowHiddenContent() {
  let HiddenElements = Array.from(
    document.getElementsByClassName("InitiallyHidden")
  );
  for (let i = 0; i < HiddenElements.length; i++) {
    HiddenElements[i].classList.remove("InitiallyHidden");
    HiddenElements[i].style.display = "flex";
  }
}
