import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Markers from '../markers/Markers';
import SessionSidebar from './clips';
import LibraryFilter from '../../../library/components/LibraryFilter';
export default function Sidebar({
  organizationId,
}: {
  organizationId: string;
}) {
  return (
    <div className="h-full w-full border-l bg-background bg-white">
      <Tabs defaultValue="clips" className=" h-full ">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="markers">Markers</TabsTrigger>
          <TabsTrigger value="clips">Clips</TabsTrigger>
        </TabsList>
        <TabsContent value="markers">{/* <Markers /> */}</TabsContent>
        <TabsContent value="clips" className="h-full">
          <SessionSidebar organizationId={organizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
