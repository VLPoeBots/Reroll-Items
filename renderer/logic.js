"use strict";

import {
  CreateElementFn,
  DisplayInsertionMsg,
  RemoveElementByClass,
  RemoveBlur,
  CloseSaveWindow,
} from "../HelperFunctionsFrontend/HelperFn.js";
import { GetLSSaves } from "../HelperFunctionsFrontend/LocalStorageFn.js";
import {
  LoadInitialState,
  ShowHiddenContent,
} from "../HelperFunctionsFrontend/LoadInitialState.js";
import { StartCrafting } from "../HelperFunctionsFrontend/StartButton.js";
import "../HelperFunctionsFrontend/ImportItems.js";
import "../HelperFunctionsFrontend/ExportItem.js";
import "../HelperFunctionsFrontend/SaveCraft.js";
//#region Declarations
const Main = document.getElementById("Main");
// let Coords;

const ModNameInput = document.getElementById("ModInput");
const ExcludeModInput = document.getElementById("ExcludeModInput");
const Container = document.getElementById("Container");
const ExclusionContainer = document.getElementById("ExclusionContainer");
const CurrencyDiv = document.getElementById("CurrencyDiv");
const StartButton = document.getElementById("StartButton");
const SavedCrafts = document.getElementById("SavedCrafts");
// let HoverTooltip = document.getElementsByClassName("HoverTooltip");
// let DeleteSaveButton;
let Counter;
// const ExportFileOKButton = document.getElementById("ExportFileOKButton");
// const SaveCraftButton = document.getElementById("SaveCraftButton");
const ImageContainer = document.getElementById("ImageContainer");
// const SaveGallery = document.getElementById("Gallery");
// const Chaos = document.getElementById("ChaosOrb");
// const ChaosOrbLabel = document.getElementById("ChaosOrbLabel");
// const Alt = document.getElementById("OrbofAlteration");
// const AltLabel = document.getElementById("OrbofAlterationLabel");
const ManualContainer = document.getElementById("ManualContainer");
const EssenceContainer = document.getElementById("EssenceContainer");
const EssenceImage = document.getElementById("EssenceImage");
const EssenceClassList = document.getElementsByClassName("Essence");
// const DeafeningEssencesLeft = document.querySelectorAll(".Deafening.Left");
// const ScreamingEssencesLeft = document.querySelectorAll(".Screaming.Left");
// const ShriekingEssenceLeft = document.querySelectorAll(".Shrieking.Left");
const EssenceTabLocationLabel = document.getElementById(
  "EssenceTabItemSpotLabel"
);
// const EssenceTabEssenceCoords = document.getElementById("EssenceTabItemSpot");
// const CurrencyTabEssenceCoords = document.getElementById("CurrencyTabItemSpot");
const CurrencyTabLocationLabel = document.getElementById(
  "CurrencyTabItemSpotLabel"
);
const CurrencyTabDiv = document.getElementById("CurrencyTabDiv");
const EssenceTabDiv = document.getElementById("EssenceTabDiv");
const EssenceNameArray = [];
const Insertion = document.getElementById("Insertion"); // Used for saving crafts
const MaxRerolls = document.getElementById("MaxRerolls");
const LagInput = document.getElementById("LagInput");
// const MinRoll = document.getElementById("MinRoll");
// const InputDiv = document.getElementById("InputDiv");
// const Instructions = document.getElementsByClassName("Instructions");
// const InstructionsDiv1 = document.getElementById("Instructions");
// const InstructionsDiv2 = document.getElementById("Instructions2");
// const InstructionsCheckBox = document.getElementById("InstructionsCheckBox");
const LagCheckBox = document.getElementById("LagCheckBox");
// const CheckBoxClass = document.getElementsByClassName("CheckBox");
// const Fractures = document.getElementById("Fractures");
// const FractureCheckBox = document.getElementById("FractureCheckBox");
const AllowLabelModification = document.getElementsByClassName("Modify");
// const Greed1 = document.getElementById("DeafeningEssenceOfGreed");
// const Greed2 = document.getElementById("ShriekingEssenceOfGreed");
// const Contempt = document.getElementById("DeafeningEssenceOfContempt");
// const Loathing = document.getElementById("DeafeningEssenceOfLoathing");
const StoreCoordsButton = document.getElementById("StoreCoordsButton");
// const TutorialEssence = document.getElementsByClassName("Tutorial");
const ElementsToRemove = [];
const EssenceCoords = {};
// const CurrencyCoords = {};
const XYLabelList = document.getElementsByClassName("XYLabel");
let Currencies = document.getElementsByClassName("Currency");
let CoordsLabelDivList = document.getElementsByClassName("CoordsLabel");
let ManualCurrency = document.getElementsByClassName("Manual");
let AnnulOrbCoords;
let ScourOrbCoords;
let TransmuteOrbCoords;
let AugOrbCoords;
let RegalOrbCoords;
let ChaosOrbCoords;
let OrbofAlterationCoords;
let EssenceTabCoords;
let CurrencyTabCoords;
let CraftMaterial;
// let Timer;
let MouseCoordsX;
let MouseCoordsY;
let ChangingLabel; // The X / Y label for each essence.
let ScreenRatio;
//#endregion
let LagInputLS = localStorage.getItem("LagInput");
if (LagInputLS) {
  LagInput.value = Number(LagInputLS);
}

//#region Hotkey Object
let Hotkeys = {
  RegalOrb: "Ctrl+Shift+Enter",
  AnnulOrb: "Shift+Backspace",
  ScourOrb: "Ctrl+Backspace",
  TransmuteOrb: "Ctrl+Alt+Enter",
  AugOrb: "Shift+Enter",
};
//#endregion
//#region Resize Window
window.api.ScreenRatio("ScreenRatio");
window.api.ScreenRatioValue((value) => {
  ScreenRatio = value;
});

//#endregion
for (const Essence of EssenceClassList) {
  EssenceNameArray.push(Essence.id);
  Essence.style.opacity = 0.2;
}
if (localStorage.length < 2) {
  LoadInitialState();
} else {
  (async function () {
    let IconFolderPath = new Promise((resolve) => {
      window.api.GetIconPath((event, data) => {
        resolve(data);
      });
    });
    let IconPath = await IconFolderPath;

    let SavedItems = GetLSSaves("Save");
    if (Object.keys(SavedItems).length > 0) {
      for (const key of Object.keys(SavedItems)) {
        let IconName = localStorage.getItem(key);
        IconName = IconName.replace("SaveIconName", "");
        IconName = IconName.split("PositiveMods").shift();
        let NewEl = CreateElementFn(
          "img",
          `${key}`,
          ["Image", "Saved"],
          "",
          SavedCrafts
        );
        NewEl.src = `${IconPath}/${IconName}`;
      }
    }
  })();

  for (let i = 0; i < ManualCurrency.length; i++) {
    ManualCurrency[i].classList.remove("Currency");
    ManualCurrency[i].style.opacity = 0.2;
  }

  ManualContainer.addEventListener("mouseover", function (e) {
    if (e.target.classList.contains("Manual")) {
      RemoveElementByClass("HoverTooltip");

      CreateElementFn(
        "div",
        "",
        ["HoverTooltip"],
        `${Hotkeys[e.target.id]}`,
        Insertion
      );
    }
  });
  ManualContainer.addEventListener("mouseout", function (e) {
    if (e.target.classList.contains("Manual")) {
      e.target.style.opacity = 0.2;
      RemoveElementByClass("HoverTooltip");
    }
  });
  StartButton.addEventListener("mouseover", function (e) {
    RemoveElementByClass("HoverTooltip");

    CreateElementFn(
      "div",
      "",
      ["HoverTooltip"],
      "Ctrl + Enter",
      Insertion,
      "aliceblue"
    );
  });
  StartButton.addEventListener("mouseout", function (e) {
    RemoveElementByClass("HoverTooltip");
  });

  let LagBox = localStorage.getItem("LagCheckBox");
  if (LagBox === "checked") {
    LagCheckBox.checked = true;
  } else {
    LagCheckBox.checked = false;
  }

  RemoveElementByClass("XYLabel");
  EssenceTabDiv.remove();
  CurrencyTabDiv.remove();

  for (let i = 0; i < CoordsLabelDivList.length; i++) {
    CoordsLabelDivList[i].id = `${EssenceClassList[i].id}Div`;
  }
  StoreCoordsButton.remove();
  let RenderEssences = JSON.parse(localStorage.getItem("EssenceCoords"));
  let RemoveEssenceFromRender = [];

  ShowHiddenContent();
  for (const Item of CoordsLabelDivList) {
    let Re = Item.id.toString();
    Re = Re.replace("Div", "");
    for (const Essence in RenderEssences) {
      if (Essence.includes(Re)) {
        Item.classList.add("Chosen");
      } else if (!Item.classList.contains("Chosen")) {
        RemoveEssenceFromRender.push(Item);
      }
    }
  }
  for (const Item of RemoveEssenceFromRender) {
    if (!Item.classList.contains("Chosen")) {
      Item.remove();
    }
  }
}
//#region Placeholder Eventlisteners
ModNameInput.addEventListener("focusin", function () {
  ModNameInput.placeholder = "";
});
ModNameInput.addEventListener("focusout", function () {
  ModNameInput.placeholder = "Mod youre looking for";
});

//#endregion
//#region Mods ev.listeners
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("Mod")) {
    e.target.remove();
  }
});
document.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("Mod")) {
    e.target.style.opacity = 0.5;
  }
});
document.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("Mod")) {
    e.target.style.opacity = 1;
  }
});

ModNameInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    CreateElementFn(
      "div",
      "",
      ["ModName", "Mod"],
      ModNameInput.value,
      Container,
      "rgb(112, 255, 112)" // green
    );
    ModNameInput.value = "";
  }
});

ExcludeModInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    CreateElementFn(
      "div",
      "",
      ["ExclusionMod", "Mod"],
      ExcludeModInput.value,
      ExclusionContainer,
      "rgb(255, 62, 28)"
    );
    ExcludeModInput.value = "";
  }
});

//#endregion
//#region Start Button Eventlistener
StartButton.addEventListener("click", function () {
  DisplayInsertionMsg("Crafting started!", "green");
  StartCrafting(CraftMaterial);
});
//#endregion
//#region  Global hotkey
window.api.StartCraft((event, data) => {
  DisplayInsertionMsg("Crafting started!", "green");
  StartCrafting(CraftMaterial);
});
window.api.GlobalKey((event, data) => {
  //data = "ScourOrb"
  let HotkeyCurrencyCoords = localStorage.getItem(`${data}Coords`);
  let ItemCoords = localStorage.getItem("CurrencyTabCoords");
  let DataArray = [];
  DataArray.push(HotkeyCurrencyCoords);
  DataArray.push(ItemCoords);

  window.api.TriggerCurrencyUse(DataArray);
});
//#endregion
//#region  StepUp/Down event listeners
MaxRerolls.addEventListener("wheel", function (e) {});

LagInput.addEventListener("wheel", function (e) {});

//#endregion

//#region CheckBox Eventlistener
LagInput.addEventListener("blur", function () {
  // blur is used for element being out of focus in this case.
  localStorage.setItem("LagInput", LagInput.value);
});

LagCheckBox.addEventListener("change", function () {
  if (LagCheckBox.checked) {
    localStorage.setItem("LagCheckBox", "checked");
  } else {
    localStorage.setItem("LagCheckBox", "");
    LagInput.value = "";
  }
});
//#endregion
//#region Click Event Highlight

EssenceContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("Essence")) {
    Main.style.position = "";
    let SelectedEssence = document.getElementById(`${e.target.id}`);
    ChangingLabel = document.getElementById(`${SelectedEssence.id}` + "Label");
    let HoverHighlight = e.target.classList.contains("Hover", "Highlight");
    SelectedEssence.classList.add("Hover", "Highlight");
    for (const Item of EssenceClassList) {
      Item.style.opacity = 0.2;
      if (ChangingLabel) {
        ChangingLabel.classList.remove("Modify");
      }
      Item.classList.remove("Hover", "Highlight");
    }
    for (const Item of XYLabelList) {
      Item.style.opacity = 0.1;
    }
    if (!HoverHighlight) {
      if (ChangingLabel) {
        ChangingLabel.classList.add("Modify");
        ChangingLabel.style.opacity = 1;
      }

      e.target.style.opacity = 1;
      e.target.classList.add("Hover", "Highlight");
      CraftMaterial = e.target.id;
    }
  }
});
//#endregion

//#region Essence Image Click event
EssenceImage.addEventListener("click", function (e) {
  for (const Item of AllowLabelModification) {
    Item.classList.remove("Modify");
  }
  if (localStorage.length < 2) {
    StoreCoordsButton.style.display = "flex";
  }

  if (
    e.target === EssenceImage &&
    !EssenceImage.classList.contains("Clicked")
  ) {
    EssenceImage.classList.add("Clicked");
    for (let j = 0; j < Currencies.length; j++) {
      Currencies[j].classList.remove("Hover");
    }
    CurrencyDiv.style.display = "none";
    EssenceContainer.style.display = "flex";
    ImageContainer.style.flexDirection = "column";
    EssenceImage.src = "EssencePics/Arrow.png";
  } else {
    for (const Item of EssenceClassList) {
      Item.style.opacity = 0.3;
      Item.classList.remove("Hover", "Highlight");
      CraftMaterial = "";
    }
    CurrencyDiv.style.display = "flex";
    EssenceImage.classList.remove("Clicked");
    window.api.ResizeWindow("abruvwd");
    EssenceContainer.style.display = "none";
    ImageContainer.style.flexDirection = "column";
    EssenceImage.src =
      "EssencePics/Torment/Deafening_Essence_of_Torment_inventory_icon.png";
  }
});
//#endregion
//#region Currencies eventlistener

CurrencyDiv.addEventListener("click", (e) => {
  if (e.target.classList.contains("Currency")) {
    let wasHovered = e.target.classList.contains("Hover");
    ChangingLabel = document.getElementById(`${e.target.id}` + "Label");

    // Remove the "Hover" class from all elements
    for (const Item of AllowLabelModification) {
      Item.classList.remove("Modify");
    }
    for (let j = 0; j < Currencies.length; j++) {
      Currencies[j].classList.remove("Hover");
    }

    // If the clicked element was not already hovered, add the "Hover" class
    if (!wasHovered) {
      e.target.classList.add("Hover");
      CraftMaterial = e.target.id;
      if (ChangingLabel !== null) {
        ChangingLabel.classList.add("Modify");
      }
    }
  }
});
//#endregion

//#region Store Coords button

StoreCoordsButton.addEventListener("click", function () {
  if (
    typeof EssenceTabCoords === "undefined" ||
    typeof CurrencyTabCoords === "undefined"
  ) {
    DisplayInsertionMsg("Please select at least one item's coords", "red");
  } else {
    localStorage.setItem("CurrencyTabCoords", `${CurrencyTabCoords}`);
    localStorage.setItem("ChaosOrbCoords", `${ChaosOrbCoords}`);
    localStorage.setItem("AnnulOrbCoords", `${AnnulOrbCoords}`);
    localStorage.setItem("RegalOrbCoords", `${RegalOrbCoords}`);
    localStorage.setItem("ScourOrbCoords", `${ScourOrbCoords}`);
    localStorage.setItem("TransmuteOrbCoords", `${TransmuteOrbCoords}`);
    localStorage.setItem("AugOrbCoords", `${AugOrbCoords}`);
    localStorage.setItem("OrbofAlterationCoords", `${OrbofAlterationCoords}`);
    localStorage.setItem("EssenceTabCoords", `${EssenceTabCoords}`);

    if (CurrencyTabLocationLabel.textContent === "X:, Y:") {
      DisplayInsertionMsg(
        "Please select the location of the item that will be rolled with alts and chaos",
        "red"
      );
    } else {
      EssenceTabLocationLabel.remove();
      if (EssenceTabLocationLabel.textContent === "X:, Y:") {
        DisplayInsertionMsg(
          "Please select the location of the item that will be rolled with essences",
          "red"
        );
      } else {
        Currencies = document.getElementsByClassName("Currency");
        ShowHiddenContent();
        localStorage.setItem("EssenceCoords", JSON.stringify(EssenceCoords));
        for (const Essence of CoordsLabelDivList) {
          let Replace = Essence.id.replace("Div", "");
          for (const Item in EssenceCoords) {
            if (EssenceCoords[Item].Name.includes(Replace)) {
              document.getElementById(`${Replace}Label`).style.display = "none";
            } else {
              if (!Essence.classList.contains("Selected")) {
                ElementsToRemove.push(Essence);
              }
            }
          }
        }
        for (const Item of ElementsToRemove) {
          Item.remove();
        }
        window.location.reload();
        DisplayInsertionMsg("Items have been stored!", "green");
      }
    }
  }
});
//#endregion

//#region  ItemError:
window.api.ItemError((event, data) => {
  DisplayInsertionMsg(`${data}`, "red");
});
window.api.RarityError((event, data) => {
  DisplayInsertionMsg(`${data}`, "red");
});
//#endregion

//#region Clear Local Storage
window.api.ClearLocalStorage((event, data) => {
  localStorage.clear();
  location.reload();
});
//#endregion

//#region Counter
window.api.Counter((event, data) => {
  if (data === "+") {
    Counter++;
    let CounterElement = document.getElementsByClassName("HoverTooltip");
    CounterElement = CounterElement[0];
    CounterElement.textContent = `Currency used: ${Counter}`;
  } else {
    Counter = 0;
    DisplayInsertionMsg(`Currency used: ${Counter}`);
  }
});
//#endregion

//#region Logfiles
window.api.Logfile((event, data) => {
  DisplayInsertionMsg(`${data}`);
});

//#endregion

//#region Clear Mods
window.api.ClearMods((event, data) => {
  let RemoveModsArray = Array.from(document.getElementsByClassName("Mod"));
  for (let i = 0; i < RemoveModsArray.length; i++) {
    RemoveModsArray[i].remove();
  }
  DisplayInsertionMsg("Cleared all mods!", "green");
});
//#endregion

//#region Load Icons

//#endregion
//#region Escape ev.listener
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    RemoveBlur();
    CloseSaveWindow();
    let ActiveElement = this.document.activeElement;
    if (ActiveElement.classList.contains("Input")) {
      ActiveElement.value = "";
    }
  }
});

//#endregion

//#region Mouse position API
window.api.MousePos((event, data) => {
  let CoordsSplit = data.split(",");
  MouseCoordsX = parseInt(CoordsSplit[0]);
  MouseCoordsY = parseInt(CoordsSplit[1]);
  // X/Y label for each essence
  if (ChangingLabel == undefined) {
    RemoveElementByClass("HoverTooltip");

    DisplayInsertionMsg("No currency selected.", "red");
  }
  if (
    ChangingLabel !== undefined &&
    ChangingLabel.classList.contains("Modify")
  ) {
    ChangingLabel.innerText = `X: ${MouseCoordsX}, Y: ${MouseCoordsY}`;
    ChangingLabel.style.opacity = 1;
    let RemoveTutorialString = ChangingLabel.id.replace("Label", "");
    let EssenceTier;
    if (
      RemoveTutorialString.includes("Deaf") ||
      RemoveTutorialString.includes("Scream") ||
      RemoveTutorialString.includes("Shriek")
    ) {
      if (RemoveTutorialString.includes("Deaf")) {
        EssenceTier = "Deafening";
      } else if (RemoveTutorialString.includes("Shrieking")) {
        EssenceTier = "Shrieking";
      } else if (RemoveTutorialString.includes("Screaming")) {
        EssenceTier = "Screaming";
      }

      EssenceCoords[`${RemoveTutorialString}`] = {
        //////////////////////////////////////////////////
        Name: `${RemoveTutorialString}`,
        Coords: [
          parseInt(MouseCoordsX * ScreenRatio),
          parseInt(MouseCoordsY * ScreenRatio),
        ],
        Tier: EssenceTier,
      };
    } else if (
      !RemoveTutorialString.includes("Spot") &&
      !RemoveTutorialString.includes("Essence")
    ) {
      if (RemoveTutorialString.includes("Chaos")) {
        ChaosOrbCoords = [
          parseInt(MouseCoordsX * ScreenRatio),
          parseInt(MouseCoordsY * ScreenRatio),
        ];
      } else if (RemoveTutorialString.includes("Alteration")) {
        OrbofAlterationCoords = [
          parseInt(MouseCoordsX * ScreenRatio),
          parseInt(MouseCoordsY * ScreenRatio),
        ];
      } else if (RemoveTutorialString.includes("Annul")) {
        AnnulOrbCoords = [
          parseInt(MouseCoordsX * ScreenRatio),
          parseInt(MouseCoordsY * ScreenRatio),
        ];
      } else if (RemoveTutorialString.includes("Regal")) {
        RegalOrbCoords = [
          parseInt(MouseCoordsX * ScreenRatio),
          parseInt(MouseCoordsY * ScreenRatio),
        ];
      } else if (RemoveTutorialString.includes("Transmute")) {
        TransmuteOrbCoords = [
          parseInt(MouseCoordsX * ScreenRatio),
          parseInt(MouseCoordsY * ScreenRatio),
        ];
      } else if (RemoveTutorialString.includes("Scour")) {
        ScourOrbCoords = [
          parseInt(MouseCoordsX * ScreenRatio),
          parseInt(MouseCoordsY * ScreenRatio),
        ];
      } else if (RemoveTutorialString.includes("Aug")) {
        AugOrbCoords = [
          parseInt(MouseCoordsX * ScreenRatio),
          parseInt(MouseCoordsY * ScreenRatio),
        ];
      }
    } else if (
      !RemoveTutorialString.includes("Deafen") &&
      !RemoveTutorialString.includes("Shriek") &&
      !RemoveTutorialString.includes("Scream") &&
      !RemoveTutorialString.includes("Orb") &&
      !RemoveTutorialString.includes("Currency")
    ) {
      EssenceTabCoords = [
        parseInt(MouseCoordsX * ScreenRatio),
        parseInt(MouseCoordsY * ScreenRatio),
      ];
    } else if (
      RemoveTutorialString.includes("Spot") &&
      RemoveTutorialString.includes("Currency")
    ) {
      CurrencyTabCoords = [
        parseInt(MouseCoordsX * ScreenRatio),
        parseInt(MouseCoordsY * ScreenRatio),
      ];
    }

    let RemoveTutorial = document.getElementById(`${RemoveTutorialString}`);
    RemoveTutorial.classList.remove("Tutorial");
  }
});

//rework
//#endregion
