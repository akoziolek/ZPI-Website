//query pool, await, begin, commit, end, transakcje
// konto web_user/api_user, ktory ma dostep do całej db - rola techiczna
// \echo :AUTOCOMMIT - ustawić false na bazce, aby działał rollback

export async function getUsers(req, res) {
    res.json({ info: 'get users ????/' })
}

export async function getUserById(req, res) {
    res.json({ info: 'single usersgfgv' })
}

export async function createUser(req, res) {
  res.json({ info: 'post user' })
}
