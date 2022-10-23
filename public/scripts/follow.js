function followUser(fields) {
    fetch('/api/follows', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unfollowUser(fields) {
    fetch(`/api/follows?username=${fields.username}`, {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function viewAllFollowing(fields) {
    fetch('/api/follows/following')
    .then(showResponse)
    .catch(showResponse);
}

function viewAllFollowers(fields) {
    fetch('/api/follows/followers')
    .then(showResponse)
    .catch(showResponse);
}

function viewFreetsByFollowing(fields) {
    fetch('/api/follows/following/freets')
    .then(showResponse)
    .catch(showResponse);
}