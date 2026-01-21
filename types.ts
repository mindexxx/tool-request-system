export enum Department {
  ENGINEERING = '研发部',
  PRODUCT = '产品部',
  DESIGN = '设计部',
  MARKETING = '市场部',
  OPERATIONS = '运营部',
  HR = '人力资源',
  OTHER = '其他'
}

export enum Urgency {
  LOW = '不急',
  MEDIUM = '正常',
  HIGH = '紧急',
  CRITICAL = '立刻需要'
}

export enum Status {
  PENDING = '待审核',
  APPROVED = '已采纳',
  IN_PROGRESS = '开发中',
  COMPLETED = '已上线',
  REJECTED = '已驳回'
}

export interface User {
  id: string;
  name: string;
  employeeId: string;
  phone: string;
  role: 'staff' | 'admin';
}

export interface NeedItem {
  id: string;
  title: string;
  department: Department;
  description: string;
  businessValue: string; // "Why do we need this?"
  targetAudience: string; // "Who will use this?"
  urgency: Urgency;
  status: Status;
  submittedBy: string; // User ID
  submittedByName: string;
  createdAt: string;
  estimatedMeetingTime?: string; // New field
}