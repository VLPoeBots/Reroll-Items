import { RemoveElementByClass, DisplayInsertionMsg } from "./HelperFn.js";

export function StartCrafting(CraftMaterial) {
  let Coords;
  let InfoArray = []; //Array to send data to backend
  let TabCoords;
  let LagInputNumber;
  if (LagCheckBox.checked) {
    LagInputNumber = Number(LagInput.value);
  } else {
    LagInputNumber = 0;
  }

  const ExclusionModClass = document.getElementsByClassName("ExclusionMod");
  const ModClass = document.getElementsByClassName("ModName");
  let ModNumber = document.getElementById("ModNumber"); // Minimum number of mods to look for
  let Hover = document.getElementsByClassName("Hover");
  if (localStorage.length < 1) {
    RemoveElementByClass("HoverTooltip");
    DisplayInsertionMsg("Select coords first!", "red");
  } else if (Hover.length > 0) {
    InfoArray.length = 0;
    if (ModClass.length > 0) {
      let Fracture = FractureCheckBox.checked;
      let ModArray = [];
      let ExclusionModArray = [];
      if (ExclusionModClass.length > 0) {
        for (let i = 0; i < ExclusionModClass.length; i++) {
          ExclusionModArray.push(
            ExclusionModClass[i].textContent.toLocaleLowerCase().trim()
          );
        }
      }
      for (let i = 0; i < ModClass.length; i++) {
        let MyMod = ModClass[i].textContent.toLocaleLowerCase().trim();
        let HasNumber = /\d/.test(MyMod);
        if (!HasNumber) {
          MyMod = MyMod + "0";
        }
        ModArray.push(MyMod);
      }

      Coords = localStorage.getItem(`${CraftMaterial}Coords`);
      Coords = Coords.replace("[", "").replace("]", "");
      if (CraftMaterial.includes("Essence")) {
        TabCoords = localStorage.getItem("EssenceTabCoords");
      } else if (CraftMaterial === "Harvest") {
        TabCoords = localStorage.getItem("HarvestTabCoords");
      } else {
        TabCoords = localStorage.getItem("CurrencyTabCoords");
      }
      TabCoords = TabCoords.replace("[", "").replace("]", "");

      InfoArray.push(ModArray); //0
      InfoArray.push(MaxRerolls.value); //1
      InfoArray.push(Coords); //2
      InfoArray.push(TabCoords); //3
      InfoArray.push(CraftMaterial); //4
      InfoArray.push(Fracture); //5
      InfoArray.push(ExclusionModArray); //6
      InfoArray.push(Number(LagInputNumber)); //7
      InfoArray.push(Number(ModNumber.value)); //8 - Minimum number of mods to look for
      console.log("InfoArray: ", InfoArray);
      window.api.StartCrafting(InfoArray);
    } else {
      RemoveElementByClass("HoverTooltip");

      DisplayInsertionMsg("No mods selected", "red");
    }
  } else {
    RemoveElementByClass("HoverTooltip");

    DisplayInsertionMsg(
      "Select currency to roll with by clicking (Chaos, alt or essence)",
      "red"
    );
  }
}
