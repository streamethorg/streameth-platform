import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import HomePageNavbar from '@/components/Layout/HomePageNavbar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Tag, Eye } from 'lucide-react';
import Image from 'next/image';
import { getPostData, getSortedPostsData, BlogPost } from '@/lib/utils/blog';
import {
  ShareButton,
  FollowButton,
  BackToBlogButton,
  HeroBackButton,
} from '@/components/blog/BlogPostActions';

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { id } = await params;

  try {
    const post = await getPostData(id);
    const allPosts = await getSortedPostsData();
    const relatedPosts = allPosts
      .filter((p) => p.id !== id && p.category === post.category)
      .slice(0, 3);

    return (
      <div className="min-h-screen bg-white">
        <Suspense fallback={<div className="h-16 bg-white" />}>
          <HomePageNavbar
            logo=""
            currentOrganization=""
            pages={[
              { name: 'Blog', href: '/blog' },
              { name: 'Explore', href: '/explore' },
            ]}
            showSearchBar={false}
          />
        </Suspense>

        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* Back Button */}
            <div className="absolute top-6 left-6">
              <HeroBackButton />
            </div>

            {/* Share Button */}
            <div className="absolute top-6 right-6">
              <ShareButton title={post.title} excerpt={post.excerpt} />
            </div>
          </div>

          {/* Article Header */}
          <div className="container mx-auto px-4 -mt-20 relative z-10">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {post.category}
                </Badge>
                {post.featured && (
                  <Badge className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{post.views.toLocaleString()} views</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-slate-50 text-slate-700 border-slate-200 px-3 py-1 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Article Content */}
            <section className="mb-16">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            </section>

            {/* Author Section */}
            <section className="mb-16">
              <div className="bg-slate-50 rounded-2xl p-8">
                <div className="flex items-start gap-6">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={post.authorAvatar}
                      alt={post.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {post.author}
                    </h3>
                    <p className="text-gray-600 mb-4">{post.authorBio}</p>
                    <div className="flex gap-3">
                      <FollowButton />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Back to Blog Button */}
            <section className="mb-16">
              <div className="text-center">
                <BackToBlogButton />
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
};

export default BlogPostPage;
