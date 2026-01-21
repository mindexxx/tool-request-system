import { NeedItem, User, Department, Urgency, Status } from '../types';

// Keys for local storage
const USERS_KEY = 'toolreq_users';
const NEEDS_KEY = 'toolreq_needs';
const CURRENT_USER_KEY = 'toolreq_current_user';

// Helper to add days to a date
const addDays = (dateStr: string, days: number) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString(); // Simple format
};

// Initial Mock Data
const INITIAL_NEEDS: NeedItem[] = [
  {
    id: '1',
    title: '自动化报表导出工具',
    department: Department.OPERATIONS,
    description: '目前每天需要手动从三个后台导出数据并在Excel拼接，耗时2小时。需要一个一键导出并格式化的工具。',
    businessValue: '每天节省运营人员2小时工时，减少人为数据错误。',
    targetAudience: '运营组全体',
    urgency: Urgency.HIGH,
    status: Status.IN_PROGRESS,
    submittedBy: 'user_1',
    submittedByName: '张运营',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    estimatedMeetingTime: addDays(new Date().toISOString(), 2)
  },
  {
    id: '2',
    title: '活动页快速生成器',
    department: Department.MARKETING,
    description: '每次大促都需要研发介入改代码换图。希望能有一个后台配置化生成H5落地页的工具。',
    businessValue: '加快活动上线速度，从3天缩短至30分钟。',
    targetAudience: '市场投放组',
    urgency: Urgency.MEDIUM,
    status: Status.PENDING,
    submittedBy: 'user_2',
    submittedByName: '李市场',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    estimatedMeetingTime: addDays(new Date().toISOString(), 3)
  },
  {
    id: '3',
    title: '客户反馈聚合看板',
    department: Department.PRODUCT,
    description: '需要抓取微博、小红书的品牌关键词，聚合展示在后台，方便产品经理做舆情分析。',
    businessValue: '提升产品迭代方向的准确性。',
    targetAudience: '产品经理',
    urgency: Urgency.LOW,
    status: Status.PENDING,
    submittedBy: 'user_3',
    submittedByName: '王产品',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    estimatedMeetingTime: addDays(new Date().toISOString(), 5)
  },
  {
    id: '4',
    title: '财务发票OCR识别',
    department: Department.HR,
    description: '员工报销贴票太麻烦，希望拍照自动识别金额和税号填入系统。',
    businessValue: '全员每月节省30分钟。',
    targetAudience: '全员',
    urgency: Urgency.MEDIUM,
    status: Status.PENDING,
    submittedBy: 'user_4',
    submittedByName: '赵行政',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    estimatedMeetingTime: addDays(new Date().toISOString(), 4)
  },
  {
    id: '5',
    title: '测试环境一键部署',
    department: Department.ENGINEERING,
    description: '开发分支合并后，希望能自动触发Jenkins构建并部署到测试环境，现在手动操作太慢。',
    businessValue: '提升研发效能。',
    targetAudience: '研发部',
    urgency: Urgency.CRITICAL,
    status: Status.PENDING,
    submittedBy: 'user_5',
    submittedByName: '陈研发',
    createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    estimatedMeetingTime: addDays(new Date().toISOString(), 1)
  },
   {
    id: '6',
    title: '销售线索清洗工具',
    department: Department.MARKETING,
    description: '从外部购买的线索有很多重复和格式错误，需要工具自动清洗。',
    businessValue: '提高销售拨打效率。',
    targetAudience: '销售部',
    urgency: Urgency.HIGH,
    status: Status.PENDING,
    submittedBy: 'user_6',
    submittedByName: '刘销售',
    createdAt: new Date(Date.now() - 86400000 * 0.2).toISOString(),
    estimatedMeetingTime: addDays(new Date().toISOString(), 6)
  }
];

export const mockDataService = {
  // --- Auth Simulation ---
  login: async (credentials: { name: string; employeeId: string; phone: string }): Promise<User> => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Simple mock login logic
    // If name contains 'admin', grant admin access
    const isAdmin = credentials.name.includes('admin') || credentials.name.includes('管理员');
    
    const user: User = {
      id: credentials.employeeId, // Use Employee ID as primary ID
      name: credentials.name,
      employeeId: credentials.employeeId,
      phone: credentials.phone,
      role: isAdmin ? 'admin' : 'staff'
    };
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  // --- Needs CRUD ---
  getNeeds: async (): Promise<NeedItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const stored = localStorage.getItem(NEEDS_KEY);
    if (!stored) {
      localStorage.setItem(NEEDS_KEY, JSON.stringify(INITIAL_NEEDS));
      return INITIAL_NEEDS;
    }
    return JSON.parse(stored);
  },

  createNeed: async (need: Omit<NeedItem, 'id' | 'createdAt' | 'status' | 'submittedBy' | 'submittedByName'>, user: User): Promise<NeedItem> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newNeed: NeedItem = {
      ...need,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: Status.PENDING,
      submittedBy: user.id,
      submittedByName: user.name,
      // Calculate estimated meeting time: Today + 3 days
      estimatedMeetingTime: new Date(Date.now() + 86400000 * 3).toLocaleDateString()
    };

    const currentNeeds = await mockDataService.getNeeds();
    const updatedNeeds = [newNeed, ...currentNeeds];
    localStorage.setItem(NEEDS_KEY, JSON.stringify(updatedNeeds));
    return newNeed;
  },

  updateStatus: async (id: string, status: Status): Promise<void> => {
    const currentNeeds = await mockDataService.getNeeds();
    const updated = currentNeeds.map(n => n.id === id ? { ...n, status } : n);
    localStorage.setItem(NEEDS_KEY, JSON.stringify(updated));
  }
};