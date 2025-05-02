import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { config } from './config';
import { realUserApi, realMessageApi, realKnowledgeBaseApi, realPaperApi } from './realApi';
import { User, Message, Conversation, Paper, KnowledgeBase } from './types';

// 模拟用户数据
export const users = [
  { id: 1, username: "用户1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1", followers: 120, following: 45, location: "北京", experience: "互联网从业者，热爱技术分享" },
  { id: 2, username: "用户2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2", followers: 85, following: 32, location: "上海", experience: "人工智能研究员，专注机器学习" },
  { id: 3, username: "用户3", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3", followers: 210, following: 67, location: "广州", experience: "数据科学家，擅长数据分析与可视化" },
  { id: 4, username: "用户4", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4", followers: 95, following: 28, location: "深圳", experience: "全栈开发工程师，喜欢探索新技术" },
  { id: 5, username: "用户5", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5", followers: 150, following: 53, location: "杭州", experience: "产品经理，关注用户体验与产品设计" },
  // 视频作者用户
  { id: 101, username: "月下宅女", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=月下宅女", followers: 49000, following: 120, location: "成都", experience: "生活博主，分享美食与生活日常" },
  { id: 102, username: "travel_world", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=travel_world", followers: 30500, following: 210, location: "环球旅行中", experience: "旅行博主，足迹遍布全球，分享旅行经验与摄影技巧" },
  { id: 103, username: "drone_master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=drone_master", followers: 78900, following: 150, location: "西安", experience: "航拍达人，专注分享无人机航拍技巧与视频" },
];

// 模拟当前登录用户
let currentUser = {
  id: 0,
  username: "当前用户",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=current",
  followers: 0,
  following: 0,
  followingList: [] as number[],
  location: "北京",
  experience: "热爱分享知识，构建个人知识库"
};

// 模拟知识库数据
const knowledgeBases: KnowledgeBase[] = [
  {
    id: 1,
    title: "人工智能伦理研究",
    description: "关于人工智能伦理问题的研究集合",
    userId: 1,
    createdAt: "2023-01-15",
    updatedAt: "2023-04-20",
    papers: [
      {
        id: 1,
        title: "人工智能伦理框架",
        authors: ["张三", "李四"],
        abstract: "本文提出了一个评估人工智能系统伦理影响的框架...",
        publishDate: "2022-12-10",
        doi: "10.1234/ai-ethics-2022",
        url: "https://example.com/paper1"
      },
      {
        id: 2,
        title: "AI决策透明度研究",
        authors: ["王五", "赵六"],
        abstract: "本研究探讨了提高人工智能决策透明度的多种方法...",
        publishDate: "2023-01-05",
        doi: "10.1234/ai-transparency-2023",
        url: "https://example.com/paper2"
      }
    ],
    tags: ["人工智能", "伦理", "透明度"],
    stars: 42,
    forks: 12
  },
  {
    id: 2,
    title: "机器学习算法优化",
    description: "各种机器学习算法的优化技巧和最佳实践",
    userId: 2,
    createdAt: "2023-02-10",
    updatedAt: "2023-04-18",
    papers: [
      {
        id: 3,
        title: "深度神经网络训练加速技术",
        authors: ["陈七", "周八"],
        abstract: "本文介绍了几种加速深度神经网络训练的技术...",
        publishDate: "2023-02-15",
        doi: "10.1234/dl-acceleration-2023",
        url: "https://example.com/paper3"
      }
    ],
    tags: ["机器学习", "深度学习", "优化"],
    stars: 38,
    forks: 8
  },
  // 为当前用户添加知识库
  {
    id: 3,
    title: "大语言模型知识整合",
    description: "大型语言模型（LLM）的综合研究，包含架构、训练方法、应用场景和最新成果",
    userId: 0,
    createdAt: "2023-05-12",
    updatedAt: "2023-11-08",
    papers: [
      {
        id: 4,
        title: "Transformer架构深度解析",
        authors: ["李明", "王华"],
        abstract: "本文深入剖析了Transformer架构的设计原理、各组件功能以及其在NLP领域的革命性影响...",
        publishDate: "2023-06-20",
        doi: "10.1234/transformer-analysis-2023",
        url: "https://example.com/paper4"
      },
      {
        id: 5,
        title: "大语言模型训练技术综述",
        authors: ["张伟", "刘芳"],
        abstract: "本文综述了大语言模型训练的关键技术，包括数据处理、预训练策略、指令微调等方法...",
        publishDate: "2023-07-15",
        doi: "10.1234/llm-training-survey-2023",
        url: "https://example.com/paper5"
      },
      {
        id: 6,
        title: "大语言模型在医疗领域的应用",
        authors: ["陈健", "林雪"],
        abstract: "本研究探讨了大语言模型在医疗诊断、医学文献分析和临床决策支持等方面的应用前景和挑战...",
        publishDate: "2023-08-22",
        doi: "10.1234/llm-medical-applications-2023",
        url: "https://example.com/paper6"
      }
    ],
    tags: ["大语言模型", "NLP", "人工智能", "Transformer"],
    stars: 156,
    forks: 47
  },
  {
    id: 4,
    title: "计算机视觉研究集锦",
    description: "计算机视觉领域的前沿研究和实践案例，包含目标检测、图像分割、视频分析等方向",
    userId: 0,
    createdAt: "2023-03-05",
    updatedAt: "2023-10-30",
    papers: [
      {
        id: 7,
        title: "多模态目标检测最新进展",
        authors: ["郑强", "赵明"],
        abstract: "本文总结了结合多种传感器数据的目标检测技术的最新进展，特别是红外与可见光结合的方法...",
        publishDate: "2023-04-10",
        doi: "10.1234/multimodal-detection-2023",
        url: "https://example.com/paper7"
      },
      {
        id: 8,
        title: "自监督学习在图像分割中的应用",
        authors: ["黄磊", "吴佳"],
        abstract: "研究了自监督学习方法如何改进图像分割任务的性能，并提出了一种新的预训练框架...",
        publishDate: "2023-06-05",
        doi: "10.1234/self-supervised-segmentation-2023",
        url: "https://example.com/paper8"
      }
    ],
    tags: ["计算机视觉", "目标检测", "图像分割", "深度学习"],
    stars: 87,
    forks: 23
  },
  {
    id: 5,
    title: "强化学习理论与实践",
    description: "强化学习算法的理论基础、最新研究方向和实际应用案例的综合集合",
    userId: 0,
    createdAt: "2023-04-18",
    updatedAt: "2023-12-01",
    papers: [
      {
        id: 9,
        title: "多智能体强化学习最新进展",
        authors: ["孙伟", "李强"],
        abstract: "本文综述了多智能体强化学习的研究现状，包括合作与竞争环境下的算法设计和应用场景...",
        publishDate: "2023-05-20",
        doi: "10.1234/marl-advances-2023",
        url: "https://example.com/paper9"
      },
      {
        id: 10,
        title: "基于模型的强化学习方法对比",
        authors: ["王磊", "张红"],
        abstract: "对比分析了不同基于模型的强化学习方法在效率、稳定性和泛化能力方面的表现...",
        publishDate: "2023-07-12",
        doi: "10.1234/model-based-rl-comparison-2023",
        url: "https://example.com/paper10"
      },
      {
        id: 11,
        title: "强化学习在自动驾驶中的应用",
        authors: ["刘明", "陈亮"],
        abstract: "探讨了强化学习技术在自动驾驶决策控制、路径规划和场景理解等方面的应用研究...",
        publishDate: "2023-09-08",
        doi: "10.1234/rl-autonomous-driving-2023",
        url: "https://example.com/paper11"
      }
    ],
    tags: ["强化学习", "人工智能", "多智能体系统", "自动驾驶"],
    stars: 112,
    forks: 34
  }
];

// 模拟私信数据
const messages: Message[] = [
  {
    id: 1,
    senderId: 1,
    receiverId: 0,
    content: "你好，我对你的知识库很感兴趣！",
    timestamp: "2023-04-28T10:30:00Z",
    isRead: true
  },
  {
    id: 2,
    senderId: 0,
    receiverId: 1,
    content: "谢谢你的关注！有什么我可以帮助你的吗？",
    timestamp: "2023-04-28T11:15:00Z",
    isRead: true
  },
  {
    id: 3,
    senderId: 2,
    receiverId: 0,
    content: "我们可以交流一下关于人工智能的研究吗？",
    timestamp: "2023-04-27T09:20:00Z",
    isRead: false
  }
];

// 获取用户信息
export const getUser = async (userId: number) => {
  if (config.useMockData) {
    // 先找精确匹配的用户ID
    const user = users.find(user => user.id === userId);
    if (user) return user;
    
    // 如果找不到，返回一个动态生成的用户
    return {
      id: userId,
      username: `用户${userId}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      followers: Math.floor(Math.random() * 10000),
      following: Math.floor(Math.random() * 200),
      location: "未知地区",
      experience: "这个用户还没有填写个人介绍"
    };
  } else {
    return realUserApi.getUser(userId);
  }
};

// 通过用户名获取用户信息
export const getUserByUsername = async (username: string) => {
  if (config.useMockData) {
    // 先找精确匹配的用户
    const user = users.find(user => user.username === username);
    if (user) return user;
    
    // 如果找不到，看是否是数字ID被当作用户名使用
    const userId = parseInt(username?.replace(/\D/g, '') || "0");
    if (userId > 0) {
      const userById = users.find(user => user.id === userId);
      if (userById) return userById;
    }
    
    // 如果仍找不到，返回一个动态生成的用户
    return {
      id: 9000 + Math.floor(Math.random() * 1000),
      username: username || "未知用户",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || Math.random()}`,
      followers: Math.floor(Math.random() * 10000),
      following: Math.floor(Math.random() * 200),
      location: "未知地区",
      experience: "这个用户还没有填写个人介绍"
    };
  } else {
    return realUserApi.getUserByUsername(username);
  }
};

// 获取当前用户
export const getCurrentUser = async () => {
  if (config.useMockData) {
    return currentUser;
  } else {
    return realUserApi.getCurrentUser();
  }
};

// 获取关注列表
export const getFollowingList = async () => {
  if (config.useMockData) {
    return currentUser.followingList.map(id => users.find(user => user.id === id)).filter(Boolean);
  } else {
    return realUserApi.getFollowingList();
  }
};

// 关注用户
export const followUser = async (userId: number): Promise<boolean> => {
  if (config.useMockData) {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!currentUser.followingList.includes(userId)) {
      currentUser.followingList.push(userId);
      currentUser.following += 1;
      
      const user = users.find(u => u.id === userId);
      if (user) {
        user.followers += 1;
      }
      
      return true;
    }
    return false;
  } else {
    return realUserApi.followUser(userId);
  }
};

// 取消关注用户
export const unfollowUser = async (userId: number): Promise<boolean> => {
  if (config.useMockData) {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = currentUser.followingList.indexOf(userId);
    if (index !== -1) {
      currentUser.followingList.splice(index, 1);
      currentUser.following -= 1;
      
      const user = users.find(u => u.id === userId);
      if (user) {
        user.followers -= 1;
      }
      
      return true;
    }
    return false;
  } else {
    return realUserApi.unfollowUser(userId);
  }
};

// 检���是否已关注
export const isFollowing = async (userId: number) => {
  if (config.useMockData) {
    return currentUser.followingList.includes(userId);
  } else {
    return realUserApi.isFollowing(userId);
  }
};

// 获取用户的知识库列表
export const getUserKnowledgeBases = async (userId: number) => {
  if (config.useMockData) {
    return knowledgeBases.filter(kb => kb.userId === userId);
  } else {
    return realKnowledgeBaseApi.getUserKnowledgeBases(userId);
  }
};

// 通过用户名获取知识库列表
export const getUserKnowledgeBasesByUsername = async (username: string) => {
  if (config.useMockData) {
    // 在实际应用中，这里应该先通过用户名获取用户ID，然后获取知识库
    // 这里我们直接模拟一些数据
    const user = users.find(u => u.username === username);
    if (!user) return [];
    
    return knowledgeBases.filter(kb => kb.userId === user.id);
  } else {
    return realKnowledgeBaseApi.getUserKnowledgeBasesByUsername(username);
  }
};

// 获取知识库详情
export const getKnowledgeBase = async (kbId: number) => {
  if (config.useMockData) {
    return knowledgeBases.find(kb => kb.id === kbId) || null;
  } else {
    return realKnowledgeBaseApi.getKnowledgeBase(kbId);
  }
};

// 获取所有知识库
export const getAllKnowledgeBases = async () => {
  if (config.useMockData) {
    return knowledgeBases;
  } else {
    return realKnowledgeBaseApi.getAllKnowledgeBases();
  }
};

// 添加知识库
export const addKnowledgeBase = async (kb: Omit<KnowledgeBase, "id" | "createdAt" | "updatedAt" | "stars" | "forks">): Promise<KnowledgeBase> => {
  if (config.useMockData) {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newKb: KnowledgeBase = {
      ...kb,
      id: knowledgeBases.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      stars: 0,
      forks: 0
    };
    
    knowledgeBases.push(newKb);
    return newKb;
  } else {
    return realKnowledgeBaseApi.addKnowledgeBase(kb);
  }
};

// 添加论文到知识库
export const addPaperToKnowledgeBase = async (kbId: number, paper: Omit<Paper, "id">): Promise<Paper> => {
  if (config.useMockData) {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const kb = knowledgeBases.find(k => k.id === kbId);
    if (!kb) {
      throw new Error("知识库不存在");
    }
    
    const newPaper: Paper = {
      ...paper,
      id: Math.max(...kb.papers.map(p => p.id), 0) + 1
    };
    
    kb.papers.push(newPaper);
    kb.updatedAt = new Date().toISOString().split('T')[0];
    
    return newPaper;
  } else {
    return realKnowledgeBaseApi.addPaperToKnowledgeBase(kbId, paper);
  }
};

// 获取用户的所有对话
export const getConversations = async (userId: number): Promise<Conversation[]> => {
  if (config.useMockData) {
    // 在实际应用中，这应该是一个API调用
    const userConversations = messages
      .filter(msg => msg.senderId === userId || msg.receiverId === userId)
      .reduce((acc: { [key: string]: Message[] }, msg) => {
        const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        const key = `${Math.min(userId, otherUserId)}-${Math.max(userId, otherUserId)}`;
        
        if (!acc[key]) {
          acc[key] = [];
        }
        
        acc[key].push(msg);
        return acc;
      }, {});
    
    return Object.entries(userConversations).map(([key, msgs]) => {
      const [user1, user2] = key.split('-').map(Number);
      const otherUserId = user1 === userId ? user2 : user1;
      
      // 按时间排序
      msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      const lastMessage = msgs[0];
      const unreadCount = msgs.filter(msg => !msg.isRead && msg.senderId !== userId).length;
      
      return {
        id: parseInt(key.replace('-', '')),
        participants: [user1, user2],
        lastMessage,
        unreadCount
      };
    }).sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
  } else {
    return realMessageApi.getConversations();
  }
};

// 获取两个用户之间的所有消息
export const getMessages = async (userId1: number, userId2: number): Promise<Message[]> => {
  if (config.useMockData) {
    // 在实际应用中，这应该是一个API调用
    return messages
      .filter(msg => 
        (msg.senderId === userId1 && msg.receiverId === userId2) || 
        (msg.senderId === userId2 && msg.receiverId === userId1)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  } else {
    return realMessageApi.getMessages(userId2);
  }
};

// 发送新消息
export const sendMessage = async (senderId: number, receiverId: number, content: string): Promise<Message> => {
  if (config.useMockData) {
    // 在实际应用中，这应该是一个API调用
    const newMessage: Message = {
      id: messages.length + 1,
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    messages.push(newMessage);
    return newMessage;
  } else {
    return realMessageApi.sendMessage(receiverId, content);
  }
};

// 标记消息为已读
export const markMessagesAsRead = async (userId1: number, userId2: number): Promise<boolean> => {
  if (config.useMockData) {
    // 在实际应用中，这应该是一个API调用
    messages.forEach(msg => {
      if (msg.senderId === userId2 && msg.receiverId === userId1 && !msg.isRead) {
        msg.isRead = true;
      }
    });
    
    return true;
  } else {
    return realMessageApi.markMessagesAsRead(userId2);
  }
};

// React Query Hooks
export const useUser = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: userId > 0
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser
  });
};

export const useFollowingList = () => {
  return useQuery({
    queryKey: ['followingList'],
    queryFn: getFollowingList
  });
};

// Fix these hooks by removing direct mutation usage in components
export const useFollowUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followingList'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    }
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followingList'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    }
  });
};

export const useUserKnowledgeBases = (userId: number) => {
  return useQuery({
    queryKey: ['userKnowledgeBases', userId],
    queryFn: () => getUserKnowledgeBases(userId),
    enabled: userId !== undefined
  });
};

export const useUserKnowledgeBasesByUsername = (username: string) => {
  return useQuery({
    queryKey: ['userKnowledgeBasesByUsername', username],
    queryFn: () => getUserKnowledgeBasesByUsername(username),
    enabled: !!username
  });
};

export const useKnowledgeBase = (kbId: number) => {
  return useQuery({
    queryKey: ['knowledgeBase', kbId],
    queryFn: () => getKnowledgeBase(kbId),
    enabled: kbId > 0
  });
};

export const useAllKnowledgeBases = () => {
  return useQuery({
    queryKey: ['allKnowledgeBases'],
    queryFn: getAllKnowledgeBases
  });
};

export const useAddKnowledgeBase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addKnowledgeBase,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userKnowledgeBases', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['allKnowledgeBases'] });
    }
  });
};

export const useAddPaperToKnowledgeBase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ kbId, paper }: { kbId: number, paper: Omit<Paper, "id"> }) => 
      addPaperToKnowledgeBase(kbId, paper),
    onSuccess: (_, { kbId }) => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', kbId] });
    }
  });
};

// React Query hooks
export const useConversations = (userId: number) => {
  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => getConversations(userId),
    enabled: userId > 0
  });
};

export const useMessages = (userId1: number, userId2: number) => {
  return useQuery({
    queryKey: ['messages', userId1, userId2],
    queryFn: () => getMessages(userId1, userId2),
    enabled: userId1 > 0 && userId2 > 0
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ senderId, receiverId, content }: { senderId: number, receiverId: number, content: string }) => 
      sendMessage(senderId, receiverId, content),
    onSuccess: (_, { senderId, receiverId }) => {
      // 更新消息列表和对话列表
      queryClient.invalidateQueries({ queryKey: ['messages', senderId, receiverId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', senderId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', receiverId] });
    }
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId1, userId2 }: { userId1: number, userId2: number }) => 
      markMessagesAsRead(userId1, userId2),
    onSuccess: (_, { userId1, userId2 }) => {
      // 更新对话列表
      queryClient.invalidateQueries({ queryKey: ['conversations', userId1] });
      queryClient.invalidateQueries({ queryKey: ['conversations', userId2] });
    }
  });
};

export const useUserByUsername = (username: string) => {
  return useQuery({
    queryKey: ['user', 'byUsername', username],
    queryFn: () => getUserByUsername(username),
    enabled: !!username
  });
};

// 模拟搜索互联网论文
export const searchPapers = async (query: string): Promise<Paper[]> => {
  if (config.useMockData) {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟基于查询的论文结果
    const mockResults: Paper[] = [
      {
        id: 101,
        title: `${query}相关研究进展`,
        authors: ["张学者", "李研究"],
        abstract: `本文综述了${query}领域的最新研究进展，包括关键技术、应用场景和未来发展方向...`,
        publishDate: new Date().toISOString().split('T')[0],
        doi: `10.1234/${query.replace(/\s+/g, '-').toLowerCase()}-2023`,
        url: `https://example.com/papers/${query.replace(/\s+/g, '-').toLowerCase()}`
      },
      {
        id: 102,
        title: `${query}技术的创新应用`,
        authors: ["王创新", "赵工程"],
        abstract: `该研究提出了${query}的一种创新应用方法，显著提高了系统性能和用户体验...`,
        publishDate: new Date().toISOString().split('T')[0],
        doi: `10.5678/${query.replace(/\s+/g, '-').toLowerCase()}-application-2023`,
        url: `https://example.com/papers/${query.replace(/\s+/g, '-').toLowerCase()}-application`
      },
      {
        id: 103,
        title: `${query}未来展望与挑战`,
        authors: ["陈预测", "林分析"],
        abstract: `本文分析了${query}领域面临的关键挑战，并对未来发展趋势进行了预测...`,
        publishDate: new Date().toISOString().split('T')[0],
        doi: `10.9012/${query.replace(/\s+/g, '-').toLowerCase()}-future-2023`,
        url: `https://example.com/papers/${query.replace(/\s+/g, '-').toLowerCase()}-future`
      }
    ];
    
    return mockResults;
  } else {
    // 实际API调用
    return realPaperApi.searchPapers(query);
  }
};

// 创建知识库并添加论文
export const createKnowledgeBaseWithPapers = async (title: string, description: string, papers: Paper[], tags: string[] = []): Promise<KnowledgeBase> => {
  if (config.useMockData) {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 创建新知识库
    const newKnowledgeBase: KnowledgeBase = {
      id: Math.max(...knowledgeBases.map(kb => kb.id), 0) + 1,
      title,
      description,
      userId: currentUser.id,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      papers: papers.map((paper, index) => ({
        ...paper,
        id: 1000 + index
      })),
      tags,
      stars: 0,
      forks: 0
    };
    
    // 添加到知识库列表
    knowledgeBases.push(newKnowledgeBase);
    
    return newKnowledgeBase;
  } else {
    // 1. 创建知识库
    const kb = await realKnowledgeBaseApi.addKnowledgeBase({
      title,
      description,
      tags
    });
    
    // 2. 添加论文到知识库
    for (const paper of papers) {
      await realKnowledgeBaseApi.addPaperToKnowledgeBase(kb.id, paper);
    }
    
    // 3. 获取更新后的知识库
    return await realKnowledgeBaseApi.getKnowledgeBase(kb.id);
  }
};

export const useSearchPapers = (query: string) => {
  return useQuery({
    queryKey: ['papers', 'search', query],
    queryFn: () => searchPapers(query),
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
};

export const useCreateKnowledgeBase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, description, papers, tags }: { 
      title: string; 
      description: string; 
      papers: Paper[];
      tags?: string[];
    }) => createKnowledgeBaseWithPapers(title, description, papers, tags),
    onSuccess: () => {
      // 创建成功后，使知识库相关的查询失效，这样它们会重新获取最新数据
      queryClient.invalidateQueries({ queryKey: ['userKnowledgeBases'] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeBases'] });
    }
  });
};
