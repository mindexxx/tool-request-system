import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Department, Urgency, Status, NeedItem, User } from './types';
import { mockDataService } from './services/mockDataService';
import { 
  Plus, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  Send,
  Loader2,
  X,
  Lightbulb,
  ListOrdered,
  User as UserIcon,
  Ban,
  CalendarDays,
  History,
  BookOpen
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

type Lang = 'CN' | 'EN';

const TEXT = {
  CN: {
    loginTitle: '工具开发需求收集平台',
    loginSubtitle: 'Internal Tools Collection',
    namePlaceholder: '姓名',
    idPlaceholder: '工号',
    phonePlaceholder: '电话',
    startBtn: '开始',
    successTitle: '需求已提交',
    successMsg: '感谢您的贡献。您的需求已加入评估队列。',
    nextStepTitle: '下一步',
    nextStepMsg: '如果通过初审，我们会安排需求澄清会。',
    checkQueue: '查看队列',
    newReq: '新建需求',
    step: '步骤',
    q1: '这个工具叫什么？',
    q1ph: '例如：日报自动生成器',
    dept: '所属部门',
    q2: '详细描述功能',
    q2sub: '具体说明输入、输出和工作流。',
    q2ph: '目前，我需要手动复制数据...',
    tipTitle: '提效建议：',
    tipMsg: '如果您能提供完整示例（如截图、Excel表头），开发速度可提升2倍。',
    q3: '为什么这很重要？（业务价值）',
    q3ph: '每周大约能节省10小时...',
    q4: '目标用户是谁？',
    q4ph: '例如：全体市场部员工',
    urgency: '紧急程度',
    summary: '摘要',
    back: '返回',
    next: '下一步',
    submit: '提交申请',
    landscape: '需求概览',
    landscapeSub: '各部门需求分布可视化。当前活跃需求数：',
    sort: '排序依据：优先级 & 状态',
    filterAll: '全部',
    filterMine: '我的申请',
    noReq: '暂无相关需求。',
    func: '功能描述',
    val: '业务价值',
    navSubmit: '提交需求',
    navQueue: '队列 & 概览',
    queueFullTitle: '队列已满',
    queueFullMsg: '当前活跃需求超过5个，暂停接收新申请。',
    estMeeting: '预估会议：',
    caseHistory: '历史案例',
    caseTitle: '典型案例库',
    caseBack: '返回登录',
    status: {
       [Status.PENDING]: '待审核',
       [Status.APPROVED]: '已采纳',
       [Status.IN_PROGRESS]: '开发中',
       [Status.COMPLETED]: '已上线',
       [Status.REJECTED]: '已驳回'
    }
  },
  EN: {
    loginTitle: 'Tool Request Platform',
    loginSubtitle: 'Internal Tools Collection',
    namePlaceholder: 'Name',
    idPlaceholder: 'Employee ID',
    phonePlaceholder: 'Phone',
    startBtn: 'Start',
    successTitle: 'Request Submitted',
    successMsg: 'Thank you. Your request has been added to the queue.',
    nextStepTitle: 'Next Step',
    nextStepMsg: 'If approved, we will schedule a clarification meeting.',
    checkQueue: 'Check Queue',
    newReq: 'New Requirement',
    step: 'Step',
    q1: 'What should we call this tool?',
    q1ph: 'e.g. Daily Report Generator',
    dept: 'Department',
    q2: 'Describe functionality',
    q2sub: 'Be specific about inputs, outputs, and workflow.',
    q2ph: 'Currently, I have to manually copy data...',
    tipTitle: 'Pro Tip:',
    tipMsg: 'Development moves 2x faster if you provide a full example (screenshots/headers).',
    q3: 'Business Value',
    q3ph: 'It will save approx 10 hours per week...',
    q4: 'Target Audience',
    q4ph: 'e.g. All Marketing Staff',
    urgency: 'Urgency',
    summary: 'Summary',
    back: 'Back',
    next: 'Next',
    submit: 'Submit Request',
    landscape: 'Needs Landscape',
    landscapeSub: 'Visualizing demand. Active requests:',
    sort: 'Sorted by Priority & Status',
    filterAll: 'All',
    filterMine: 'My Applications',
    noReq: 'No requests found.',
    func: 'Functionality',
    val: 'Business Value',
    navSubmit: 'Submit Request',
    navQueue: 'Queue & Overview',
    queueFullTitle: 'Queue Full',
    queueFullMsg: 'New submissions paused (active requests > 5).',
    estMeeting: 'Est. Meeting:',
    caseHistory: 'Case History',
    caseTitle: 'Success Stories',
    caseBack: 'Back to Login',
    status: {
       [Status.PENDING]: 'Pending',
       [Status.APPROVED]: 'Approved',
       [Status.IN_PROGRESS]: 'In Dev',
       [Status.COMPLETED]: 'Done',
       [Status.REJECTED]: 'Rejected'
    }
  }
};

const MAX_QUEUE_SIZE = 5;

// --- Sub-components ---

const CaseHistoryView = ({ onBack, lang }: { onBack: () => void, lang: Lang }) => {
  const t = TEXT[lang];
  const cases = [
    {
      title: 'Automated Invoice Matching',
      dept: 'Finance',
      impact: 'Saved 40hrs/month',
      desc: 'Previously, the finance team manually matched invoices to POs. The tool now uses OCR to auto-match with 95% accuracy.',
    },
    {
      title: 'Social Media Sentiment Dashboard',
      dept: 'Marketing',
      impact: 'Real-time Crisis Alerts',
      desc: 'Aggregates user comments from 5 platforms. Alerts PR team instantly if negative sentiment spikes > 20%.',
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="font-serif text-3xl font-bold">{t.caseTitle}</h2>
      </div>
      
      <div className="grid gap-6">
        {cases.map((c, i) => (
          <div key={i} className="bg-white border border-gray-200 p-8 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-pudding-accent border border-pudding-accent px-2 py-1">{c.dept}</span>
              <span className="text-sm font-mono text-gray-500">{c.impact}</span>
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">{c.title}</h3>
            <p className="text-gray-600 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LoginView = ({ onLogin, lang, isQueueFull, onShowCases }: { onLogin: (creds: { name: string; employeeId: string; phone: string }) => void, lang: Lang, isQueueFull: boolean, onShowCases: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const t = TEXT[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.employeeId) return;
    setLoading(true);
    await onLogin(formData);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700 slide-in-from-bottom-4">
      {isQueueFull && (
        <div className="w-full max-w-md bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-start gap-3">
          <Ban className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-800">{t.queueFullTitle}</h3>
            <p className="text-sm text-red-700">{t.queueFullMsg}</p>
          </div>
        </div>
      )}

      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h2 className="font-serif text-4xl font-bold tracking-tight text-pudding-black">
            {t.loginTitle}
          </h2>
          {/* Subtitle removed as per request */}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-sm mx-auto">
          <div className="space-y-4">
            <input
              name="name"
              required
              placeholder={t.namePlaceholder}
              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-pudding-black focus:outline-none transition-colors text-center text-lg placeholder:text-gray-300"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="employeeId"
              required
              placeholder={t.idPlaceholder}
              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-pudding-black focus:outline-none transition-colors text-center text-lg placeholder:text-gray-300"
              value={formData.employeeId}
              onChange={handleChange}
            />
            <input
              name="phone"
              required
              placeholder={t.phonePlaceholder}
              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-pudding-black focus:outline-none transition-colors text-center text-lg placeholder:text-gray-300"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full group relative inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white bg-pudding-black overflow-hidden transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
              <span className="flex items-center gap-2">{t.startBtn} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></span>
            }
          </button>
        </form>

        <button 
          onClick={onShowCases}
          className="flex items-center justify-center gap-2 text-gray-500 hover:text-pudding-black transition-colors mx-auto text-sm"
        >
          <BookOpen className="w-4 h-4" />
          {t.caseHistory}
        </button>
      </div>
    </div>
  );
};

const SuccessView = ({ onReset, lang }: { onReset: () => void, lang: Lang }) => {
  const t = TEXT[lang];
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in zoom-in-95 duration-500 text-center px-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-8">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="font-serif text-3xl font-bold mb-4">{t.successTitle}</h2>
      <p className="text-gray-600 max-w-md mx-auto mb-2 text-lg">
        {t.successMsg}
      </p>
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg max-w-md mx-auto my-6">
        <p className="text-orange-800 text-sm font-medium flex items-center gap-2 justify-center">
          <AlertCircle className="w-4 h-4" />
          {t.nextStepTitle}
        </p>
        <p className="text-orange-700 text-sm mt-1">
          {t.nextStepMsg}
        </p>
      </div>
      <button 
        onClick={onReset}
        className="text-pudding-black border-b-2 border-pudding-black pb-1 hover:text-pudding-accent hover:border-pudding-accent transition-colors font-medium"
      >
        {t.checkQueue}
      </button>
    </div>
  );
};

const SubmissionForm = ({ user, onSubmitSuccess, lang, isQueueFull }: { user: User, onSubmitSuccess: () => void, lang: Lang, isQueueFull: boolean }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<NeedItem>>({
    department: Department.OTHER,
    urgency: Urgency.MEDIUM,
  });
  const t = TEXT[lang];

  const totalSteps = 4;

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) return;
    setIsSubmitting(true);
    await mockDataService.createNeed(formData as any, user);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return <SuccessView onReset={onSubmitSuccess} lang={lang} />;
  }

  // --- Queue Limit Block ---
  if (isQueueFull) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Ban className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="font-serif text-2xl font-bold mb-4">{t.queueFullTitle}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {t.queueFullMsg}
          <br/>
          We are currently processing a high volume of requests to ensure quality. Please check back later.
        </p>
      </div>
    );
  }

  // Progress Bar
  const progress = (step / totalSteps) * 100;

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold">{t.newReq}</h2>
        <span className="font-mono text-sm text-gray-500">{t.step} {step} / {totalSteps}</span>
      </div>
      
      <div className="w-full h-1 bg-gray-200 mb-12">
        <div 
          className="h-full bg-pudding-black transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="min-h-[350px]">
        {step === 1 && (
          <div className="space-y-6">
            <label className="block">
              <span className="text-xl font-serif font-medium block mb-4">{t.q1}</span>
              <input
                type="text"
                autoFocus
                className="w-full text-3xl font-bold border-b-2 border-gray-300 py-2 focus:outline-none focus:border-pudding-black bg-transparent placeholder:text-gray-200"
                placeholder={t.q1ph}
                value={formData.title || ''}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </label>
            <div className="pt-4">
              <span className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">{t.dept}</span>
              <div className="flex flex-wrap gap-2">
                {Object.values(Department).map(dept => (
                  <button
                    key={dept}
                    onClick={() => setFormData({...formData, department: dept})}
                    className={`px-4 py-2 text-sm border transition-all ${
                      formData.department === dept 
                      ? 'bg-pudding-black text-white border-pudding-black' 
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
             <label className="block">
              <span className="text-xl font-serif font-medium block mb-4">{t.q2}</span>
              <p className="text-sm text-gray-500 mb-2">{t.q2sub}</p>
              <textarea
                autoFocus
                className="w-full h-40 p-4 border-2 border-gray-200 focus:border-pudding-black focus:outline-none resize-none bg-white text-lg leading-relaxed"
                placeholder={t.q2ph}
                value={formData.description || ''}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </label>
            
            <div className="flex gap-4 p-4 bg-yellow-50/50 border-l-4 border-yellow-200 text-gray-700">
              <Lightbulb className="w-5 h-5 flex-shrink-0 text-yellow-600 mt-1" />
              <div className="font-serif italic text-sm leading-relaxed">
                <strong>{t.tipTitle}</strong> {t.tipMsg}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <label className="block">
              <span className="text-xl font-serif font-medium block mb-4">{t.q3}</span>
              <textarea
                autoFocus
                className="w-full h-32 p-4 border-2 border-gray-200 focus:border-pudding-black focus:outline-none resize-none bg-white text-lg leading-relaxed"
                placeholder={t.q3ph}
                value={formData.businessValue || ''}
                onChange={e => setFormData({...formData, businessValue: e.target.value})}
              />
            </label>
             <label className="block pt-4">
              <span className="text-xl font-serif font-medium block mb-4">{t.q4}</span>
              <input
                type="text"
                className="w-full border-b-2 border-gray-300 py-2 focus:outline-none focus:border-pudding-black bg-transparent text-lg"
                placeholder={t.q4ph}
                value={formData.targetAudience || ''}
                onChange={e => setFormData({...formData, targetAudience: e.target.value})}
              />
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div>
              <span className="text-xl font-serif font-medium block mb-4">{t.urgency}</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.values(Urgency).map((u) => (
                  <button
                    key={u}
                    onClick={() => setFormData({...formData, urgency: u})}
                    className={`p-4 border-2 text-center transition-all ${
                      formData.urgency === u
                      ? 'border-pudding-accent text-pudding-accent font-bold bg-pudding-accent/5' 
                      : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">{t.summary}</h3>
              <p className="text-sm text-gray-600 mb-1"><strong className="text-gray-900">Title:</strong> {formData.title}</p>
              <p className="text-sm text-gray-600 mb-1"><strong className="text-gray-900">Dept:</strong> {formData.department}</p>
              <p className="text-sm text-gray-600 line-clamp-2"><strong className="text-gray-900">Desc:</strong> {formData.description}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
        {step > 1 ? (
          <button onClick={handlePrev} className="text-gray-500 hover:text-black font-medium px-4 py-2">
            {t.back}
          </button>
        ) : <div />}
        
        {step < totalSteps ? (
          <button 
            onClick={handleNext} 
            disabled={!formData.title && step === 1}
            className="bg-pudding-black text-white px-8 py-3 font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {t.next} <ArrowRight className="w-4 h-4"/>
          </button>
        ) : (
           <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-pudding-accent text-white px-8 py-3 font-medium hover:bg-red-700 flex items-center gap-2 shadow-lg shadow-red-100"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4" />}
            {t.submit}
          </button>
        )}
      </div>
    </div>
  );
};

const DashboardView = ({ needs, onStatusUpdate, userRole, currentUserId, lang }: { needs: NeedItem[], onStatusUpdate: (id: string, status: Status) => void, userRole: string, currentUserId: string, lang: Lang }) => {
  const [filter, setFilter] = useState<Status | 'ALL' | 'MINE'>('ALL');
  const t = TEXT[lang];

  // Intelligent Sorting for the Queue:
  // 1. Status: IN_PROGRESS first, then PENDING
  // 2. Urgency: CRITICAL > HIGH > MEDIUM > LOW
  // 3. Date: Newest first
  const sortedNeeds = useMemo(() => {
    const urgencyWeight = {
      [Urgency.CRITICAL]: 4,
      [Urgency.HIGH]: 3,
      [Urgency.MEDIUM]: 2,
      [Urgency.LOW]: 1
    };

    const statusWeight = {
      [Status.IN_PROGRESS]: 5,
      [Status.PENDING]: 4,
      [Status.APPROVED]: 3,
      [Status.COMPLETED]: 2,
      [Status.REJECTED]: 1
    };

    let data = [...needs];
    
    // Filter Logic
    if (filter === 'MINE') {
      data = data.filter(n => n.submittedBy === currentUserId);
    } else if (filter !== 'ALL') {
      data = data.filter(n => n.status === filter);
    }

    return data.sort((a, b) => {
      // Sort by Status Weight desc
      const statusDiff = statusWeight[b.status] - statusWeight[a.status];
      if (statusDiff !== 0) return statusDiff;

      // Sort by Urgency desc
      const urgencyDiff = urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
      if (urgencyDiff !== 0) return urgencyDiff;

      // Sort by Date desc
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [needs, filter, currentUserId]);

  const chartData = useMemo(() => {
    const counts = needs.reduce((acc, curr) => {
      acc[curr.department] = (acc[curr.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [needs]);

  const statusColors = {
    [Status.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [Status.APPROVED]: 'bg-blue-100 text-blue-800 border-blue-200',
    [Status.IN_PROGRESS]: 'bg-purple-100 text-purple-800 border-purple-200',
    [Status.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
    [Status.REJECTED]: 'bg-red-50 text-red-800 border-red-200',
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Visual Header */}
      <section className="grid md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1 space-y-4">
          <h2 className="font-serif text-3xl font-bold">{t.landscape}</h2>
          <p className="text-gray-600 leading-relaxed">
            {t.landscapeSub} <span className="font-bold text-pudding-black">{needs.length}</span>
          </p>
        </div>
        <div className="md:col-span-2 h-64 w-full">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fdfbf7', borderColor: '#000', borderRadius: '0px' }}
                itemStyle={{ color: '#000', fontFamily: 'serif' }}
                cursor={{fill: 'transparent'}}
              />
              <Bar dataKey="value" fill="#1a1a1a" radius={[2, 2, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1a1a1a' : '#4a4a4a'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Queue Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-gray-200 pb-4 gap-4">
          <div className="flex flex-wrap gap-2">
             <button 
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 text-sm font-medium transition-colors ${filter === 'ALL' ? 'text-black bg-gray-100' : 'text-gray-500 hover:text-black'}`}
            >
              {t.filterAll}
            </button>
            <button 
              onClick={() => setFilter('MINE')}
              className={`px-3 py-1 text-sm font-medium transition-colors flex items-center gap-1 ${filter === 'MINE' ? 'text-black bg-gray-100' : 'text-gray-500 hover:text-black'}`}
            >
              <UserIcon className="w-3 h-3"/>
              {t.filterMine}
            </button>
            <div className="w-px h-4 bg-gray-300 mx-2 self-center hidden sm:block"></div>
            {Object.values(Status).map(s => (
              <button 
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1 text-sm font-medium transition-colors ${filter === s ? 'text-black bg-gray-100' : 'text-gray-500 hover:text-black'}`}
              >
                {t.status[s] || s}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-mono">
            <ListOrdered className="w-3 h-3" />
            {t.sort}
          </div>
        </div>

        <div className="grid gap-6">
          {sortedNeeds.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              {t.noReq}
            </div>
          ) : (
            sortedNeeds.map((item, index) => (
              <div key={item.id} className="flex gap-6 group">
                {/* Ranking Number */}
                <div className="hidden sm:flex flex-col items-center pt-2 w-12 flex-shrink-0">
                  <span className="font-serif font-bold text-3xl text-gray-200 group-hover:text-pudding-accent transition-colors">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex-1 bg-white border border-gray-200 p-6 transition-all hover:shadow-lg hover:border-black relative">
                  <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wide border ${statusColors[item.status]}`}>
                        {t.status[item.status] || item.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wide border ${
                        item.urgency === Urgency.CRITICAL ? 'bg-red-600 text-white border-red-600' : 
                        item.urgency === Urgency.HIGH ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {item.urgency}
                      </span>
                    </div>
                    {/* Meeting Time Display */}
                    {item.estimatedMeetingTime && (
                       <div className="flex items-center gap-1 text-xs text-gray-500 font-mono mt-1">
                        <CalendarDays className="w-3 h-3" />
                        {t.estMeeting} {item.estimatedMeetingTime}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="text-xs font-mono text-gray-400 block mb-1">
                      {item.department} • {new Date(item.createdAt).toLocaleDateString()} • By {item.submittedByName}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-pudding-accent transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 text-sm leading-relaxed text-gray-600 mb-6">
                    <div>
                      <strong className="block text-gray-900 mb-1">{t.func}</strong>
                      {item.description}
                    </div>
                    <div>
                      <strong className="block text-gray-900 mb-1">{t.val}</strong>
                      {item.businessValue}
                    </div>
                  </div>

                  {/* Admin Actions - Only show if user is admin */}
                  {userRole === 'admin' && (
                    <div className="pt-4 border-t border-gray-100 flex gap-4 opacity-10 group-hover:opacity-100 transition-opacity">
                      <select 
                        className="text-xs bg-gray-50 border border-gray-300 rounded px-2 py-1"
                        value={item.status}
                        onChange={(e) => onStatusUpdate(item.id, e.target.value as Status)}
                      >
                        {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [needs, setNeeds] = useState<NeedItem[]>([]);
  const [view, setView] = useState<'form' | 'dashboard' | 'cases'>('form');
  const [lang, setLang] = useState<Lang>('CN');

  const t = TEXT[lang];

  // Load initial data
  useEffect(() => {
    const init = async () => {
      const currentUser = mockDataService.getCurrentUser();
      setUser(currentUser);
      const data = await mockDataService.getNeeds();
      setNeeds(data);
    };
    init();
  }, []);

  const activeNeedsCount = useMemo(() => {
    return needs.filter(n => n.status === Status.IN_PROGRESS || n.status === Status.PENDING).length;
  }, [needs]);

  const isQueueFull = activeNeedsCount > MAX_QUEUE_SIZE;

  const handleLogin = async (creds: { name: string; employeeId: string; phone: string }) => {
    const loggedInUser = await mockDataService.login(creds);
    setUser(loggedInUser);
    setView('form');
    const data = await mockDataService.getNeeds();
    setNeeds(data);
  };

  const handleLogout = async () => {
    await mockDataService.logout();
    setUser(null);
    setView('form');
  };

  const handleStatusUpdate = async (id: string, status: Status) => {
    await mockDataService.updateStatus(id, status);
    const updated = await mockDataService.getNeeds();
    setNeeds(updated);
  };

  const handleSubmissionSuccess = async () => {
    const updated = await mockDataService.getNeeds();
    setNeeds(updated);
    setView('dashboard');
  };

  // View Routing Logic
  const renderContent = () => {
    if (!user) {
      if (view === 'cases') {
        return <CaseHistoryView onBack={() => setView('form')} lang={lang} />;
      }
      return (
        <LoginView 
          onLogin={handleLogin} 
          lang={lang} 
          isQueueFull={isQueueFull} 
          onShowCases={() => setView('cases')}
        />
      );
    }

    // Navigation for everyone
    const NavigationHeader = () => (
      <div className="flex justify-center gap-8 mb-12 border-b-2 border-transparent">
        <button 
          onClick={() => setView('form')}
          className={`pb-2 font-serif text-lg transition-all ${
            view === 'form' ? 'border-b-2 border-pudding-black font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {t.navSubmit}
        </button>
        <button 
          onClick={() => setView('dashboard')}
          className={`pb-2 font-serif text-lg transition-all ${
            view === 'dashboard' ? 'border-b-2 border-pudding-black font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {t.navQueue}
        </button>
      </div>
    );

    return (
      <div className="max-w-4xl mx-auto">
        <NavigationHeader />
        {view === 'form' ? (
          <SubmissionForm 
            user={user} 
            onSubmitSuccess={handleSubmissionSuccess} 
            lang={lang} 
            isQueueFull={isQueueFull}
          />
        ) : (
          <DashboardView 
            needs={needs} 
            onStatusUpdate={handleStatusUpdate} 
            userRole={user.role}
            currentUserId={user.id}
            lang={lang}
          />
        )}
      </div>
    );
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      language={lang} 
      onToggleLanguage={() => setLang(l => l === 'CN' ? 'EN' : 'CN')}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;