'use client'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useState } from 'react'
import { ISession } from 'streameth-server/model/session'

dayjs.extend(duration)

interface Props {
  event: any
  streamUrl: string
  sessions: any[]
}

export function SessionList(props: Props) {
  const [editInfo, setEditInfo] = useState<any>({})

  useEffect(() => {
    setEditInfo({})
  }, [props])

  async function processVideos() {
    const response = await fetch('/api/admin/studio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: props.event,
        sessions: editInfo,
      }),
    })
    await response.json()

    // TODO: handle results? Should refresh sessionList with filled in values
  }

  return (
    <div className="mt-4">
      <div className="max-h-96 overflow-y-auto">
        <table className="table-auto text-left shrink-0">
          <thead>
            <tr>
              <th className="w-full">Title</th>
              <th>Start (secs)</th>
              <th>End (secs)</th>
            </tr>
          </thead>
          <tbody>
            {props.sessions
              .sort(
                (a, b) =>
                  dayjs(a.start).valueOf() - dayjs(b.start).valueOf()
              )
              .map((i: ISession) => {
                return (
                  <tr key={i.id} className="hover:bg-stone-200">
                    <td className="py-2">
                      <p className="ml-2 text-ellipsis overflow-hidden">
                        {i.name}
                      </p>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="start"
                        placeholder={
                          i.source?.start
                            ? String(i.source?.start)
                            : 'Start'
                        }
                        className="p-1 mr-2 w-24 text-sm border rounded"
                        required
                        onChange={(e) =>
                          setEditInfo((value: any) => {
                            return {
                              ...value,
                              [i.id]: {
                                ...value[i.id],
                                streamUrl: props.streamUrl,
                                start: Number(e.target.value),
                              },
                            }
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="end"
                        placeholder={
                          i.source?.end
                            ? String(i.source?.end)
                            : 'End'
                        }
                        className="p-1  mr-2 w-24 text-sm border rounded"
                        required
                        onChange={(e) =>
                          setEditInfo((value: any) => {
                            return {
                              ...value,
                              [i.id]: {
                                ...value[i.id],
                                streamUrl: props.streamUrl,
                                end: Number(e.target.value),
                              },
                            }
                          })
                        }
                      />
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button
          className="p-2 bg-blue-500 text-white rounded"
          onClick={processVideos}>
          Process
        </button>
      </div>
    </div>
  )
}
