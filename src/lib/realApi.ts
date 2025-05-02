import { apiClient } from './apiClient';
import { User, Message, Conversation } from './types';

// 用户相关 API
export const realUserApi = {
  // 获取当前用户
  getCurrentUser: async () => {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },
  
  // 获取用户信息
  getUser: async (userId: number) => {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  },
  
  // 获取关注列表
  getFollowingList: async () => {
    const response = await apiClient.get<User[]>('/users/following');
    return response.data;
  },
  
  // 关注用户
  followUser: async (userId: number) => {
    const response = await apiClient.post<boolean>(`/users/follow/${userId}`, {});
    return response.data;
  },
  
  // 取消关注用户
  unfollowUser: async (userId: number) => {
    const response = await apiClient.post<boolean>(`/users/unfollow/${userId}`, {});
    return response.data;
  },
  
  // 检查是否已关注
  isFollowing: async (userId: number) => {
    const response = await apiClient.get<boolean>(`/users/is-following/${userId}`);
    return response.data;
  },
  
  // 通过用户名获取用户信息
  getUserByUsername: async (username: string) => {
    const response = await apiClient.get<User>(`/users/username/${username}`);
    return response.data;
  }
};

// 消息相关 API
export const realMessageApi = {
  // 获取会话列表
  getConversations: async () => {
    const response = await apiClient.get<Conversation[]>('/messages/conversations');
    return response.data;
  },
  
  // 获取与特定用户的消息
  getMessages: async (userId: number) => {
    const response = await apiClient.get<Message[]>(`/messages/${userId}`);
    return response.data;
  },
  
  // 发送消息
  sendMessage: async (receiverId: number, content: string) => {
    const response = await apiClient.post<Message>('/messages', {
      receiver_id: receiverId,
      content
    });
    return response.data;
  },
  
  // 标记消息为已读
  markMessagesAsRead: async (userId: number) => {
    const response = await apiClient.post<boolean>(`/messages/${userId}/read`, {});
    return response.data;
  }
};

// 知识库相关 API
export const realKnowledgeBaseApi = {
  // 获取用户的知识库列表
  getUserKnowledgeBases: async (userId: number) => {
    const response = await apiClient.get<any[]>(`/knowledge-bases/user/${userId}`);
    return response.data;
  },
  
  // 通过用户名获取知识库列表
  getUserKnowledgeBasesByUsername: async (username: string) => {
    const response = await apiClient.get<any[]>(`/knowledge-bases/username/${username}`);
    return response.data;
  },
  
  // 获取知识库详情
  getKnowledgeBase: async (kbId: number) => {
    const response = await apiClient.get<any>(`/knowledge-bases/${kbId}`);
    return response.data;
  },
  
  // 获取所有知识库
  getAllKnowledgeBases: async () => {
    const response = await apiClient.get<any[]>('/knowledge-bases');
    return response.data;
  },
  
  // 添加知识库
  addKnowledgeBase: async (kb: any) => {
    const response = await apiClient.post<any>('/knowledge-bases', kb);
    return response.data;
  },
  
  // 添加论文到知识库
  addPaperToKnowledgeBase: async (kbId: number, paper: any) => {
    const response = await apiClient.post<any>(`/knowledge-bases/${kbId}/papers`, paper);
    return response.data;
  }
};

// 论文相关 API
export const realPaperApi = {
  // 搜索论文
  searchPapers: async (query: string) => {
    const response = await apiClient.get<any[]>(`/papers/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
  
  // 获取论文详情
  getPaper: async (paperId: number) => {
    const response = await apiClient.get<any>(`/papers/${paperId}`);
    return response.data;
  }
}; 