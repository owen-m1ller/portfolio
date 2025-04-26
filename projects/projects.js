import { fetchJSON, renderProjects, renderProjectTitle } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const projectTitleContainer = document.querySelector('.project-title');
renderProjectTitle('Projects', projectTitleContainer, 'h1');