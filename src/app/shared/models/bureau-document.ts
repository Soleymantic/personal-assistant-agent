export interface BureauDocument {
  id: number;
  title: string;
  sender: string;
  amount: string;
  due: string;
  status: 'pending' | 'needs-action' | 'paid';
  category: string;
  tags: string[];
  summary: string;
}
