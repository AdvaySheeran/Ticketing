export type Status = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: Status;
  priority: Priority;
  createdById: number;
  assignedToId: number | null;
  createdBy: { id: number; name: string; email: string };
  assignedTo: { id: number; name: string; email: string } | null;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  body: string;
  ticketId: number;
  authorId: number;
  author: { id: number; name: string };
  createdAt: string;
}