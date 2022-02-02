var craftAmount = 1000;

var cardTemplate = document.getElementById("card-template");
var costTemplate = document.getElementById("cost-template");
var cardContainer = document.querySelector(".card-container");

var smelter = document.getElementById("smelter");
var loom = document.getElementById("loom");
var tannery = document.getElementById("tannery");
var woodshop = document.getElementById("woodshop");
var stonecutting = document.getElementById("stonecutting");
var arcana = document.getElementById("arcana");

smelter.addEventListener("click", (_) => {
  cardContainer.innerHTML = "";
  smelterResources.forEach((r) => addResource(r));
});

loom.addEventListener("click", (_) => {
  cardContainer.innerHTML = "";
  loomResources.forEach((r) => addResource(r));
});

tannery.addEventListener("click", (_) => {
  cardContainer.innerHTML = "";
  tanneryResources.forEach((r) => addResource(r));
});

woodshop.addEventListener("click", (_) => {
  cardContainer.innerHTML = "";
  woodshopResources.forEach((r) => addResource(r));
});

stonecutting.addEventListener("click", (_) => {
  cardContainer.innerHTML = "";
  stonecuttingResources.forEach((r) => addResource(r));
});

arcana.addEventListener("click", (_) => {
  cardContainer.innerHTML = "";
  arcanaResources.forEach((r) => addResource(r));
});

smelterResources.forEach((r) => addResource(r));

function addResource(res) {
  var cardClone = cardTemplate.content.cloneNode(true);

  var name = cardClone.getElementById("resource-name");
  var icon = cardClone.getElementById("resource-icon");

  var priceInput = cardClone.getElementById("price-input");
  var chanceInput = cardClone.getElementById("chance-input");
  var amountInput = cardClone.getElementById("amount-input");

  var totalCostOutput = cardClone.getElementById("total-cost-output");
  var totalAmountOutput = cardClone.getElementById("total-amount-output");
  var profitOutput = cardClone.getElementById("profit-output");

  priceInput.value = res.MarketPrice;
  chanceInput.value = res.ReturnRate;
  amountInput.value = 100;

  priceInput.addEventListener("input", (_) => {
    res.MarketPrice = parseFloat(priceInput.value);
    res.calculateUnitValue(true);
  });

  chanceInput.addEventListener("input", (_) => {
    res.ReturnRate = parseFloat(chanceInput.value);
    res.calculateUnitValue(true);
  });

  amountInput.addEventListener("input", (_) => {
    res.Amount = parseInt(amountInput.value);
    res.calculateUnitValue(true);
  });

  res.onValueChanged((_) => {
    totalCostOutput.value = res.getTotalCost();
    totalAmountOutput.value = res.getTotalAmount();

    var profit = res.calculateProfit();
    profitOutput.value = profit;

    //check best price
    if (profit > 0) {
      profitOutput.style.backgroundColor = "#80db5c";
      icon.style.borderColor = "#80db5c";
      name.style.color = "#80db5c";
    } else {
      profitOutput.style.backgroundColor = "#e95f5f";
      icon.style.borderColor = "#e95f5f";
      name.style.color = "#e95f5f";
    }
  });

  name.innerHTML = res.Name.toUpperCase();
  icon.src = "/images/icons/" + res.Id + ".png";

  res.CraftMaterials.forEach((cm) => {
    addParam(res, cardClone, cm);
  });

  res.calculateUnitValue();
  cardContainer.appendChild(cardClone);
}

function addParam(res, cardClone, matCost) {
  var costClone = costTemplate.content.cloneNode(true);
  var costResource = searchResource(matCost.Id);

  var costIcon = costClone.querySelector(".cost-icon");
  var costInput = costClone.getElementById("cost-input");

  costIcon.src = "/images/icons/" + matCost.Id + ".png";
  costInput.disabled = costResource.IsCraftable;

  costResource.calculateUnitValue(true);
  costInput.value = costResource.getUnitValue();

  costResource.onValueChanged((_) => {
    costInput.value = costResource.getUnitValue();
  });

  costInput.addEventListener("input", (_) => {
    costResource.MarketPrice = parseFloat(costInput.value);
    costResource.calculateUnitValue();
    res.calculateUnitValue();
  });

  costInput.addEventListener("change", (_) => {
    costResource.MarketPrice = parseFloat(costInput.value);
    costResource.calculateUnitValue(true);
    res.calculateUnitValue(true);
  });

  cardClone.querySelector(".resources").appendChild(costClone);
}
