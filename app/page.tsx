import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContestList from '@/components/contest-list';
import ContestFilters from '@/components/contest-filters';

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">CodeTest</h1>
          <p className="text-muted-foreground">
            Track and manage your competitive programming contests
          </p>
        </div>
      </div>

      <ContestFilters />

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="bg-muted/50 border">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Ongoing</TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          <ContestList type="upcoming" />
        </TabsContent>
        <TabsContent value="ongoing" className="space-y-4">
          <ContestList type="ongoing" />
        </TabsContent>
        <TabsContent value="past" className="space-y-4">
          <ContestList type="past" />
        </TabsContent>
      </Tabs>
    </div>
  );
}