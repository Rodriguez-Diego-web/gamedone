'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ArrowRightCircle } from 'lucide-react'; // Changed icon
import { useToast } from "@/hooks/use-toast";

export default function NamePage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const [creatorNameFromStorage, setCreatorNameFromStorage] = useState<string | null>(null);

  useEffect(() => {
    // Pre-fill name if it exists in localStorage (e.g., user came back)
    const storedName = localStorage.getItem('creatorName');
    if (storedName) {
      setName(storedName);
      setCreatorNameFromStorage(storedName);
    }
  }, []);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || name.trim().length > 30) {
      setError('Name must be between 2 and 30 characters.');
      toast({
        title: "Validation Error",
        description: "Name must be between 2 and 30 characters.",
        variant: "destructive",
      });
      return;
    }
    setError('');
    localStorage.setItem('creatorName', name.trim());
    router.push('/quiz'); 
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-lg shadow-xl"> {/* Increased max-w */}
        <CardHeader className="text-center">
          <User className="mx-auto h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-3xl">Create Your Friendship Quiz</CardTitle>
          <CardDescription className="text-md pt-1">
            First, tell us your name. This will be shown to friends when they take your quiz.
            {creatorNameFromStorage && name === creatorNameFromStorage && (
                 <span className="block text-sm text-muted-foreground mt-1">(Welcome back, {creatorNameFromStorage}!)</span>
            )}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-8"> {/* Added padding */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg font-semibold">Your Name</Label> {/* Made label bolder */}
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="E.g., Alex P."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={30}
                  className="text-lg h-14 pl-4 pr-10" // Increased size and padding
                  aria-describedby="name-error"
                />
                 <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              {error && <p id="name-error" className="text-sm text-destructive mt-1">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="px-8 pb-8"> {/* Added padding */}
            <Button type="submit" className="w-full text-lg py-7"> {/* Increased py */}
              Next: Answer Your Questions
              <ArrowRightCircle className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
