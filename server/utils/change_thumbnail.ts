import * as fs from 'fs'
import * as path from 'path'

const directoryPath = path.join(__dirname, '../../data/sessions/')

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory:', err)
  }

  files.forEach((file) => {
    if (file.startsWith('zuzalu_montenegro_2023')) {
      const fullPath = path.join(directoryPath, file)

      fs.readdir(fullPath, (err, jsonFiles) => {
        if (err) {
          return console.log('Unable to scan subdirectory:', err)
        }

        jsonFiles.forEach((jsonFile) => {
          if (jsonFile.endsWith('.json')) {
            const jsonPath = path.join(fullPath, jsonFile)

            fs.readFile(jsonPath, 'utf8', (err, data) => {
              if (err) {
                return console.log('Unable to read file:', err)
              }

              let jsonData = JSON.parse(data)
              jsonData.coverImage =
                '/sessions/zuzalu_montenegro_2023/zuzalu_thumbnail.jpg'

              fs.writeFile(
                jsonPath,
                JSON.stringify(jsonData, null, 2),
                'utf8',
                (err) => {
                  if (err) {
                    return console.log('Unable to write file:', err)
                  }
                  console.log(`Updated coverImage in ${jsonFile}`)
                }
              )
            })
          }
        })
      })
    }
  })
})
