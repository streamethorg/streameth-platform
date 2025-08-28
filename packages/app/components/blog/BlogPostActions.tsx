'use client';

import { Button } from '@/components/ui/button';
import { Share2, Twitter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BlogPostActionsProps {
  title: string;
  excerpt: string;
}

export const ShareButton = ({ title, excerpt }: BlogPostActionsProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
      onClick={handleShare}
    >
      <Share2 className="w-4 h-4 mr-2" />
      Share
    </Button>
  );
};

export const FollowButton = () => {
  const handleFollow = () => {
    window.open('https://x.com/pblvrt', '_blank');
  };

  return (
    <Button size="sm" variant="outline" onClick={handleFollow}>
      <Twitter className="w-4 h-4 mr-2" />
      Follow on X
    </Button>
  );
};

export const BackToBlogButton = () => {
  return (
    <Link href="/blog">
      <Button
        variant="outline"
        size="lg"
        className="rounded-xl px-8 py-4 font-semibold border-slate-200 hover:bg-slate-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blog
      </Button>
    </Link>
  );
};

export const HeroBackButton = () => {
  return (
    <Link href="/blog">
      <Button
        variant="outline"
        size="sm"
        className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blog
      </Button>
    </Link>
  );
};
