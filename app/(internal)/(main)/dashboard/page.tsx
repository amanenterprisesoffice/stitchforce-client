'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import State from '@/components/StateComponent';
import Loader from '@/components/ui/Loader';

// Define Template interface
interface Template {
  id: string;
  name: string;
  description: string;
  img_url: string;
  slug: string
}

const Dashboard = () => {
  const { data: templates, isLoading, error } = useFetch({
    url: '/api/templates',  // Make the GET request to this API endpoint
    auto: true,             // Automatically fetch on component mount
  });

  if (isLoading) return <Loader fullScreen />;

  if (error) {
    return (
      <State
        message={`Error loading templates: ${error}`}
      />
    );
  }

  // If no templates are found
  if (templates?.length === 0) {
    return (
      <State
        message="No templates available. Please check back later!"
      />
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl text-center mb-6">Template Dashboard</h1>
      <p className="text-lg text-center text-foreground mb-10">
        Choose a template to get started with your project.
      </p>

      {/* Template Group Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {templates?.map((template: Template) => (
          <Card key={template.id} className="overflow-hidden pt-0">
            <CardContent className="px-0">
              <Image
                src={!template.img_url?.startsWith("https://example.com/")?template.img_url:'/images/placeholder.avif'} // Use template.img_url
                alt={template.name}
                width={368}
                height={580}
                className="aspect-video w-full object-cover object-top"
              />
            </CardContent>
            <CardHeader>
              <CardTitle className="text-xl">{template.name}</CardTitle>
              <CardDescription className="text-sm mt-2">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="gap-3 max-sm:flex-col max-sm:items-stretch">
              <Link href={`/edit/${template.slug}`}>
                <Button className="font-medium">
                  Start Customizing <Palette />
                </Button>
              </Link>
              <Link href={`/download/${template.id}`}>
                <Button variant="outline">Export Now</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
