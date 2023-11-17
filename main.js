//start main selects
let allFlagsPage = document.querySelector(".world-app .allFlags");
let filterByRigon = document.querySelectorAll(
  ".world-app .filters .filterRegion ul li"
);
let filterBySort = document.querySelectorAll(
  ".world-app .filters .filterSort ul li"
);
let iconSearch = document.querySelector(".world-app .filters .filterInput i");
let inputSearch = document.querySelector(
  ".world-app .filters .filterInput input"
);
let allFlagsDivs;
let FlagsDataToSaveIn = [];
let backBtn = document.querySelector(".world-app .backBtn");
let container = document.querySelector(".world-app .container");
let mnPage = document.querySelector(".world-app .main-page");

fetch(
  "https://restcountries.com/v3.1/all?fields=name,flags,capital,region,currencies,languages,population,subregion,tld,ccn3,cca3,borders"
)
  .then((resultFlags) => {
    return resultFlags.json();
  })
  .then((resultFlags) => {
    FlagsDataToSaveIn = resultFlags;
    createMainPageAllFlags();

    allFlagsDivs = document.querySelectorAll(".world-app .allFlags .flag");
  });

function createMainPageAllFlags() {
  allFlagsPage.innerHTML = "";
  for (let i = 0; i < FlagsDataToSaveIn.length; i++) {
    //create flag div
    let flagDiv = document.createElement("div");
    flagDiv.classList = "flag";
    flagDiv.dataset.id = i;
    //create img
    let imgFlag = document.createElement("img");
    imgFlag.src = FlagsDataToSaveIn[i].flags.png;
    imgFlag.alt = FlagsDataToSaveIn[i].flags.alt;
    //create info
    let infoFlag = document.createElement("div");
    infoFlag.classList = "info";
    //create h3
    let nameFlage = document.createElement("h3");
    nameFlage.textContent = FlagsDataToSaveIn[i].name.common;
    //create p region
    let regionFlag = document.createElement("p");
    regionFlag.textContent = "Region: " + FlagsDataToSaveIn[i].region;
    //create p capital
    let capitalFlag = document.createElement("p");
    capitalFlag.textContent = "Capital: " + FlagsDataToSaveIn[i].capital[0];
    //create p population
    let populationFlag = document.createElement("p");
    populationFlag.textContent =
      "Population: " + FlagsDataToSaveIn[i].population;
    //append childs in info flag
    infoFlag.append(nameFlage, regionFlag, capitalFlag, populationFlag);
    //append img, info
    flagDiv.append(imgFlag, infoFlag);
    //add Event Click Listerner to open flag page
    flagDiv.onclick = function () {
      createFlagPage(flagDiv.dataset.id);
    };
    //append in main div
    allFlagsPage.appendChild(flagDiv);
  }
}

filterByRigon.forEach((li) => {
  li.onclick = function () {
    allFlagsDivs.forEach((flag) => {
      if (flag.classList.contains("d-none")) flag.classList.remove("d-none");
    });
    if (this.textContent != "All") {
      allFlagsDivs.forEach((flag) => {
        if (FlagsDataToSaveIn[flag.dataset.id].region != this.textContent)
          flag.classList.add("d-none");
      });
    }
  };
});

filterBySort.forEach((li) => {
  li.onclick = function () {
    let sortByType = this.dataset.sortby;
    if (sortByType == "name") {
      FlagsDataToSaveIn.sort(helperSortName);
    } else if (sortByType == "nameRev") {
      FlagsDataToSaveIn.sort(helperSortName);
      FlagsDataToSaveIn.reverse();
    } else if (sortByType == "population") {
      FlagsDataToSaveIn.sort(helperSortPopulation);
    } else {
      FlagsDataToSaveIn.sort((a, b) => {
        let aLength = Object.values(a[sortByType]).length;
        let bLength = Object.values(b[sortByType]).length;
        return aLength < bLength ? 1 : aLength > bLength ? -1 : 0;
      });
    }
    createMainPageAllFlags();
    allFlagsDivs = document.querySelectorAll(".world-app .allFlags .flag");
  };
});

function helperSortName(a, b) {
  return a.name.common < b.name.common
    ? -1
    : a.name.common > b.name.common
    ? 1
    : 0;
}
function helperSortPopulation(a, b) {
  return a.population < b.population ? 1 : a.population > b.population ? -1 : 0;
}

iconSearch.onclick = function () {
  searchByNameForCountry();
};

inputSearch.onkeydown = function (e) {
  if (e.keyCode == 13) searchByNameForCountry();
};

function searchByNameForCountry() {
  //display all
  allFlagsDivs.forEach((flag) => {
    if (flag.classList.contains("d-none")) flag.classList.remove("d-none");
  });
  //search for name
  allFlagsDivs.forEach((flag) => {
    if (
      !FlagsDataToSaveIn[flag.dataset.id].name.common
        .toLowerCase()
        .includes(inputSearch.value.trim().toLowerCase())
    )
      flag.classList.add("d-none");
  });
  inputSearch.value = "";
}

function createFlagPage(flagId) {
  if (container.classList.contains("d-none"))
    container.classList.remove("d-none");
  if (!mnPage.classList.contains("d-none")) mnPage.classList.add("d-none");

  document.querySelector(".world-app .flag-page img").src =
    FlagsDataToSaveIn[flagId].flags.svg;
  document.querySelector(".world-app .flag-page img").alt =
    FlagsDataToSaveIn[flagId].flags.alt;
  document.querySelector(".world-app .flag-page h3").textContent =
    FlagsDataToSaveIn[flagId].name.common;
  let lisSpans = document.querySelectorAll(
    ".world-app .flag-page .flagInfo ul li  > span"
  );
  lisSpans[0].textContent =
    FlagsDataToSaveIn[flagId].name.official || "Unknown";
  lisSpans[1].textContent = FlagsDataToSaveIn[flagId].capital[0] || "Unknown";
  lisSpans[2].textContent = FlagsDataToSaveIn[flagId].region || "Unknown";
  lisSpans[3].textContent = FlagsDataToSaveIn[flagId].subregion || "Unknown";
  lisSpans[4].textContent = FlagsDataToSaveIn[flagId].population || "Unknown";
  lisSpans[5].textContent = FlagsDataToSaveIn[flagId].tld[0] || "Unknown";

  //create currencies
  let currenciesDiv = document.querySelector(
    ".world-app .flag-page .flagInfo .currency"
  );
  currenciesDiv.innerHTML = ""; //to tasfer it first time
  let currencyArr = Object.values(FlagsDataToSaveIn[flagId].currencies);
  for (let i = 0; i < currencyArr.length; i++) {
    let spn = document.createElement("span");
    spn.textContent = Object.values(currencyArr[i])[0];
    currenciesDiv.appendChild(spn);
  }
  //create languages
  let languagesDiv = document.querySelector(
    ".world-app .flag-page .flagInfo .languages"
  );
  languagesDiv.innerHTML = ""; //to tasfer it first time
  let languagesArr = Object.values(FlagsDataToSaveIn[flagId].languages);
  for (let i = 0; i < languagesArr.length; i++) {
    let spn = document.createElement("span");
    spn.textContent = languagesArr[i];
    languagesDiv.appendChild(spn);
  }
  //create Borders
  let bordersDiv = document.querySelector(
    ".world-app .flag-page .flagInfo .borders"
  );
  let borderArr = FlagsDataToSaveIn[flagId].borders;
  bordersDiv.innerHTML = ""; //to tasfer it first time
  if (borderArr.length == 0)
    bordersDiv.innerHTML = "No Borders! It's an Island!";
  for (let i = 0; i < borderArr.length; i++) {
    let spn = document.createElement("span");
    let flgId = (() => {
      for (let j = 0; j < FlagsDataToSaveIn.length; j++)
        if (FlagsDataToSaveIn[j].cca3 == borderArr[i]) return j;
    })();
    spn.textContent = FlagsDataToSaveIn[flgId].name.common;
    spn.dataset.id = flgId;
    bordersDiv.appendChild(spn);
    spn.onclick = function () {
      createFlagPage(flgId);
    };
  }
}

backBtn.onclick = function () {
  container.classList.add("d-none");
  mnPage.classList.remove("d-none");
};
