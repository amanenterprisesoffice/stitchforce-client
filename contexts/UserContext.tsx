'use client';

import Loader from "@/components/ui/Loader";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

// Define a type for the user object
export interface User {
  id: string;
  name: string;
  email: string;
  profile?: string;
  organization_id: string;
  // Add other fields if needed
}

// Define the context value type
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refetch: () => void;
  isLoading: boolean;
}

// Create the UserContext with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Use custom fetch hook
  const { refetch } = useFetch({
    auto: true,
    url: `/api/users/me`,
    onSuccess: (result) => {
      const user : User = result.user
      setUser(user); 
      setIsLoading(false);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error Fetching User");
      setIsLoading(false);
    },
  });

  // If loading, display loader
  if (isLoading) return <Loader fullScreen />;

  return (
    <UserContext.Provider value={{ user, setUser, refetch, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
