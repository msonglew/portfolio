console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
};

// NAV BAR

let pages = [
    { url: '', title: 'Home'},
    { url: 'contact/', title:'Contact'},
    { url: 'projects/', title:'Projects'},
    { url: 'resume/', title:'Resume'},
    { url: 'https://github.com/msonglew', title:'GitHub'},
]

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
? "/"                  // Local server
: "/portfolio/";         // GitHub Pages repo name

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    if (!url.startsWith('http')) {
        url = BASE_PATH + url;
    };

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    };

    if (a.host !== location.host) {
        a.target = "_blank";
    };

};

// THEME MODE DROP DOWN

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

const select = document.querySelector(".color-scheme select");
select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);

    localStorage.colorScheme = event.target.value;
});

if (localStorage.colorScheme) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
};

// PROJECTS

export async function fetchJSON(url) {
    try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      };
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
    };
};

export function renderProjects(project, containerElement, headingLevel = 'h2') {
    // write javascript that will allow dynamic heading levels based on previous function
    // project is html element containing all projects
    // containerElement is html element with class '.projects'

    containerElement.innerHTML = '';
    for (let proj of project) {
        const article = document.createElement('article');
        const heading = document.createElement(headingLevel);
        heading.textContent = proj.title;

        const img = document.createElement('img');
        img.src = proj.image;
        img.alt = proj.title;

        const description = document.createElement('p');
        description.textContent = proj.description;

        article.appendChild(heading);
        article.appendChild(img);
        article.appendChild(description);

        containerElement.appendChild(article);
    };
    return containerElement
};

// 

export function fetchGithubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
};

