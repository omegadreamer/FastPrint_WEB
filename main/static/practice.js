import { WordListRus, WordListEng } from "./WordList.js"; //list of all words

// Const
const input_box = document.getElementById("InputBox");
const restart = document.getElementById("Restart");
const lenguage = document.getElementById("Lenguage");
const Words = document.getElementById("Words");
const Mistakes = document.getElementById("Mistakes");
const Time = document.getElementById("Time");
const CPM = document.getElementById("CPM");
const WPM = document.getElementById("WPM");

// Main variables
let text = "";
let words_count = 25;
let current_lenguage = 1;
let test_status = false;

// Stats
let mistakes = [[0],[0],[]];
let timer = 0;

// Lenguages from WordList.js
let lenguages = {
  0:{
    list: WordListRus,
    name: 'Rus'
  },
  1:{
    list: WordListEng,
    name: 'Eng'
  }
};

// Timer
setInterval(function() {
  if(test_status){
    setTimeout(timer += 1);
  }}, 1000);

// Random words from 'WordList' function
function GetRandomWords() {

  let cur_list = lenguages[String(current_lenguage)]['list']
  input_box.value = "";
  text = "";

  for (let i = 0; i < words_count; i++) {
    text += cur_list[Math.floor(Math.random() * cur_list.length)] + " ";
  }
  return text;
};

// Active words amount
document.getElementById("WordsCount").addEventListener("click", function(event) {
  if (words_count != event.target.innerHTML){
    words_count = event.target.innerHTML;
    Restart();
  };
});

// Lenguage Switch
lenguage.addEventListener('click', function(event) {
  if (current_lenguage != Object.keys(lenguages).length -1){
    current_lenguage += 1;
  }else{
    current_lenguage = 0;
  };

  lenguage.textContent = String(lenguages[String(current_lenguage)]['name']);
  Restart();
});

// Typing process
input_box.addEventListener('input', function(event) {
  test_status = true;
  let input_half = String(input_box.value);
  let words = "";

  // Go to Finish
  if(input_box.value == text.slice(0, text.length-1)){
    Words.innerHTML = '<correct>' + text + '</correct>';
    FinishTyping();
  }

  // Check correct/wrong half
  else if(text.slice(0, input_half.length) == input_box.value){
    words = String('<correct>' + text.slice(0, input_half.length) + '</correct>' + text.slice(input_half.length, text.length));
    Words.innerHTML = words;
  }else{
    let wrong_half = String(input_box.value);
    for (let i = 0; input_box.value[i] == text[i]; i++){wrong_half = wrong_half.replace(input_box.value[i], "")};
    words = String('<correct>' + text.slice(0, input_half.length - wrong_half.length)+ '</correct>' + '<false>' + wrong_half + '</false>' + text.slice(input_half.length - wrong_half.length, text.length));
    Words.innerHTML = words;
  }

  // Mistake counter
  if(Words.innerHTML.includes('<false>') & mistakes[0][0] == false){
    for (let i = 0; i<input_box.value.length ;i++){
      if (text[i] != input_box.value[i]){
        mistakes[2].push(i)
      };
    };
    mistakes[0][0] = true;
    mistakes[1][0] += 1;
  }else if(!(Words.innerHTML.includes('<false>'))){
    mistakes[0][0] = false;
  }
});

// Finish of typing
function FinishTyping() {

  // - CPM & WPM
  let correct_words = text.length - mistakes[1][0];
  CPM.innerHTML = 'CPM ' + correct_words / (timer/60);
  WPM.innerHTML = 'WPM ' + (correct_words / (timer/60)) / 5;
  Mistakes.innerHTML = "Mistakes " + mistakes[1][0];
  Time.innerHTML = "Time " + timer;
  
  // - Change text view
  mistakes[2] = [...new Set(mistakes[2])];  
  text = String(text).split('');
  for(let i = 0; i < mistakes[2].length; i++){
    text[mistakes[2][i]] = String('<false>' + text[mistakes[2][i]] + '</false>');
    Words.innerHTML = text.join("");
  };
};

// Restart
function Restart() {
  test_status = false;
  timer = 0;
  Words.innerHTML = GetRandomWords();
  mistakes = [[0],[0],[]];
}Restart();
restart.addEventListener('click', Restart);
