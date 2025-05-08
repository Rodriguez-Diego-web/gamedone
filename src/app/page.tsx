
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users, Gift, PencilLine, Send, Award, Zap } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center text-center space-y-16 py-8">
      <section className="space-y-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Test Your Bonds: The Ultimate <span className="text-primary">Friendship Quiz</span>!
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          Craft personalized quizzes, challenge your friends, and discover who truly gets you. Fun, fast, and free!
        </p>
        <Link href="/name">
          <Button size="lg" className="text-xl px-10 py-7 shadow-lg hover:shadow-xl transition-shadow">
            <Sparkles className="mr-2 h-6 w-6" />
            Create Your Quiz & Find Out!
          </Button>
        </Link>
      </section>

      <section className="w-full max-w-4xl">
        <Image 
          src="https://picsum.photos/1200/450?grayscale&blur=1"
          alt="Diverse group of friends interacting vuiyally over a quiz concept" 
          width={1200} 
          height={450}
          className="rounded-xl shadow-2xl object-cover"
          data-ai-hint="friends fun quiz"
          priority
        />
      </section>

      <section className="w-full max-w-5xl space-y-10">
        <h2 className="text-3xl font-semibold tracking-tight">How It Works in 3 Easy Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow pt-4">
            <CardHeader className="items-center">
              <PencilLine className="text-primary h-10 w-10 mb-3" />
              <CardTitle>1. Create</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Personalize Your Quiz: Enter your name and answer a set of fun questions about yourself.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow pt-4">
            <CardHeader className="items-center">
              <Send className="text-primary h-10 w-10 mb-3" />
              <CardTitle>2. Share</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Challenge Your Crew: Get a unique link to send to your friends via any platform.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow pt-4">
            <CardHeader className="items-center">
              <Award className="text-primary h-10 w-10 mb-3" />
              <CardTitle>3. Discover</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                See Who Knows You Best: Watch the scores roll in and crown your top friend!
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full max-w-5xl space-y-10 pt-8">
        <h2 className="text-3xl font-semibold tracking-tight">Why You'll Love It</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary h-7 w-7" />
                Spark Joyful Competition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Engage your friends in a lighthearted challenge and share some laughs as you test your bonds.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="text-primary h-7 w-7" />
                Quick & Easy Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Go from zero to quiz-ready in minutes. No sign-ups, just pure, unadulterated fun.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="text-primary h-7 w-7" />
                Instant Fun, Lasting Memories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create memorable moments and find out who's truly in sync with you, one question at a time.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
       <section className="pt-8">
         <Link href="/name">
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 shadow-md hover:shadow-lg transition-shadow border-primary text-primary hover:bg-primary/10">
             Ready to Start? Create Your Quiz!
          </Button>
        </Link>
      </section>
    </div>
  );
}
