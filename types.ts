export enum Department {
  ENERGY = '能源',
  AC = '空调',
  CONSTRUCTION = '可建',
  AIR = '空气',
  HOTEL = '酒店运营',
  GROUP_COMPREHENSIVE = '集团综合',
  RENEWABLE_RESOURCES = '再生资源'
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