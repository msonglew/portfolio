import { fetchJSON, renderProjects } from '../global.js';

// display projects
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// title with number of projects
let num_projects = projects.length.toString();
let heading = document.querySelector('.projects-title').textContent;
document.querySelector('.projects-title').innerHTML = num_projects + ' ' + heading;
