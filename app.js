const app = document.querySelector("#app"),
      side = document.querySelector("#side"),
      search = document.querySelector("#search"),
      theme = document.querySelector("#theme");

let items = JSON.parse(localStorage.getItem("badhanItems") || "[]");
let currentPage = "home";


if (localStorage.theme === "dark") {
  document.body.classList.add("dark");
  theme.textContent = "☀️";
}


document.querySelector("#menu").onclick = () =>
  side.classList.toggle("open");


theme.onclick = () => {
  document.body.classList.toggle("dark");

  let d = document.body.classList.contains("dark");

  localStorage.theme = d ? "dark" : "light";
  theme.textContent = d ? "☀️" : "🌙";
};


document.querySelectorAll("[data-p]").forEach(x =>
  x.onclick = () => page(x.dataset.p)
);


search.oninput = () =>
  renderMediaPage(currentPage, search.value);


function page(p) {
  side.classList.remove("open");

  currentPage = p;
  search.value = "";

  if (p === "home")
    home();

  else if (p === "videos" || p === "files")
    renderMediaPage(p);

  else if (p === "profile")
    profile();

  else if (p === "settings")
    settings();

  else if (p === "admin")
    admin();
}


function esc(x) {
  return String(x ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[c])
  );
}


function card(x) {
  let c = document.createElement("div");

  c.className = "card media";

  if (x.type.startsWith("video/")) {
    c.innerHTML = `
      <video controls src="${x.data}"></video>
      <div class="name">${esc(x.name)}</div>
    `;
  } else {
    c.innerHTML = `
      <div style="font-size:50px">📄</div>
      <div class="name">${esc(x.name)}</div>
      <p class="muted">${bytes(x.size || 0)}</p>
    `;
  }

  let b = document.createElement("button");

  b.className = "btn";
  b.textContent = "Download";

  b.onclick = () =>
    downloadData(x.data, x.name);

  c.appendChild(b);

  return c;
}


function renderMediaPage(type, q = "") {
  let isVideo = type === "videos";
  let title = isVideo ? "Videos" : "Files";
  let icon = isVideo ? "🎬" : "📁";

  let a = items
    .filter(
      x =>
        isVideo
          ? x.type.startsWith("video/")
          : !x.type.startsWith("video/")
    )
    .filter(
      x =>
        x.name
          .toLowerCase()
          .includes(q.toLowerCase())
    );

  app.innerHTML = `
    <div class="card">
      <h1>${icon} ${title}</h1>
      <p class="muted">
        ${
          isVideo
            ? "All uploaded videos are shown here."
            : "All uploaded files are shown here."
        }
      </p>
    </div>

    <div id="grid" class="grid"></div>
  `;

  let g = document.querySelector("#grid");

  if (!a.length) {
    g.innerHTML = `
      <div class="card">
        No ${title.toLowerCase()} found.
      </div>
    `;

    return;
  }

  a.forEach(x =>
    g.appendChild(card(x))
  );
}


function home() {
  let videos = items.filter(
    x => x.type.startsWith("video/")
  ).length;

  let files = items.length - videos;

  app.innerHTML = `
    <div class="card1">
      <h1 id="hm-btn">🏠 Home</h1>
      <p class="muted">
        WELCOME TO BR HACKER SITE
      </p>
    </div>

    <div class="grid">

      <div class="card2">
        <h2>🎬 Videos</h2>
        <p>${videos} video(s)</p>
        <br>
        <button
          class="btn1"
          onclick="page('videos')"
        >
          Open Videos
        </button>
      </div>

      <div class="card3">
        <h2>📁 Files</h2>
        <p>${files} file(s)</p>
        <br>
        <button
          class="btn2"
          onclick="page('files')"
        >
          Open Files
        </button>
      </div>

    </div>
  `;
}


function profile() {
  let p = localStorage.profile || "";

  app.innerHTML = `
    <div class="card">
      <h1>👤 Profile</h1>

      ${
        p
          ? `<img class="avatar" src="${p}">`
          : `<div style="font-size:80px">👤</div>`
      }

      <h3>Profile picture</h3>

      <input
        id="pic"
        type="file"
        accept="image/*"
      >
    </div>
  `;

  document.querySelector("#pic").onchange = e => {
    let f = e.target.files[0];

    if (!f)
      return;

    let r = new FileReader();

    r.onload = () => {
      localStorage.profile = r.result;
      profile();
    };

    r.readAsDataURL(f);
  };
}


function settings() {
  app.innerHTML = `
    <div class="card">

      <h1>⚙ Settings</h1>

      <button
        id="m"
        class="btn"
      >
        🌙 Dark / ☀️ Light Mode
      </button>

      <h3>Language</h3>

      <select id="lang">
        <option value="en">English</option>
        <option value="bn">বাংলা</option>
        <option value="hi">हिन्दी</option>
      </select>

    </div>
  `;

  document.querySelector("#m").onclick = () =>
    theme.click();

  let l = document.querySelector("#lang");

  l.value = localStorage.lang || "en";

  l.onchange = () =>
    localStorage.lang = l.value;
}


function admin() {
  app.innerHTML = `
    <div class="card">

      <h1>🔒 Admin Panel</h1>

      <input
        id="pass"
        type="password"
        placeholder="Admin password"
      >

      <button
        id="unlock"
        class="btn3"
      >
        Unlock
      </button>

      <p id="msg"></p>

    </div>
  `;

  document.querySelector("#unlock").onclick = () =>
    document.querySelector("#pass").value === "BADHAN HACKER"
      ? dashboard()
      : document.querySelector("#msg").textContent =
          "Wrong password.";
}


function dashboard() {
  app.innerHTML = `
    <div class="card">

      <h1>🔒 Admin Panel</h1>

      <h2>Upload Video / File</h2>

      <select id="kind">
        <option value="video">Video</option>
        <option value="file">File</option>
      </select>

      <input
        id="file"
        type="file"
      >

      <button
        id="up"
        class="btn"
      >
        Upload
      </button>

      <p id="msg"></p>

    </div>

    <div class="card">

      <h2>Manage Uploads</h2>

      <div id="list"></div>

    </div>
  `;

  let list = document.querySelector("#list");

  if (!items.length)
    list.innerHTML =
      "<p class='muted'>No uploads yet.</p>";

  items.forEach((x, i) => {
    let d = document.createElement("div");

    d.className = "admin-row";

    d.innerHTML = `
      <span style="flex:1">
        ${
          x.type.startsWith("video/")
            ? "🎬"
            : "📁"
        }
        ${esc(x.name)}
      </span>

      <button class="btn red">
        Delete
      </button>
    `;

    d.querySelector("button").onclick = () => {
      items.splice(i, 1);
      save();
      dashboard();
    };

    list.appendChild(d);
  });


  document.querySelector("#up").onclick = () => {
    let f =
      document.querySelector("#file").files[0];

    let k =
      document.querySelector("#kind").value;

    let msg =
      document.querySelector("#msg");


    if (!f)
      return msg.textContent =
        "Select a file.";


    if (
      k === "video" &&
      !f.type.startsWith("video/")
    )
      return msg.textContent =
        "Please select a video.";


    if (
      k === "file" &&
      f.type.startsWith("video/")
    )
      return msg.textContent =
        "For videos, select Video.";


    let r = new FileReader();


    r.onload = () => {
      items.unshift({
        name: f.name,
        type: f.type,
        size: f.size,
        data: r.result
      });

      try {
        save();
        dashboard();
      } catch (e) {
        msg.textContent =
          "Browser storage is full. Try a smaller file/video.";
      }
    };


    r.readAsDataURL(f);
  };
}


function save() {
  localStorage.setItem(
    "badhanItems",
    JSON.stringify(items)
  );
}


function downloadData(data, name) {
  let a = document.createElement("a");

  a.href = data;
  a.download = name;

  document.body.appendChild(a);

  a.click();

  a.remove();
}


function bytes(n) {
  return n < 1024
    ? n + " B"
    : n < 1048576
      ? (n / 1024).toFixed(1) + " KB"
      : (n / 1048576).toFixed(1) + " MB";
}


page("home");
