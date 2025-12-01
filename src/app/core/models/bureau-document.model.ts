import { DocumentStatus } from './document-status.enum';
import { Tag } from './tag.model';

export interface BureauDocument {
  id: string;
  title: string;
  sender: string;
  amount: number;
  due?: string | null;
  status: DocumentStatus;
  category?: string | null;
  summary: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}
