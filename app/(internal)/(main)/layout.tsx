'use client'

import Header from "@/components/ui/Header"
import { usePathname } from "next/navigation"; // Hook to get the current path
import { useEffect } from "react";
import "@/app/globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";


const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  // Check if the current path starts with "/edit/"
  const isEditTemplate = pathname.startsWith("/edit/");
  const isHome = pathname === "/";

  return (
    <>
      <div className="h-full max-h-screen flex flex-col">
        <Header className={isEditTemplate ? 'relative!' : ''} />
        <div className={`flex-1 no-scrollbar ${isEditTemplate ? 'border-t mx-auto w-full overflow-auto' : ''}`}>
          <div className={` ${isHome ? '' : 'my-container h-full mx-auto pt-15 sm:pt-20 lg:pt-30'} ${isEditTemplate ? 'pt-2!' : ''} `}>
            {children}
          </div>
        </div>
      </div>
      <Toaster
        duration={2000}
        toastOptions={{
          classNames: {
            success: '!bg-green-700 !text-white',
            error: '!bg-red-700 !text-white',
            info: '!bg-orange-500 !text-white',
            warning: '!bg-yellow-500 !text-black',
          },
        }}
      />
    </>
  );
};

export default MainLayout;
