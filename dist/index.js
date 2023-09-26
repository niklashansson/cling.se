"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/jobylon.ts
  var state = {
    jobs: []
  };
  var jobylon = async function() {
    const parentElement = document.querySelector('[jobylon="parent"]');
    if (!parentElement)
      return;
    clear();
    await fetchJobs();
    const jobs = state.jobs.map((job) => generateMarkup(job));
    jobs.forEach((job) => parentElement.append(job));
    function clear() {
      parentElement.innerHTML = "";
    }
  };
  async function fetchJobs() {
    try {
      const req = await fetch(
        "https://feed.jobylon.com/feeds/30c8a5ca-e587-4158-8608-58050440d986/?format=json"
      );
      const data = await req.json();
      const jobs = data.map((job) => {
        const locationsStr = job.locations.map(({ location: location2 }) => {
          const { city, country } = location2;
          const str = `${city}, ${country}`;
          return str;
        }).join(" - ");
        return {
          title: job.title,
          function: job.function,
          url: job.urls.ad,
          locations: locationsStr
        };
      });
      state.jobs = [...jobs];
      if (!state.jobs)
        return;
    } catch (err) {
      console.error(err);
    }
  }
  function generateMarkup(job) {
    const markup = `<div class="career-work_job_wrapper"><div class="career-work_job_title">${job.title}</div><div class="career-work_job_divider"></div><div class="career-work_job_location">${job.locations}</div><div class="career-work_job_link-wrapper"><div class="career-work_job-function"><div class="career-work_job_button-icon w-embed"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <circle cx="8" cy="8" r="8" fill="white"></circle>
</svg></div><div class="text-color-white">${job.function}</div></div><a href="${job.url}" target="_blank" class="text-size-medium text-weight-xbold">read more</a></div></div>`;
    const parser = new DOMParser();
    const html = parser.parseFromString(markup, "text/html");
    const div = html.querySelector("div");
    return div;
  }

  // src/index.ts
  window.Webflow ||= [];
  window.Webflow.push(() => {
    jobylon();
  });
})();
//# sourceMappingURL=index.js.map
