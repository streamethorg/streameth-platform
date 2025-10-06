'use client';

import { Suspense, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Filter,
  TrendingUp,
  BookOpen,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/utils/blog';

// Static navbar component for blog page to avoid dynamic server usage
const StaticBlogNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo_dark.png"
              alt="StreamEth Logo"
              width={140}
              height={30}
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/explore">
              <Button variant="ghost">Explore</Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost">Blog</Button>
            </Link>
            <Link
              href="https://calendly.com/pablo-streameth/30min"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">Book a Call</Button>
            </Link>
            <Link href="/studio/login">
              <Button variant="default">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const BlogPage = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [postsPerPage] = useState(6);
  const [currentPostsShown, setCurrentPostsShown] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogData = async () => {
      try {
        const [featuredResponse, postsResponse, categoriesResponse] =
          await Promise.all([
            fetch('/api/blog?type=featured'),
            fetch('/api/blog?type=all'),
            fetch('/api/blog?type=categories'),
          ]);

        const [featuredData, postsData, categoriesData] = await Promise.all([
          featuredResponse.json(),
          postsResponse.json(),
          categoriesResponse.json(),
        ]);

        setFeaturedPosts(featuredData.data);
        setAllPosts(postsData.data);
        setCategories(categoriesData.data);

        // Filter out featured posts for the main grid and show initial 6
        const nonFeaturedPosts = postsData.data.filter(
          (post: BlogPost) => !post.featured
        );
        setDisplayedPosts(nonFeaturedPosts.slice(0, postsPerPage));
        setCurrentPostsShown(Math.min(postsPerPage, nonFeaturedPosts.length));
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogData();
  }, [postsPerPage]);

  // Filter posts based on category and search term
  useEffect(() => {
    let filteredPosts = allPosts.filter((post) => !post.featured); // Exclude featured posts from main grid

    if (selectedCategory !== 'All') {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === selectedCategory
      );
    }

    if (searchTerm) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setDisplayedPosts(filteredPosts.slice(0, currentPostsShown));
  }, [selectedCategory, searchTerm, allPosts, currentPostsShown]);

  const handleLoadMore = () => {
    const nonFeaturedPosts = allPosts.filter((post) => !post.featured);
    let filteredPosts = nonFeaturedPosts;

    if (selectedCategory !== 'All') {
      filteredPosts = nonFeaturedPosts.filter(
        (post) => post.category === selectedCategory
      );
    }

    if (searchTerm) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    const newPostsShown = Math.min(
      currentPostsShown + postsPerPage,
      filteredPosts.length
    );
    setCurrentPostsShown(newPostsShown);
    setDisplayedPosts(filteredPosts.slice(0, newPostsShown));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPostsShown(postsPerPage); // Reset to initial number
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPostsShown(postsPerPage); // Reset to initial number
  };

  // Calculate if there are more posts to show
  const hasMorePosts = () => {
    let filteredPosts = allPosts.filter((post) => !post.featured);

    if (selectedCategory !== 'All') {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === selectedCategory
      );
    }

    if (searchTerm) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    return currentPostsShown < filteredPosts.length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StaticBlogNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>

        <div className="container relative mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-8">
              <BookOpen className="w-4 h-4" />
              Latest insights and updates
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Streameth
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-400">
                Blog
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover insights, tutorials, and stories from the world of live
              streaming, Web3, and community building. Stay updated with the
              latest trends and best practices.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 rounded-xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 text-slate-600 font-semibold text-sm mb-3">
                  <TrendingUp className="w-4 h-4" />
                  Featured Articles
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                  Trending Stories
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Our most popular and insightful articles about live streaming,
                  Web3, and community building
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <FeaturedPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              All Articles ({allPosts.filter((post) => !post.featured).length})
            </h3>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600 font-medium">
                Filter by:
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? 'default' : 'outline'}
                size="sm"
                className="rounded-lg"
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section>
          {displayedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMorePosts() && (
                <div className="text-center mt-16">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-xl px-8 py-4 font-semibold border-slate-200 hover:bg-slate-50"
                    onClick={handleLoadMore}
                  >
                    Load More Articles
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No articles found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? `No articles match "${searchTerm}". Try a different search term.`
                  : selectedCategory !== 'All'
                    ? `No articles found in the "${selectedCategory}" category.`
                    : 'No articles available at the moment.'}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const FeaturedPostCard = ({ post }: { post: BlogPost }) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Featured Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </Badge>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <Badge
            variant="secondary"
            className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold"
          >
            {post.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-slate-600 transition-colors duration-300">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-6 line-clamp-3">{post.excerpt}</p>

        <Link href={`/blog/${post.id}`}>
          <Button className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg py-2 px-4 text-sm transition-all duration-300 group-hover:shadow-md">
            Read Article
            <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge
            variant="secondary"
            className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold"
          >
            {post.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-slate-600 transition-colors duration-300">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-6 line-clamp-3">{post.excerpt}</p>

        <Link href={`/blog/${post.id}`}>
          <Button className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg py-2 px-4 text-sm transition-all duration-300 group-hover:shadow-md">
            Read Article
            <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogPage;
