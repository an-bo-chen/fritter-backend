function viewAllAnonymousFreets(fields) {
  fetch('/api/anonymousFreets')
    .then(showResponse)
    .catch(showResponse);
}

function viewAnonymousFreetsByAuthor(fields) {
  fetch(`/api/anonymousFreets?authorId=${fields.authorId}`)
    .then(showResponse)
    .catch(showResponse);
}

function createAnonymousFreet(fields) {
  fetch('/api/anonymousFreets', { method: 'POST', body: JSON.stringify(fields), headers: { 'Content-Type': 'application/json' } })
    .then(showResponse)
    .catch(showResponse);
}

function editAnonymousFreet(fields) {
  fetch(`/api/anonymousFreets/${fields.id}`, { method: 'PUT', body: JSON.stringify(fields), headers: { 'Content-Type': 'application/json' } })
    .then(showResponse)
    .catch(showResponse);
}

function deleteAnonymousFreet(fields) {
  fetch(`/api/anonymousFreets/${fields.id}`, { method: 'DELETE' })
    .then(showResponse)
    .catch(showResponse);
}
