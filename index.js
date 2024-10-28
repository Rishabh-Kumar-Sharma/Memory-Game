window.onload = () => generate();

const isValid = (n) => {
  if (isNaN(n)) throw new Error("Invalid input!");
};

var shuffle = (arr) => {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let arbInd = parseInt(Math.random() * (i + 1));
    [arr[i], arr[arbInd]] = [arr[arbInd], arr[i]];
  }
};

var generate = (m = 2) => {
  let arr = [];
  let n = m * m; // grid size will be m x m
  let x = n >> 1; // possible numbers will be from 1 to n/2, each will
  // be present twice
  for (let i = 1; i <= x; i++) {
    arr.push(i);
    arr.push(i);
  }

  shuffle(arr);
  fillGrid(arr, m);
};

var changeClass = (box, initialClass, finalClass) => {
  box.classList.remove(initialClass);
  if (finalClass != "") box.classList.add(finalClass);
};

var container = document.getElementById("grid-container");
var inp = document.querySelector(".btn-submit");
let counter = document.querySelector("#steps-count");
let parent = document.querySelector(".parent-container");
let inpt = document.querySelector("#inpt");

var c = 0;

var fillGrid = (arr, n) => {
  container.innerHTML = "";
  container.style.display = "grid";
  container.style.gridTemplateRows = `repeat(${n},auto)`;
  container.style.gridTemplateColumns = `repeat(${n},auto)`;
  container.style.aspectRatio = "1";
  container.style.flexGrow = "1";
  container.style.width = "auto";
  container.style.justifyItems = "center";
  container.style.alignItems = "center";

  let obj = {};
  let posObj = {};
  let selected = [];
  c = 0;

  for (let i = 0; i < n; i++) {
    let start = n * i;
    for (let j = start; j < start + n; j++) {
      if (!obj.hasOwnProperty(arr[j])) obj[arr[j]] = 0;
      if (!posObj.hasOwnProperty(arr[j])) posObj[arr[j]] = [];
      obj[arr[j]]++;
      let box = document.createElement("div");
      posObj[arr[j]].push(box);
      box.innerText = arr[j];
      box.style.display = "flex";
      box.style.alignItems = "center";
      box.style.justifyContent = "center";
      box.style.borderRadius = "10px";
      box.style.userSelect = "none";
      box.className = "box-initial";
      box.classList.add("box");
      box.style.aspectRatio = "1";
      // box.style.padding = "5px";
      box.style.width = "80%";

      box.addEventListener("click", () => {
        if (selected.length == 2 || selected.includes(box)) return;
        counter.innerText = ++c;
        changeClass(box, "box-initial", "box-click");
        selected.push(box);
        if (selected.length == 2) {
          if (
            parseInt(selected[0].innerText) != parseInt(selected[1].innerText)
          ) {
            setTimeout(() => {
              while (selected.length > 0) {
                let currSel = selected.pop();
                changeClass(currSel, "box-click", "box-initial");
              }
            }, 2000);
          } else {
            selected.forEach((box) => {
              changeClass(box, "box-click", "box-correct");
            });
            delete obj[selected.pop().innerText];
            selected = [];
          }
          // player wins
          if (Object.keys(obj).length <= 1) {
            for (let key in obj) {
              posObj[key].forEach((box) => {
                changeClass(box, "box-click", "box-correct");
              });
              changeClass(
                document.querySelector(".winner-section"),
                "d-none",
                ""
              );
            }
          }
        }
      });
      container.appendChild(box);
    }
  }
};

var resetGame = () => {
  inpt.value = 2;
  generate();
  counter.innerText = c = 0;
  document.querySelector(".winner-section").classList.add("d-none");
};

inp.addEventListener("click", (e) => {
  document.querySelector(".winner-section").classList.add("d-none");
  counter.innerText = c = 0;
  let m = parseInt(inpt.value, 10);
  try {
    isValid(m);
    if (m < 2) m = inpt.value = 2;
    else if (m > 10) m = inpt.value = 10;
    else if ((m & 1) != 0) inpt.value = --m;
    generate(m);
  } catch (error) {
    inpt.value = 2;
    alert(error.message);
    container.innerHTML = "";
    generate();
  }
});

document.querySelector(".btn").addEventListener("click", () => {
  resetGame();
});
