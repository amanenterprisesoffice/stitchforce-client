'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function EditPage() {
  const { user } = useUser()
  const { siteName } = useParams();  // Get siteName (slug) from URL params
  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    // Dynamically set the iframe source based on the siteName from the URL
    if (siteName) {
      setIframeSrc(`/deploy/${user?.email?.split('@')[0]}/${siteName}`);
    }
  }, [siteName]);

  // If iframe source is not set, show a loading message
  if (!iframeSrc) {
    return <p>Loading...</p>;
  }

  return (
    <div className=" w-full h-full">
      {/* Render the iframe with the dynamically set source */}
      <iframe
        src={iframeSrc}
        className="border-0 h-full w-full"
        title="Landing Page"
      />
    </div>
  );
}
