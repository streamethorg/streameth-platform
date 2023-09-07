const GITHUB_ORG = 'streamethorg'
const GITHUB_REPO = 'streameth-platform'
const DEFAULT_FOLDER = 'data'

export async function AddOrUpdateFile(filename: string, data: string, folder: string = DEFAULT_FOLDER) {
  console.log('Add or Update file', filename, folder)
  if (!process.env.GITHUB_API_TOKEN) {
    throw new Error('GITHUB_API_TOKEN not set')
  }

  let sha = ''
  const file = await GetFile(filename, folder)
  if (file) {
    sha = file.sha
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/contents/${folder}/${filename}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({
        message: `[av] ${filename}`,
        committer: {
          name: 'github_actions',
          email: 'github-actions[bot]@users.noreply.github.com',
        },
        sha: sha,
        content: Buffer.from(data).toString('base64'),
      }),
    })

    const body = await response.json()
    return body
  } catch (e) {
    console.error('ERROR', e)
  }
}

export async function GetFile(filename: string, folder: string = DEFAULT_FOLDER) {
  console.log('Get file', filename, folder)
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/contents/${folder}/${filename}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    })

    const body = await response.json()
    return body
  } catch (e) {
    console.error('ERROR', e)
  }
}
