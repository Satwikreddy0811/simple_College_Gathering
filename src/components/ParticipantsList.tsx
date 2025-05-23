
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/data/events";

interface ParticipantsListProps {
  event: Event;
}

export default function ParticipantsList({ event }: ParticipantsListProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Participants</CardTitle>
          <Badge variant="outline" className="bg-college-blue text-white">
            {event.participants.length} Total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {event.participants.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No participants registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.participants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>{participant.id}</TableCell>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
