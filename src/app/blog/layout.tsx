
'use client';

import React from 'react';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-background">
      {children}
      <style jsx>{`
        .blog-background {
          min-height: 100vh;
          background-image: 
            url('/blog/cream-paper.png'),   /* Tiled overlay */
            url('/blog/red-grad-animated.svg'); /* Full background */
          background-size: 
            150px 150px, 
            cover;
          background-repeat: 
            repeat, 
            no-repeat;
          background-position: 
            top left, 
            center;
          background-attachment: 
            scroll, 
            fixed;
        }
      `}</style>
    </div>
  );
}