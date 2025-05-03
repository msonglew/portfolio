import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// display projects
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// title with number of projects
let num_projects = projects.length.toString();
let heading = document.querySelector('.projects-title').textContent;
document.querySelector('.projects-title').innerHTML = num_projects + ' ' + heading;

// pie chart
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {

    // re-calculate rolled data
    let newRolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year,
    );

    // re-calculate data
    let newData = newRolledData.map(([year, count]) => {
      return { value: count, label: year };
    });

    // re-calculate slice generator, arc data, arc, etc.
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));

    // clear up paths and legends
    d3.select('svg').selectAll('path').remove();
    d3.select('.legend').selectAll('li').remove();

    // update paths and legends
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    // highlight selected wedge
    let selectedIndex = -1;

    let svg = d3.select('svg');
    let legend = d3.select('.legend');

    newArcs.forEach((arc, indx) => {
        
        // fill in step for appending path to svg using D3
        svg
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(indx))
            .on('click', () => {
                selectedIndex = selectedIndex === indx ? -1 : indx;
        
                svg
                  .selectAll('path')
                  .attr('class', (_, idx) => (
                    // filter idx to find correct pie slice and apply CSS from above
                    idx === selectedIndex ? 'selected' : ''
                ));
        
                legend
                  .selectAll('li')
                  .attr('class', (_, idx) => (
                    // filter idx to find correct legend and apply CSS from above
                    idx === selectedIndex ? 'selected' : ''
                ));

                if (selectedIndex === -1) {
                    renderProjects(projectsGiven, projectsContainer, 'h2'); // BUG WAS HERE
                } else {
                    // filter projects and project them onto webpage
                    const selectedLabel = newData[selectedIndex].label;
                    const filtered = projectsGiven.filter(p => p.year === selectedLabel); // BUG WAS HERE
                    console.log(filtered);
                    renderProjects(filtered, projectsContainer, 'h2');
                };

                console.log(selectedIndex);
            });
    });

    newData.forEach((d, idx) => {
        legend
        .append('li')
        .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    });

    
}
  
// Call this function on page load
renderPieChart(projects);

// search field
let query = '';

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    console.log(filteredProjects)
    // re-render legends and pie chart when event triggers
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});