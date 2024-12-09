import "../styles/global.css";
import { Metadata } from "next";
import { TimelineProvider } from '@/context/TimelineContext';
import { EditorProvider } from '../context/EditorContext';

export const metadata: Metadata = {
  title: "Remotion and Next.js",
  description: "Remotion and Next.js",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
          <EditorProvider>
          <TimelineProvider>
      <body className="bg-background">{children}</body>
      </TimelineProvider>
      </EditorProvider>
    </html>
  );
}
