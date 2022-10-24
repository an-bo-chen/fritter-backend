function viewAnonymousModeByUser(fields) {
  fetch(`/api/anonymousMode/${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function editAnonymousModeByUser(fields) {
  fetch(`/api/anonymousMode/${fields.username}`, { method: 'PUT', body: JSON.stringify(fields), headers: { 'Content-Type': 'application/json' } })
    .then(showResponse)
    .catch(showResponse);
}