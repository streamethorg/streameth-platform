import { PropsWithChildren } from 'react'

export default function EventLayout(props: PropsWithChildren) {
  return <div className="overflow-y-scroll">{props.children}</div>
}
