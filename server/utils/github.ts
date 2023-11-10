const GITHUB_ORG = 'streamethorg'
const GITHUB_REPO = 'streameth-platform'
const DEFAULT_FOLDER = 'data'

export async function AddOrUpdateFile(
  filename: string,
  data: string,
  folder: string = DEFAULT_FOLDER
) {
  if (!process.env.GITHUB_API_TOKEN) {
    throw new Error('GITHUB_API_TOKEN not set')
  }
  let sha = ''
  const file = await GetResponseFile(filename, folder)
  if (file) {
    sha = file.sha
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/contents/${folder}/${filename}`,
      {
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
      }
    )

    if (response.status === 200) {
      console.error('Error uploading to Github', response.status, response.statusText)

    }

    const body = await response.json()
    return body
  } catch (e) {
    console.error('ERROR', e)
  }
}

export async function GetResponseFile(
  filename: string,
  folder: string = DEFAULT_FOLDER
) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/contents/${folder}/${filename}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      }
    )

    const body = await response.json()

    return body
  } catch (e) {
    console.error('ERROR', e)
  }
}

export async function GetFile(
  filename: string,
  folder: string = DEFAULT_FOLDER
) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/contents/${filename}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
          Accept: 'application/vnd.github.VERSION.raw',
        },
      }
    )
    const body = await response.json()
    return JSON.stringify(body)
  } catch (e) {
    console.error('ERROR', e)
    return ''
  }
}

export async function GetAllFiles(folder: string = DEFAULT_FOLDER) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/contents/${folder}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
          Accept: 'application/vnd.github.VERSION.raw',
        },
      }
    )

    const files = await response.json()

    if (Array.isArray(files)) {
      const fileNames = files.map((file) => file.name)
      return fileNames
    } else {
      console.error('Invalid response from GitHub API')
      return []
    }
  } catch (e) {
    console.error('ERROR', e)
    return []
  }
}

export async function DeleteFile(
  filename?: string,
  folder: string = DEFAULT_FOLDER
) {
  let sha = ''
  if (filename) {
    const file = await GetResponseFile(filename, folder)
    if (file) {
      sha = file.sha
    }
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/contents/${folder}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
        },
        body: JSON.stringify({
          message: `[av] delete: ${filename}`,
          committer: {
            name: 'github_actions',
            email: 'github-actions[bot]@users.noreply.github.com',
          },
          sha: sha,
        }),
      }
    )

    return response.ok
  } catch (e) {
    console.error('ERROR', e)
    return false
  }
}
