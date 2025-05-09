console.log("it's alive!");

function $$(selector, context=document) {
    return Array.from(context.querySelectorAll(selector))
}

// step 2
// let navLinks = $$("nav a");
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// );
// currentLink?.classList.add("current");

// step 3
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: "https://github.com/owen-m1ller", title: "My GitHub" },
    { url: 'meta/', title: 'Meta' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/portfolio/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    if (a.host != location.host) {
        a.target = "_blank"
    }
    nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select>
              <option value="light dark">Automatic</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
          </select>
      </label>`,
);

let select = document.querySelector("select")
select.addEventListener('input', function (event) {
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
});

if (localStorage.colorScheme) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
}

// Lab 4

export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }   catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}


export function renderProjects(project, containerElement, headingLevel='h2') {
    // Your code will go here
    containerElement.innerHTML = '';
    for (let proj of project) {
        console.log(proj)
        const article = document.createElement('article');
        article.innerHTML = `
            <${headingLevel}>${proj?.title}</${headingLevel}>
            <img src="${proj?.image}" alt="${proj?.title}">
            <p>${proj?.description}</p>
        `;
        containerElement.appendChild(article);
    }
}

export function renderProjectTitle(title, containerElement, headingLevel='h1') {
    containerElement.innerHTML = '';
    const numProjects = $$('.projects > article').length;
    const header = document.createElement(`${headingLevel}`);
    header.innerHTML = numProjects + ' ' + title;
    containerElement.appendChild(header);
}

export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}


