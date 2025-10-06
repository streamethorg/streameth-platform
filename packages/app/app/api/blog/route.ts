import { NextRequest, NextResponse } from 'next/server';
import {
  getSortedPostsData,
  getFeaturedPosts,
  getAllCategories,
} from '@/lib/utils/blog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'featured':
        const featuredPosts = await getFeaturedPosts();
        return NextResponse.json({ data: featuredPosts });

      case 'categories':
        const categories = await getAllCategories();
        return NextResponse.json({ data: categories });

      case 'all':
      default:
        const allPosts = await getSortedPostsData();
        return NextResponse.json({ data: allPosts });
    }
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog data' },
      { status: 500 }
    );
  }
}
