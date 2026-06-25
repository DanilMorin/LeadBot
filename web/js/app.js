let selectedStatus = '';
let selectedLeadId = null;
let currentLeads = [];

async function loadDashboard() {
  try {
    const [stats, leads] = await Promise.all([
      getStats(),
      getLeads(selectedStatus),
    ]);

    currentLeads = leads;

    renderStats(stats);
    renderLeads(leads, selectedLeadId);

    const selectedLead = leads.find((lead) => Number(lead.id) === Number(selectedLeadId));
    renderLeadDetail(selectedLead || null);
  } catch (error) {
    renderError(error.message);
  }
}

async function selectLead(leadId) {
  try {
    selectedLeadId = leadId;

    renderLeads(currentLeads, selectedLeadId);

    const lead = await getLeadById(leadId);
    renderLeadDetail(lead);
  } catch (error) {
    renderError(error.message);
  }
}

async function changeLeadStatus(leadId, status) {
  try {
    const updatedLead = await updateLeadStatus(leadId, status);

    selectedLeadId = updatedLead.id;
    await loadDashboard();
  } catch (error) {
    renderError(error.message);
  }
}

function setActiveFilter(button) {
  document.querySelectorAll('.filter-button').forEach((filterButton) => {
    filterButton.classList.remove('is-active');
  });

  button.classList.add('is-active');
}

document.querySelector('#refreshButton').addEventListener('click', () => {
  loadDashboard();
});

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    selectedStatus = button.dataset.status || '';
    selectedLeadId = null;

    setActiveFilter(button);
    loadDashboard();
  });
});

document.querySelector('#leadsList').addEventListener('click', (event) => {
  const leadCard = event.target.closest('[data-lead-id]');

  if (!leadCard) {
    return;
  }

  selectLead(leadCard.dataset.leadId);
});

document.querySelector('#leadDetail').addEventListener('click', (event) => {
  const statusButton = event.target.closest('[data-change-status]');

  if (!statusButton) {
    return;
  }

  changeLeadStatus(statusButton.dataset.leadId, statusButton.dataset.changeStatus);
});

loadDashboard();
