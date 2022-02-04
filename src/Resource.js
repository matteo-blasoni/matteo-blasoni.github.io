class CraftMaterial {
  Id;
  Amount;
}

class Resource {
  Id;
  Name;
  MarketPrice;
  IsCraftable;
  ReturnRate;
  Amount = 100;
  CraftMaterials = [];

  #totalAmount;
  #totalCost;
  #unitValue;

  #callbacks = [];

  onValueChanged(callback) {
    this.#callbacks.push(callback);
  }

  calculateUnitValue(fixed = false) {
    var unitCost = Infinity;

    if (this.IsCraftable) {
      this.#totalCost = 0;

      this.CraftMaterials.forEach((cm) => {
        var matPrice = searchResource(cm.Id).getUnitValue();

        this.#totalCost += matPrice * cm.Amount * this.Amount;
      });

      this.#totalCost = this.#totalCost.toFixed(2);

      this.#totalAmount = (
        this.Amount +
        (this.Amount * this.ReturnRate) / 100
      ).toFixed(0);

      unitCost = this.#totalCost / this.#totalAmount;
    }

    if (fixed) {
      this.#unitValue = Math.min(this.MarketPrice, unitCost).toFixed(2);
    } else {
      this.#unitValue = Math.min(this.MarketPrice, unitCost);
    }

    //Dispatch event
    this.#callbacks.forEach((call) => {
      call();
    });
  }

  getTotalCost() {
    return this.#totalCost;
  }

  getTotalAmount() {
    return this.#totalAmount;
  }

  getUnitValue() {
    return this.#unitValue;
  }

  calculateProfit() {
    return this.#totalAmount * this.MarketPrice - this.#totalCost;
  }
}

var resources = csvParser("/res/resources.csv");
var smelterResources = csvParser("/res/smelter_resources.csv", true);
var loomResources = csvParser("/res/loom_resources.csv", true);
var tanneryResources = csvParser("/res/tannery_resources.csv", true);
var woodshopResources = csvParser("/res/woodshop_resources.csv", true);
var stonecuttingResources = csvParser("/res/stonecutting_resources.csv", true);
var arcanaResources = csvParser("/res/arcana_resources.csv", true);

var craftResources = smelterResources.concat(
  loomResources,
  tanneryResources,
  woodshopResources,
  stonecuttingResources,
  arcanaResources
);

craftResources.forEach((res) => res.calculateUnitValue());

function csvParser(filePath, craftable = false) {
  var csvText;
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", filePath, false);

  rawFile.onreadystatechange = function () {
    if (rawFile.readyState == 4)
      if (rawFile.status == 200 || rawFile.status == 0) {
        csvText = rawFile.responseText;
      }
  };

  rawFile.send(null);

  var csvLines = csvText.split("\r\n");
  var resources = [csvLines.length];

  for (let i = 1; i < csvLines.length; i++) {
    var data = csvLines[i].split(",");

    resources[i - 1] = resourceParser(data, craftable);
  }

  return resources;
}

function resourceParser(data, craftable) {
  var res = new Resource();

  res.Name = data[0];
  res.Id = data[1];
  res.MarketPrice = parseFloat(data[2]);
  res.ReturnRate = 0;
  res.IsCraftable = craftable;

  if (craftable) {
    for (let i = 3; i < data.length; i++) {
      var matData = data[i].split(":");
      var craftMat = new CraftMaterial();

      craftMat.Id = matData[0];
      craftMat.Amount = parseInt(matData[1]);

      res.CraftMaterials[i - 2] = craftMat;
    }
  }

  return res;
}

function searchResource(id) {
  var res = resources.find((r) => r.Id == id);
  if (res != undefined) return res;

  var craftResources = smelterResources.concat(
    loomResources,
    tanneryResources,
    woodshopResources,
    stonecuttingResources,
    arcanaResources
  );
  res = craftResources.find((r) => r.Id == id);
  if (res != undefined) return res;
}
