document.addEventListener('DOMContentLoaded', () => {
    let allJobs = [];
    let selectedTags = [];
  
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        allJobs = data;
        renderJobListings(allJobs);
        setupTagDropdown(allJobs);
      });
  
    const tagInput = document.getElementById('tag-input');
    const tagDropdown = document.getElementById('tag-dropdown');
  
    tagInput.addEventListener('click', () => {
      tagDropdown.classList.toggle('hidden');
    });
  
    tagDropdown.addEventListener('click', (event) => {
      if (event.target.classList.contains('tag-option')) {
        const tag = event.target.dataset.tag;
        if (!selectedTags.includes(tag)) {
          selectedTags.push(tag);
          renderSelectedTags();
          filterJobs();
        }
      }
    });
  
    document.addEventListener('click', (event) => {
      if (!tagInput.contains(event.target) && !tagDropdown.contains(event.target)) {
        tagDropdown.classList.add('hidden');
      }
    });
  
    function renderSelectedTags() {
      const tagList = document.createElement('div');
      tagList.classList.add('tag-list');
      selectedTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.classList.add('tag');
        tagElement.innerHTML = `${tag} <span class="remove-tag" data-tag="${tag}">&times;</span>`;
        tagList.appendChild(tagElement);
      });
      const filterContainer = document.getElementById('filter-container');
      filterContainer.innerHTML = '';
      filterContainer.appendChild(tagInput);
      filterContainer.appendChild(tagDropdown);
      filterContainer.appendChild(tagList);
  
      const removeTagButtons = document.querySelectorAll('.remove-tag');
      removeTagButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const tag = event.target.dataset.tag;
          selectedTags = selectedTags.filter(t => t !== tag);
          renderSelectedTags();
          filterJobs();
        });
      });
    }
  
    function setupTagDropdown(jobs) {
      const tags = new Set();
      jobs.forEach(job => {
        tags.add(job.role);
        tags.add(job.level);
        job.languages.forEach(lang => tags.add(lang));
        job.tools.forEach(tool => tags.add(tool));
      });
  
      tagDropdown.innerHTML = '';
      tags.forEach(tag => {
        const tagOption = document.createElement('div');
        tagOption.classList.add('tag-option');
        tagOption.dataset.tag = tag;
        tagOption.innerHTML = `${tag} <span>&times;</span>`;
        tagDropdown.appendChild(tagOption);
      });
    }
  
    function filterJobs() {
      if (selectedTags.length === 0) {
        renderJobListings(allJobs);
        return;
      }
  
      const filteredJobs = allJobs.filter(job => {
        const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
        return selectedTags.every(tag => jobTags.includes(tag));
      });
  
      renderJobListings(filteredJobs);
    }
  
    function renderJobListings(jobs) {
      const jobListings = document.getElementById('job-listings');
      jobListings.innerHTML = '';
  
      jobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.classList.add('job');
  
        const jobContent = `
          <div>
            <h2>${job.position}</h2>
            <p>${job.company} - ${job.postedAt} - ${job.contract} - ${job.location}</p>
            <div class="tags">
              <span class="tag">${job.role}</span>
              <span class="tag">${job.level}</span>
              ${job.languages.map(lang => `<span class="tag">${lang}</span>`).join('')}
              ${job.tools.map(tool => `<span class="tag">${tool}</span>`).join('')}
            </div>
          </div>
        `;
  
        jobElement.innerHTML = jobContent;
        jobListings.appendChild(jobElement);
      });
    }
  });
  