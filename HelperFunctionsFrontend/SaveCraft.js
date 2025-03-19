import {
  CreateElementFn,
  GetCurrentItem,
  DisplayInsertionMsg,
  BlurBG,
  RemoveBlur,
  CenterItem,
  CloseSaveWindow,
  DeleteSavedItem,
  RemoveElementByClass,
} from "./HelperFn.js";
import {
  ChangeLSSaves,
  DeleteLSSaveItem,
  GetLSSaves,
  CreateLocalStorageSave,
} from "./LocalStorageFn.js";
const SaveGallery = document.getElementById("Gallery");
const GalleryImageArray = document.getElementsByClassName("GalleryImage");

//#region Save item
SaveCraftButton.addEventListener("click", function () {
  let SavedSelectedIcon = document.getElementsByClassName("SavedSelectedIcon");

  // Adds / removes mods from existing saves
  if (SavedSelectedIcon.length > 0) {
    let Mods = GetCurrentItem();
    let IconName = SavedSelectedIcon[0].src.split("/").pop();
    let SelectedName = SavedSelectedIcon[0].id;
    if (Mods[0].length > 0) {
      let SaveString = `SaveIconName${IconName}PositiveMods${JSON.stringify(
        Mods[0]
      )}NegativeMods${JSON.stringify(Mods[1])}`;
      ChangeLSSaves(SelectedName, SaveString);
      DisplayInsertionMsg(
        "Successfully saved changes to the selected existing item",
        "green"
      );
    } else {
      DisplayInsertionMsg("Please select at least one positive mod", "red");
    }
  } else {
    const SaveCraftContainer = document.getElementById("SaveCraftContainer");
    if (!SaveCraftContainer) {
      let SaveCraftContainer = CreateElementFn(
        "div",
        "SaveCraftContainer",
        ["SaveCraft", "SelectNone"],
        "Select an icon",
        document.body
      );
      BlurBG();
      CenterItem(SaveCraftContainer);
      window.api.LoadSaveIconPics("InitialRequest");
      SaveGallery.style.display = "grid";
      SaveCraftContainer.appendChild(SaveGallery);

      SaveGallery.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("Image")) {
          e.target.style.transform = "scale(0.6)";
          e.target.style.opacity = "1";
          e.target.classList.add("SelectedIcon");
          for (let i = 0; i < GalleryImageArray.length; i++) {
            if (e.target !== GalleryImageArray[i]) {
              GalleryImageArray[i].style.opacity = "0.35";
              GalleryImageArray[i].classList.remove("SelectedIcon");
            }
          }
        }
      });
      SaveGallery.addEventListener("mouseup", (e) => {
        if (e.target.classList.contains("Image")) {
          e.target.style.transform = "scale(1)";
        }
      });
      SaveGallery.addEventListener("mouseout", (e) => {
        if (e.target.classList.contains("Image")) {
          e.target.style.transform = "scale(1)";
        }
      });
      let NameSaveSelector = CreateElementFn(
        "input",
        "NameSaveSelectorInput",
        ["SaveCraft", "Input"],
        "",
        SaveCraftContainer
      );
      NameSaveSelector.placeholder = "Select a name";

      NameSaveSelector.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
          let SaveName = NameSaveSelector.value;
          let SaveIcon = document.getElementsByClassName("SelectedIcon")[0];
          let NameTaken = false; // used to check if the name is already taken
          if (e.key === "Enter" && SaveIcon != null) {
            if (SaveName !== "") {
              let LSSave = GetLSSaves("Save");
              if (Object.keys(LSSave).length > 0) {
                // If object exists, extract its name from the LS save and compare it and assign a value to NameTaken.
                for (const key of Object.keys(LSSave)) {
                  if (SaveName === key) {
                    NameTaken = true; // Break out of the loop without setting NameTaken to true
                    break;
                  }
                }
              }
              //
              //
              //
              //
              if (!NameTaken) {
                RemoveBlur();
                CloseSaveWindow();

                let SaveIconName = SaveIcon.src.split("/").pop();
                // && GetMods[1].length > 0
                let GetMods = GetCurrentItem();
                if (GetMods[0].length > 0) {
                  RemoveBlur();
                  CloseSaveWindow();
                  let SaveString = `SaveIconName${SaveIconName}PositiveMods${JSON.stringify(
                    GetMods[0]
                  )}NegativeMods${JSON.stringify(GetMods[1])}`;
                  let SavedItem = await CreateLocalStorageSave(
                    SaveName,
                    SaveString
                  );
                  let NewSave = CreateElementFn(
                    "img",
                    SaveName,
                    ["Saved", "Image"],
                    "",
                    SavedCrafts
                  );
                  NewSave.src = `${SaveIcon.src}`;
                  SavedCrafts.appendChild(NewSave);
                  SaveCraftContainer.remove();
                } else {
                  RemoveBlur();
                  CloseSaveWindow();

                  DisplayInsertionMsg(
                    "Please select mods for the craft you want  to save",
                    "red"
                  );
                }
              } else {
                RemoveBlur();
                CloseSaveWindow();

                DisplayInsertionMsg(
                  "Name already taken, please select another one",
                  "red"
                );
              }
            } else if (e.key === "Enter" && SaveName === "") {
              RemoveBlur();
              CloseSaveWindow();

              DisplayInsertionMsg("Please select a name for the save", "red");
            }
          } else if (e.key === "Enter" && SaveIcon === undefined) {
            CloseSaveWindow();

            RemoveBlur();
            DisplayInsertionMsg("Please select an icon for the save", "red");
          }
        }
      });
    }
  }
});
//#endregion

//#region Load saved item
SavedCrafts.addEventListener("click", (e) => {
  if (e.target.classList.contains("Image")) {
    let Name = e.target.id; // Example:  ShaperWand
    GetSavedItem("Save", Name)
      .then((result) => {
        let Pmods = JSON.parse(result[0]);
        let Nmods = JSON.parse(result[1]);
        RemoveElementByClass("ModName");
        RemoveElementByClass("ExclusionMod");
        for (let i = 0; i < Pmods.length; i++) {
          CreateElementFn(
            "label",
            "",
            ["ModName", "Mod"],
            Pmods[i],
            Container,
            "rgb(112, 255, 112)"
          );
        }
        for (let i = 0; i < Nmods.length; i++) {
          CreateElementFn(
            "label",
            "",
            ["ExclusionMod", "Mod"],
            Nmods[i],
            ExclusionContainer,
            "rgb(255, 62, 28)"
          );
        }

        DisplayInsertionMsg("Saved item loaded successfully!", "green");
      })
      .catch((error) => {
        DisplayInsertionMsg(`Error loading item: ${error}`, "red");

        console.error(error);
      });
  }
});
//#endregion
//#region Delete Saved Items

SavedCrafts.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("Saved")) {
    e.target.classList.add("Delete");
  }
});
SavedCrafts.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("Delete")) {
    e.target.classList.remove("Delete");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Delete") {
    let SelectedItem = document.getElementsByClassName("Delete")[0];
    if (SelectedItem) {
      DeleteSavedItem(SelectedItem, DeleteLSSaveItem);
      DisplayInsertionMsg("Saved item deleted!", "green");
    }
  }
});

//#endregion
//#region Display labels
SavedCrafts.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("Image")) {
    RemoveElementByClass("HoverTooltip");
    CreateElementFn("div", "", ["HoverTooltip"], `${e.target.id}`, Insertion);
  }
});
SavedCrafts.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("Image")) {
    e.target.style.width = "40px";
    e.target.style.height = "40px";
    RemoveElementByClass("HoverTooltip");

    for (let i = HoverTooltip.length - 1; i >= 0; i--) {
      HoverTooltip[i].remove();
    }
  }
});
//#endregion
//#region Display Icons
window.api.SaveIconsData((event, data) => {
  let IconFolderPath = data[0];
  let IconNameArray = data[1];

  for (let i = 0; i < IconNameArray.length; i++) {
    let NewElement = document.getElementById(IconNameArray[i]);
    if (!NewElement) {
      let NewImg = CreateElementFn(
        "img",
        `${IconNameArray[i]}`,
        ["Image", "GalleryImage"],
        "",
        SaveGallery
      );
      let NewImgSrc = IconFolderPath + "\\" + IconNameArray[i];
      NewImg.src = NewImgSrc;
    }
  }
});
//#endregion
