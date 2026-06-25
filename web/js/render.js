const statusLabels = {
  NEW: 'новая',
  IN_PROGRESS: 'в работе',
  CLOSED: 'закрыта',
};

function formatDate(value) {
  return new Date(value).toLocaleString('ru-RU');
}

function renderStats(stats) {
  document.querySelector('#totalCount').textContent = stats.total;
  document.querySelector('#newCount').textContent = stats.new;
  document.querySelector('#inProgressCount').textContent = stats.inProgress;
  document.querySelector('#closedCount').textContent = stats.closed;
}

function renderLeads(leads, selectedLeadId = null) {
  const leadsList = document.querySelector('#leadsList');
  const leadsCounter = document.querySelector('#leadsCounter');

  leadsCounter.textContent = leads.length;

  if (!leads.length) {
    leadsList.innerHTML = '<p class="empty-text">Заявок нет</p>';
    return;
  }

  leadsList.innerHTML = leads
    .map((lead) => {
      const isActive = Number(lead.id) === Number(selectedLeadId);

      return `
        <button class="lead-card ${isActive ? 'is-active' : ''}" data-lead-id="${lead.id}">
          <div class="lead-card__top">
            <span class="lead-card__title">#${lead.id} ${lead.name}</span>
            <span class="status status--${lead.status}">
              ${statusLabels[lead.status]}
            </span>
          </div>

          <p class="lead-card__service">${lead.service}</p>
        </button>
      `;
    })
    .join('');
}

function renderLeadDetail(lead) {
  const leadDetail = document.querySelector('#leadDetail');

  if (!lead) {
    leadDetail.innerHTML = '<p class="empty-text">Выберите заявку из списка</p>';
    return;
  }

  leadDetail.innerHTML = `
    <h2 class="detail-title">Заявка #${lead.id}</h2>

    <div class="detail-row">
      <span class="detail-label">Статус</span>
      <p class="detail-value">
        <span class="status status--${lead.status}">
          ${statusLabels[lead.status]}
        </span>
      </p>
    </div>

    <div class="detail-row">
      <span class="detail-label">Имя</span>
      <p class="detail-value">${lead.name}</p>
    </div>

    <div class="detail-row">
      <span class="detail-label">Телефон</span>
      <p class="detail-value">${lead.phone}</p>
    </div>

    <div class="detail-row">
      <span class="detail-label">Услуга</span>
      <p class="detail-value">${lead.service}</p>
    </div>

    <div class="detail-row">
      <span class="detail-label">Комментарий</span>
      <p class="detail-value">${lead.comment || '—'}</p>
    </div>

    <div class="detail-row">
      <span class="detail-label">Создана</span>
      <p class="detail-value">${formatDate(lead.createdAt)}</p>
    </div>

    <div class="detail-actions">
      <button class="button" data-change-status="IN_PROGRESS" data-lead-id="${lead.id}">
        В работу
      </button>

      <button class="button button--secondary" data-change-status="CLOSED" data-lead-id="${lead.id}">
        Закрыть
      </button>
    </div>
  `;
}

function renderError(message) {
  const leadsList = document.querySelector('#leadsList');

  leadsList.innerHTML = `
    <p class="error-text">${message}</p>
  `;
}