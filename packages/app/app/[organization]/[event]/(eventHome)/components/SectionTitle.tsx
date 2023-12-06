export default function SectionTitle({ title }: { title: string }) {
  return (
    <span className=" w-full text-4xl uppercase md:text-4xl flex mb-2 ">
      {title}
    </span>
  )
}
