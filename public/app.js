const API = '/api';

const resourceConfig = {
  movies: {
    tableId: 'movies-table',
    row(item) {
      return [
        item.title,
        item.year,
        item.director,
        (item.genres || []).join(', '),
        item.rating,
        `<button class="btn btn-sm btn-danger" data-id="${item._id}">Delete</button>`
      ];
    },
    body(resource, formData) {
      return {
        title: formData.get('title'),
        year: Number(formData.get('year')),
        director: formData.get('director'),
        genres: splitList(formData.get('genres')),
        cast: splitList(formData.get('cast')),
        runtime: formData.get('runtime') ? Number(formData.get('runtime')) : undefined,
        rating: formData.get('rating') ? Number(formData.get('rating')) : undefined
      };
    }
  },
  reviews: {
    tableId: 'reviews-table',
    row(item) {
      const movie = item.movie_id;
      return [
        movie && typeof movie === 'object' ? movie.title : movie,
        item.user,
        item.rating,
        item.comment || '',
        `<button class="btn btn-sm btn-danger" data-id="${item._id}">Delete</button>`
      ];
    },
    body(resource, formData) {
      return {
        movie_id: formData.get('movie_id'),
        user: formData.get('user'),
        rating: Number(formData.get('rating')),
        comment: formData.get('comment')
      };
    }
  },
  actors: {
    tableId: 'actors-table',
    row(item) {
      return [
        item.name,
        item.birth_year,
        item.nationality,
        `<button class="btn btn-sm btn-danger" data-id="${item._id}">Delete</button>`
      ];
    },
    body(resource, formData) {
      return {
        name: formData.get('name'),
        birth_year: formData.get('birth_year') ? Number(formData.get('birth_year')) : undefined,
        nationality: formData.get('nationality')
      };
    }
  }
};

function splitList(value) {
  return value ? value.split(',').map((s) => s.trim()).filter(Boolean) : [];
}

function showStatus(message, type = 'info') {
  const el = document.getElementById('status');
  el.textContent = message;
  el.className = `alert alert-${type}`;
  el.classList.remove('d-none');
  setTimeout(() => el.classList.add('d-none'), 4000);
}

async function load(resource) {
  const res = await fetch(`${API}/${resource}`);
  if (!res.ok) throw new Error(`${resource} load failed: ${res.status}`);
  const { data } = await res.json();
  renderTable(resource, data);
  if (resource === 'movies') populateMovieSelects(data);
}

function renderTable(resource, items) {
  const cfg = resourceConfig[resource];
  const tbody = document.querySelector(`#${cfg.tableId} tbody`);
  tbody.innerHTML = '';
  items.forEach((item) => {
    const tr = document.createElement('tr');
    cfg.row(item).forEach((cell) => {
      const td = document.createElement('td');
      td.innerHTML = cell;
      tr.appendChild(td);
    });
    const btn = tr.querySelector('button[data-id]');
    if (btn) {
      btn.addEventListener('click', () => remove(resource, item._id));
    }
    tbody.appendChild(tr);
  });
}

async function add(resource, body) {
  const res = await fetch(`${API}/${resource}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error((await res.json()).message || `Add ${resource} failed`);
}

async function remove(resource, id) {
  if (!confirm('Delete this item?')) return;
  const res = await fetch(`${API}/${resource}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error((await res.json()).message || 'Delete failed');
  await load(resource);
}

function populateMovieSelects(movies) {
  const selects = document.querySelectorAll('select[name="movie_id"]');
  selects.forEach((sel) => {
    const current = sel.value;
    sel.innerHTML = '<option value="">Select movie</option>';
    movies.forEach((m) => {
      const opt = document.createElement('option');
      opt.value = m._id;
      opt.textContent = `${m.title} (${m.year})`;
      sel.appendChild(opt);
    });
    if (current) sel.value = current;
  });
}

document.querySelectorAll('form[data-resource]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const resource = form.dataset.resource;
    const formData = new FormData(form);
    try {
      const body = resourceConfig[resource].body(resource, formData);
      await add(resource, body);
      form.reset();
      showStatus(`${resource} added`, 'success');
      await load(resource);
      if (resource === 'movies') {
        await load('reviews');
      }
    } catch (err) {
      showStatus(err.message, 'danger');
    }
  });
});

async function init() {
  try {
    await load('movies');
    await load('reviews');
    await load('actors');
  } catch (err) {
    showStatus(err.message, 'danger');
  }
}

init();
