import Image from 'next/image'
import remarkGfm from 'remark-gfm'
import { notFound } from 'next/navigation'
import Markdown from 'react-markdown'
import { Metadata, ResolvingMetadata } from 'next'
import { fetchOrganization } from '@/lib/data'

interface Params {
  params: {
    organizationSlug: string
  }
}

export default async function OrganizationHome({ params }: Params) {
  if (!params.organizationSlug) {
    return notFound()
  }
  const organization = await fetchOrganization({
    organizationSlug: params.organizationSlug,
  })
  if (!organization) {
    return notFound()
  }

  return (
    <main className="w-screen mx-auto fixed overflow-auto h-screen">
      <div className="sticky  top-0 z-50 flex p-4 px-9 gap-4">
        <Image
          src={organization.logo}
          width={50}
          height={50}
          style={{
            objectFit: 'cover',
          }}
          alt={`${organization.name} logo`}
        />
        {/* <FilterBar events={events.map((event) => event.toJson())} /> */}
      </div>
      <div
        className="mx-8 rounded-xl"
        style={{
          backgroundColor: organization.accentColor
            ? organization.accentColor
            : '#fff',
        }}>
        <div className="bg-base py-4 rounded-xl my-3">
          <p className="flex justify-center pt-4 text-accent font-bold text-4xl">
            {organization.name}
          </p>
          <article className="prose max-w-full text-center prose-invert p-4">
            <Markdown remarkPlugins={[remarkGfm]}>
              {organization.description}
            </Markdown>
          </article>
        </div>
      </div>
      <hr className="h-px mx-9  bg-base" />
      <div className="overflow-auto h-screen">
        <div className="px-4">
          {/* {upComing.length > 0 && (
            <>
              <p className="px-4 mt-3 font-ubuntu font-bold lg:py-2 text-blue text-2xl lg:text-4xl">
                Upcoming Events
              </p>
            </>
          )} */}
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const organizationInfo = await fetchOrganization({
    organizationSlug: params.organizationSlug,
  })

  if (!organizationInfo) {
    return {
      title: 'Organization not found',
      description: 'Organization not found',
    }
  }

  const imageUrl = organizationInfo.logo
  try {
    return {
      title: organizationInfo.name,
      description: organizationInfo.description,
      openGraph: {
        images: [imageUrl],
      },
    }
  } catch (e) {
    console.log(e)
    return {
      title: organizationInfo.name,
      description: organizationInfo.description,
    }
  }
}
