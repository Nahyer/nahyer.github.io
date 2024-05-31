document.addEventListener('DOMContentLoaded', () => {
  let selectedTags = [];
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        renderJobListings(data);
        setupFiltering(data);
        
      });



  function renderJobListings(jobs) {
    const jobListings = document.getElementById('job-listings');
    jobListings.innerHTML = '';
  
    jobs.forEach(job => {
      const jobElement = document.createElement('div');
      jobElement.classList.add('job');
  
      const jobContent = `
      <div class="jitm">
      <img src="${job.logo}" alt="Job Image">
                <div class="position">
          <p>${job.company}</p>
          <h2>${job.position}</h2>
          <p>${job.postedAt} . ${job.contract} . ${job.location}</p>
      </div>

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
  
  function setupFiltering(jobs) {
    // if (selectedTags.length === 0) {
    //     renderJobListings(jobs);
    //     return;
    //   }

    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        selectedTags.push(tag);
        console.log(selectedTags.length)
      tag.addEventListener('click', () => {
        selectedTags.push(tag);
        console.log(selectedTags)
        const filter = tag.textContent;
        const filteredJobs = jobs.filter(job => 
          job.role === filter || 
          job.level === filter || 
          job.languages.includes(filter) || 
          job.tools.includes(filter)
        );
        renderJobListings(filteredJobs);
      });
    });
}
});