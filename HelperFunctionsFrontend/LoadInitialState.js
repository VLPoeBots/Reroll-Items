"use strict";
import { CreateElementFn } from "./HelperFn.js";
import { GetLSSaves } from "./LocalStorageFn.js";
export function LoadInitialState() {
  let VisibleElements = GetLSSaves("");
  let RemoveElements = [];
  VisibleElements = [...Object.keys(VisibleElements)];
  for (let i = 0; i < VisibleElements.length; i++) {
    VisibleElements[i] = VisibleElements[i].replace("Coords", "");
    if (VisibleElements[i].includes("Essence")) {
      VisibleElements[i] = VisibleElements[i].replace("DeafeningEssenceOf", "");
    }
  }
  let CurrencyGroup = [...document.getElementsByClassName("CurrencyGroup")];
  for (let i = 0; i < CurrencyGroup.length; i++) {
    if (CurrencyGroup[i].id.includes("Tab")) {
      CurrencyGroup[i].remove();
    }
    if (CurrencyGroup[i]) {
      let CurrentID = CurrencyGroup[i].id.replace("Group", "");
      if (!CurrentID.includes("Tab")) {
        if (!VisibleElements.includes(CurrentID)) {
          RemoveElements.push(document.getElementById(CurrentID + "Group"));
        }
      }
    }
  }

  let EssenceGroup = [...document.getElementsByClassName("EssenceGroup")];
  for (let i = 0; i < EssenceGroup.length; i++) {
    if (EssenceGroup[i]) {
      let CurrentID = EssenceGroup[i].id;
      if (!VisibleElements.includes(CurrentID)) {
        RemoveElements.push(document.getElementById(CurrentID));
      }
    }
  }

  for (let i = 0; i < RemoveElements.length; i++) {
    RemoveElements[i].remove();
  }
  if (document.getElementsByClassName("EssenceGroup").length < 1) {
    let EssenceImage = document.getElementById("EssenceImage");
    EssenceImage.remove();
  }
  let Hover = [...document.getElementsByClassName("Hover")];
  if (Hover[0]) {
    Hover[0].classList.toggle("Hover");
  }

  let XYLabelList = [...document.getElementsByClassName("XYLabel")];
  for (let i = 0; i < XYLabelList.length; i++) {
    XYLabelList[i].remove();
  }
  ShowHiddenContent();
  let StoreCoordsButton = document.getElementById("StoreCoordsButton");
  StoreCoordsButton.remove();
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
