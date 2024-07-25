import Link from 'next/link';

export default function Component() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="text-9xl font-bold tracking-tighter text-primary">
          404
        </div>
        <p className="mt-4 text-muted-foreground">
          Oops, the page you are looking for could not be found.
        </p>
        <div className="mt-6">
          <Link
            href="https://info.streameth.org"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
