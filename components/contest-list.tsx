'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar, Clock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ContestListProps = {
  type: 'upcoming' | 'ongoing' | 'past';
};

export default function ContestList({ type }: ContestListProps) {
  const [contests, setContests] = useState<Array<{
    id: number;
    name: string;
    platform: string;
    startTime: string;
    endTime: string; // Added for ongoing logic
    duration: string;
    url: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch('https://clist.by:443/api/v4/contest/?upcoming=true', {
          headers: {
            Authorization: 'ApiKey sajaljha:8dfc38a4779613fb1828d7dfe623078188d775eb',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Allowed platforms
        const allowedPlatforms = ['leetcode.com', 'codeforces.com', 'codechef.com'];

        // Filter contests by platform
        const filteredContests = data.objects.filter((contest: any) =>
          allowedPlatforms.includes(contest.resource)
        );

        // Map filtered contests
        const mappedContests = filteredContests.map((contest: any) => ({
          id: contest.id,
          name: contest.event,
          platform: contest.resource,
          startTime: contest.start,
          endTime: contest.end, // Include end time
          duration: formatDuration(contest.duration),
          url: contest.href,
        }));

        setContests(mappedContests);
      } catch (error) {
        console.error('Error fetching contests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const formatDuration = (duration: string) => {
    const seconds = parseInt(duration, 10);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const filterContests = () => {
    const now = new Date();

    switch (type) {
      case 'upcoming':
        return contests.filter((contest) => new Date(contest.startTime) > now);
      case 'ongoing':
        return contests.filter(
          (contest) =>
            new Date(contest.startTime) <= now && new Date(contest.endTime) > now
        );
      case 'past':
        return contests.filter((contest) => new Date(contest.endTime) <= now);
      default:
        return contests;
    }
  };

  if (loading) {
    return <div>Loading contests...</div>;
  }

  const filteredContests = filterContests();

  return (
    <div className="space-y-4">
      {filteredContests.map((contest) => (
        <div key={contest.id} className="gradient-border">
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold gradient-text">{contest.name}</CardTitle>
              <Button variant="outline" size="icon" className="hover:bg-accent hover:text-accent-foreground">
                <Bell className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm">{contest.platform}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-secondary" />
                  <span className="text-sm">
                    {new Date(contest.startTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="text-sm">{contest.duration}</span>
                </div>
                <div className="flex items-center justify-end">
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <a href={contest.url} target="_blank" rel="noopener noreferrer">
                      View Contest
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
