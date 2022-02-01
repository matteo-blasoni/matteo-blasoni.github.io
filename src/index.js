var craftAmount = 1000;

var matTemplate = document.getElementById("mat-template");
var paramTemplate = document.getElementById("mat-param-template");
var view = document.querySelector(".view");

var smelter = document.getElementById("smelter");
var loom = document.getElementById("loom");
var tannery = document.getElementById("tannery");
var woodshop = document.getElementById("woodshop");
var arcana = document.getElementById("arcana");

smelter.addEventListener("click", (_) => {
  view.innerHTML = "";
  smelterResources.forEach((r) => addResource(r));
});

loom.addEventListener("click", (_) => {
  view.innerHTML = "";
  loomResources.forEach((r) => addResource(r));
});

tannery.addEventListener("click", (_) => {
  view.innerHTML = "";
  tanneryResources.forEach((r) => addResource(r));
});

woodshop.addEventListener("click", (_) => {
  view.innerHTML = "";
  woodshopResources.forEach((r) => addResource(r));
});

arcana.addEventListener("click", (_) => {
  view.innerHTML = "";
  arcanaResources.forEach((r) => addResource(r));
});

smelterResources.forEach((r) => addResource(r));

function addResource(res) {
  var matClone = matTemplate.content.cloneNode(true);

  var mat = matClone.querySelector(".mat");
  var name = matClone.querySelector(".mat-name");
  var icon = matClone.querySelector(".mat-icon");

  var priceIn = matClone.getElementById("mat-price");
  var rateIn = matClone.getElementById("mat-rate");

  priceIn.value = res.MarketPrice;
  rateIn.value = res.ReturnRate;

  priceIn.addEventListener("input", (_) => {
    res.MarketPrice = parseFloat(priceIn.value);
    res.calculateUnitValue(true);
    console.log("changing price");
  });

  rateIn.addEventListener("input", (_) => {
    res.ReturnRate = parseFloat(rateIn.value);
    res.calculateUnitValue(true);
    console.log(res);
  });

  res.onValueChanged((_) => {
    if (res.getUnitValue() < res.MarketPrice) {
      mat.style.backgroundColor = "#b2cf7f";
    } else {
      mat.style.backgroundColor = "#cf9c7f";
    }
  });

  name.innerHTML = "<b>" + res.Name.toUpperCase() + ":" + "</b>";
  icon.src = "/images/icons/" + res.Id + ".png";

  res.CraftMaterials.forEach((cm) => {
    addParam(res, matClone, cm);
  });

  view.appendChild(matClone);
}

function addParam(res, matClone, craftMat) {
  var paramClone = paramTemplate.content.cloneNode(true);
  var craftRes = searchResource(craftMat.Id);

  var resText = paramClone.querySelector("p");
  var resCostIn = paramClone.querySelector("input");

  resText.innerHTML = craftRes.Name + " (" + craftMat.Amount + ")";
  resCostIn.disabled = craftRes.IsCraftable;

  craftRes.calculateUnitValue(true);
  resCostIn.value = craftRes.getUnitValue();

  craftRes.onValueChanged((_) => {
    resCostIn.value = craftRes.getUnitValue();
  });

  resCostIn.addEventListener("input", (_) => {
    craftRes.MarketPrice = parseFloat(resCostIn.value);
    craftRes.calculateUnitValue();
    res.calculateUnitValue();
  });

  resCostIn.addEventListener("change", (_) => {
    craftRes.MarketPrice = parseFloat(resCostIn.value);
    craftRes.calculateUnitValue(true);
    res.calculateUnitValue(true);
  });

  matClone.querySelector(".mat").appendChild(paramClone);
}
