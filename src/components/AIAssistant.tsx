import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, X, MessageSquare, Bot, HelpCircle, Settings, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "你好！我是你的AI助手小美，有什么我可以帮你的吗？",
      sender: "assistant",
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // 添加用户消息
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // 模拟AI回复
    setTimeout(() => {
      const assistantMessage: Message = {
        id: messages.length + 2,
        text: getAIResponse(inputValue),
        sender: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const getAIResponse = (userInput: string): string => {
    // 简单的响应逻辑，实际应用中会连接到AI服务
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("你好") || lowerInput.includes("嗨") || lowerInput.includes("hi")) {
      return "你好！很高兴见到你！";
    } else if (lowerInput.includes("名字")) {
      return "我叫小美，是你的AI助手！";
    } else if (lowerInput.includes("功能") || lowerInput.includes("能做什么")) {
      return "我可以帮你查找视频、推荐内容、回答问题，还可以陪你聊天哦！";
    } else if (lowerInput.includes("谢谢") || lowerInput.includes("感谢")) {
      return "不客气！随时都可以来找我聊天！";
    } else if (lowerInput.includes("再见") || lowerInput.includes("拜拜")) {
      return "再见！期待下次与你聊天！";
    } else {
      return "我明白你的意思了！作为你的AI助手，我会尽力帮助你。有什么具体的问题我可以回答吗？";
    }
  };

  return (
    <>
      {/* 悬浮按钮 */}
      {!isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="relative">
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              新
            </div>
            <Avatar className="h-16 w-16 border-4 border-primary shadow-lg">
              <AvatarImage src="https://placehold.co/200x200/pink/white?text=AI助手" />
              <AvatarFallback className="bg-pink-500 text-white">AI</AvatarFallback>
            </Avatar>
          </div>
        </div>
      )}

      {/* 聊天窗口 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-[#1e1e1e] text-white p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="https://placehold.co/200x200/pink/white?text=AI助手" />
                  <AvatarFallback className="bg-pink-500 text-white">AI</AvatarFallback>
                </Avatar>
                <DialogTitle>AI助手小美</DialogTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {!isMinimized && (
            <>
              <div className="p-4 h-80 overflow-y-auto">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "assistant" && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage src="https://placehold.co/200x200/pink/white?text=AI助手" />
                        <AvatarFallback className="bg-pink-500 text-white">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user" 
                          ? "bg-primary text-white" 
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center">
                  <Input
                    placeholder="输入消息..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button 
                    className="ml-2 bg-primary text-white"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIAssistant; 