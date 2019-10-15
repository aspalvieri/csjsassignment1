const AVATAR_URL = 'https://avatars1.githubusercontent.com/u/7874705?v=4';
const main = document.querySelector('main');
const textarea = document.querySelector('textarea');
const tweetBtn = document.querySelector('form');
const myAvatar = [...document.querySelectorAll('.my_avatar')];
myAvatar.forEach(img => img.src = AVATAR_URL);
const imgGifPoll = document.querySelector('#imgGifPoll');
const pollBtn = document.querySelector('#pollbtn');
const searchGifBtn = document.querySelector('#searchGifBtn');
const searchGif = document.querySelector('#searchGif');
const browseGif = document.querySelector("#browsegifs");
let switchgifsbutton = document.querySelector("#switchGif");
const emojibtn = document.querySelector('#emojibtn');
const emojimodalbody = document.querySelector('#emojimodalbody');
const searchEmoji = document.querySelector('#searchEmoji');
const emojiCategories = document.querySelector('#emojiCategories');

let emojis = [];
let prevSearch = "";


const tweets = JSON.parse(localStorage.getItem('twitter')) || [];
let gifs = [];

function render() {
  remember();

  main.innerHTML = tweets.map((tweet, idx) => {
    
    return `
        <aside>
         <div>
            <img class="avatar" src="${tweet.avatar}">
         </div>
         <div class="formatted-tweet">
            <h6><a href="https://twitter.com/${tweet.username}">${tweet.name}</a> <span class="username">@${tweet.username}</span></h6>
            <p>${tweet.tweet}</p>
            <div class="imgGifPoll">
              ${tweet.isPollCreated ? displayVotes(tweet, idx) : tweet.img}
            </div>
            <div>
                <section>
                    <div id="reactions" class="btn-group mr-2">
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-message-outline"
                            aria-label="reply"
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-twitter-retweet"
                            aria-label="retweet"
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-heart-outline"
                            aria-label="like"
                            style=""
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-upload"
                            aria-label="share"
                        ></button>
                    </div>
                </section>
            </div>
        </div>
        </aside>
          `;
  }).join('');
}

function remember() {
  // store our current tweets array in localstorage
  // but remove last memory of it first
  localStorage.removeItem('twitter');

  // remember tweets array
  localStorage.setItem('twitter', JSON.stringify(tweets))
}

//---------------- Al's Poll Code {

function votesToPercentages(votes) {
  const total = votes.a + votes.b + votes.c + votes.d;

  return {
    a: Math.floor((votes.a / total) * 100),
    b: Math.floor((votes.b / total) * 100),
    c: Math.floor((votes.c / total) * 100),
    d: Math.floor((votes.d / total) * 100),
    total
  }

}

function displayVotes(tweet, idx) {
  const percents = votesToPercentages(tweets[idx].pollResults)  // {a: 33, b: 20, ,,,, total: 133}
  const letterChosen = tweets[idx].pollResults.youChose; // a b c d 

  if (tweet.isPollDone) {
    return `
    <div class="bargraph">
    <div id="bar1" class="bar" style="flex-basis: ${
      percents.a
    }%" data-vote="a">${tweets[idx].voteOptions.a} ${
    letterChosen == "a" ? "&check;" : ""
  }</div>
    <div id="percentage1">${percents.a}%</div>
  </div>
  <div class="bargraph">
    <div id="bar2" class="bar" style="flex-basis: ${
      percents.b
    }%" data-vote="b">${tweets[idx].voteOptions.b} ${
    letterChosen == "b" ? "&check;" : ""
  }</div>
    <div id="percentage2">${percents.b}%</div>
  </div>
  <div class="bargraph">
    <div id="bar3" class="bar" style="flex-basis: ${
      percents.c
    }%" data-vote="c">${tweets[idx].voteOptions.c} ${
    letterChosen == "c" ? "&check;" : ""
  }</div>
  <div id="percentage3">${percents.c}%</div>
  </div>
  <div class="bargraph">
    <div id="bar4" class="bar" style="flex-basis: ${
      percents.d
    }%" data-vote="d">${tweets[idx].voteOptions.d} ${
    letterChosen == "d" ? "&check;" : ""
  }</div>
  <div id="percentage4">${percents.d}%</div>
  </div>
  <div id="totalVotes">${percents.total} votes</div>    
    `
  }
  return `
  <div class="poll flex-col" data-idx="${idx}">
     <button class="vote" value="a">${tweet.voteOptions.a}</button>
     <button class="vote" value="b">${tweet.voteOptions.b}</button>
     <button class="vote" value="c">${tweet.voteOptions.c}</button>
     <button class="vote" value="d">${tweet.voteOptions.d}</button>
  </div>
  `
}


function insertPoll() {
  // todo: disable the tweet button until all fields plus a question is inserted
  textarea.placeholder = 'Ask a question...';

  imgGifPoll.innerHTML = `
                <form>
                  <div class="form-group">
                    <input type="text" class="form-control" id="pollchoice1" aria-describedby="" maxlength="25" placeholder="Choice 1">
                    <br>
                    <input type="text" class="form-control" id="pollchoice2" aria-describedby="" maxlength="25" placeholder="Choice 2">
                    <br>
                    <input type="text" class="form-control" id="pollchoice3" aria-describedby="" maxlength="25" placeholder="Choice 3">
                    <br>
                    <input type="text" class="form-control" id="pollchoice4" aria-describedby="" maxlength="25" placeholder="Choice 4">
                    <br><br>
                    <h6>Poll length</h6>
                    <hr style="margin:0">
                    <div class="row">
                      <div class="col">
                        <label for="polldays">Days</label>
                        <select class="form-control" id="polldays">
                          <option>0</option>
                          <option selected>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div class="col">
                        <label for="pollhours">Hours</label>
                        <select class="form-control" id="pollhours">
                          <option>0</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div class="col">
                        <label for="pollminutes">Minutes</label>
                        <select class="form-control" id="pollminutes">
                          <option>0</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>                        
                    </div>
                  </div>
                </form>

  `;
}

async function vote(e) {
  if (!e.target.matches('.vote')) {
    return;
  }

  // find data-idx's value so we know which element in tweets array to change
  const index = e.target.closest('.poll').dataset.idx;

  const res = await fetch('https://my.api.mockaroo.com/votes.json?key=2d95a440')
  const data = await res.json(); // {"a":"05-658-6533","b":"60-026-8075","c":"89-841-5434","d":"65-564-0648"}
  const keyValues = Object.entries(data); // [["a","05-658-6533"], ...]
  const newKeyValues = keyValues.map(keyValArr => [keyValArr[0], parseInt(keyValArr[1].slice(-2), 10)]) // [["a",33], ...]

  // push JSON results into our tweets array
  tweets[index].pollResults = Object.fromEntries(newKeyValues) // {"a":33], ...}
  tweets[index].pollResults.youChose = e.target.value // a b c d
  tweets[index].isPollDone = true;

  render();
}


//---------------- } Al's Poll Code


function tweeting(e) {
  e.preventDefault();
  
  const voteOptions = {
    a: imgGifPoll.querySelector('#pollchoice1') ? imgGifPoll.querySelector('#pollchoice1').value : '',
    b: imgGifPoll.querySelector('#pollchoice2') ? imgGifPoll.querySelector('#pollchoice2').value : '',
    c: imgGifPoll.querySelector('#pollchoice3') ? imgGifPoll.querySelector('#pollchoice3').value : '',
    d: imgGifPoll.querySelector('#pollchoice4') ? imgGifPoll.querySelector('#pollchoice4').value : '',
  }

  if (textarea.value || imgGifPoll.innerHTML) {
    // store tweet text in tweets object
    tweets.unshift({
      avatar: AVATAR_URL,
      name: 'Albert V.',
      username: 'avcoder',
      tweet: textarea.value || "",
      img: imgGifPoll.innerHTML,
      video: '',
      isPollCreated: !!(voteOptions.a && voteOptions.b && voteOptions.c && voteOptions.d),
      voteOptions,
      pollResults: {},
      isPollDone: false
    });

  }

  // clear textbox and any image
  textarea.value = '';
  imgGifPoll.innerHTML = '';

  render();
}

// if user selects the image icon in order to insert an image from their comptuer
function handleFileSelect(evt) {
  const reader = new FileReader();

  reader.addEventListener('load', (e) => {
    imgGifPoll.innerHTML = `<img class="thumb" src="${e.target.result}" style="width: 100%"/>`;
  });

  // Read in the image file as a data URL.
  reader.readAsDataURL(evt.target.files[0]);
}

function fetchGifs(e) {
  e.preventDefault();
  gifs = [];
  // https://api.jsonbin.io/b/5d5bfa9b6343515e9d146880
  const API_KEY = 'WaRBjHgAeeiyBrV0xsR52nwAfIHAZuZ4';
  // http://api.giphy.com/v1/gifs/search?api_key=URSRgSXuGgvVg6LKFDlUsp0bWM80ansC&q=happy
  fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchGif.value}`)
    .then(res => res.json())
    .then((data) => {
      // unhide switch to toggle gif animations
      switchgifsarea.classList.remove('hide');
      data.data.forEach(gif => gifs.push({
        image_small_still: gif.images.fixed_height_small_still.url,
        image_small: gif.images.fixed_height_small.url,
        image_original: gif.images.original.url,
        image_original_mp4: gif.images.original_mp4.mp4
      }));
    })
    .then(() => browseGif.innerHTML = gifs.map((gif,i) => `<img data-index=${i} src="${switchgifsbutton.dataset.toggled == "false" ? gif.image_small_still : gif.image_small}"/>`).join(""));
}

function handleGifSelect(e) {
  e.preventDefault();
  if (e.target.matches("img")) {
    imgGifPoll.innerHTML = `<video controls><source class="thumb" src="${gifs[e.target.dataset.index].image_original_mp4}" type="video/mp4" style="width: 100%"/></video>`;
    $("#insertgif").modal("hide");
    gifs = [];
    browseGif.innerHTML = "";
    searchGif.value = "";
  }
}

function toggleStill(e) {
  if (gifs.length > 0) {
    if (switchgifsbutton.dataset.toggled == "false") {
      switchgifsbutton.dataset.toggled = "true";
      browseGif.querySelectorAll("img").forEach(gif => {
        gif.src = gifs[gif.dataset.index].image_small;
      });
    }
    else if (switchgifsbutton.dataset.toggled == "true") {
      switchgifsbutton.dataset.toggled = "false";
      browseGif.querySelectorAll("img").forEach(gif => {
        gif.src = gifs[gif.dataset.index].image_small_still;
      });
    }
  }
}


async function browseEmoji(e) {
  await fetch("https://unpkg.com/emoji.json@12.1.0/emoji.json")
      .then(res => res.json())
      .then(data => emojis = data);
  emojimodalbody.innerHTML = emojis.map(emoji => `<div class="emoji">${emoji.char}</div>`).join("");
}

function searchEmojis(e) {
  e.preventDefault();
  emojimodalbody.innerHTML = emojis.filter(emoji => emoji.name.includes(searchEmoji.value)).map(emoji => `<div class="emoji">${emoji.char}</div>`).join("");
}

function searchCategories(e) {
  if (e.target.matches("img") && prevSearch != e.target.dataset.category) {
      prevSearch = e.target.dataset.category;
      emojimodalbody.scrollTop = 0;
      emojimodalbody.innerHTML = emojis.filter(emoji => emoji.category.includes(e.target.dataset.category)).map(emoji => `<div class="emoji">${emoji.char}</div>`).join("");
  }
  else if (prevSearch == e.target.dataset.category) {
      prevSearch = "";
      emojimodalbody.scrollTop = 0;
      emojimodalbody.innerHTML = emojis.map(emoji => `<div class="emoji">${emoji.char}</div>`).join("");
  }
}

function clickEmoji(e) {
  if (e.target.matches("div.emoji")) {
      textarea.value += e.target.innerHTML;
  }
}

emojibtn.addEventListener("click", browseEmoji);
searchEmoji.addEventListener("keyup", searchEmojis);
emojiCategories.addEventListener("click", searchCategories);
emojimodalbody.addEventListener("click", clickEmoji);
tweetBtn.addEventListener('submit', tweeting);
pollBtn.addEventListener('click', insertPoll);
main.addEventListener('click', vote)
browseGif.addEventListener("click", handleGifSelect);
document.querySelector('#uploadPic').addEventListener('change', handleFileSelect, false);
searchGifBtn.addEventListener('click', fetchGifs);
switchgifsbutton.addEventListener("click", toggleStill);
searchGif.addEventListener("keypress", e => {if (e.keyCode == 13) e.preventDefault();}); //Prevents user from hitting 'enter' on input box and refreshing page

render();

