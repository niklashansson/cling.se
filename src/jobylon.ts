const state = {
  jobs: [],
};

export const jobylon = async function () {
  const parentElement = document.querySelector('[jobylon="parent"]');
  if (!parentElement) return;

  clear();
  await fetchJobs();
  const jobs = state.jobs.map((job) => generateMarkup(job));
  jobs.forEach((job) => parentElement.append(job));

  function clear() {
    parentElement.innerHTML = '';
  }
};

async function fetchJobs() {
  try {
    const req = await fetch(
      'https://feed.jobylon.com/feeds/30c8a5ca-e587-4158-8608-58050440d986/?format=json'
    );
    const data = await req.json();

    const jobs = data.map((job) => {
      return {
        title: job.title,
        descr: job.descr,
        url: job.urls.ad,
        location: job.location,
      };
    });

    state.jobs = [...jobs];
    if (!state.jobs) return;
  } catch (err) {
    console.log(err);
  }
}

function generateMarkup(job) {
  const markup = `<div class="career-work_job_wrapper"><div class="career-work_job_title">${job.title}</div><div class="career-work_job_divider"></div><div class="career-work_job_location">${job.descr}</div><div class="career-work_job_link-wrapper"><a href="${job.url}" target="_blank" class="button w-inline-block"><div class="career-work_job_link-text">Read more</div></a></div></div>`;

  const parser = new DOMParser();
  const html = parser.parseFromString(markup, 'text/html');

  const div = html.querySelector('div');

  return div;
}
