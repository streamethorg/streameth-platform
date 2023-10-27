import { PropsWithChildren } from 'react'

export default function EventLayout(props: PropsWithChildren) {
  return <div className="overflow-y-scroll w-full">{props.children}</div>
}
