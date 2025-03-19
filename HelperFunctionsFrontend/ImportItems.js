import { CreateElementFn, DisplayInsertionMsg } from "./HelperFn.js";
window.api.ImportItemsListener((event, data) => {
  let Pmods = data[0];
  let Nmods = data[1];
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
  DisplayInsertionMsg("Item imported successfully!", "green");
});
