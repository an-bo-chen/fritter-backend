function followUser(fields) {
    fetch('/api/follows', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unfollowUser(fields) {
    fetch('/api/follows', {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function allFollowing(fields) {
    fetch('/api/follows/following')
    .then(showResponse)
    .catch(showResponse);
}

function allFollowers(fields) {
    fetch('/api/follows/followers')
    .then(showResponse)
    .catch(showResponse);
}