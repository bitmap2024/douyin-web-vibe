
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";

interface CommentProps {
  id: string;
  username: string;
  avatar: string;
  content: string;
  likes: number;
  timestamp: string;
}

interface CommentSectionProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const DUMMY_COMMENTS: CommentProps[] = [
  {
    id: "1",
    username: "user123",
    avatar: "",
    content: "这条视频太棒了！",
    likes: 1245,
    timestamp: "3小时前",
  },
  {
    id: "2",
    username: "douyin_fan",
    avatar: "",
    content: "哪里可以买到同款？",
    likes: 872,
    timestamp: "2小时前",
  },
  {
    id: "3",
    username: "creator_loves",
    avatar: "",
    content: "拍的真好看，请问用的什么滤镜？",
    likes: 543,
    timestamp: "1小时前",
  },
  {
    id: "4",
    username: "random_user",
    avatar: "",
    content: "跪求BGM是什么歌？",
    likes: 267,
    timestamp: "45分钟前",
  },
];

const CommentSection: React.FC<CommentSectionProps> = ({
  isOpen,
  onClose,
  videoId,
}) => {
  const [comments, setComments] = useState<CommentProps[]>(DUMMY_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const handleSendComment = () => {
    if (newComment.trim()) {
      const comment: CommentProps = {
        id: Date.now().toString(),
        username: "你自己",
        avatar: "",
        content: newComment,
        likes: 0,
        timestamp: "刚刚",
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const alreadyLiked = likedComments.has(commentId);
          const newLikes = alreadyLiked ? comment.likes - 1 : comment.likes + 1;

          // Update the set of liked comments
          const newLikedComments = new Set(likedComments);
          if (alreadyLiked) {
            newLikedComments.delete(commentId);
          } else {
            newLikedComments.add(commentId);
          }
          setLikedComments(newLikedComments);

          return { ...comment, likes: newLikes };
        }
        return comment;
      })
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] p-0 rounded-t-xl">
        <SheetHeader className="px-4 py-4 border-b">
          <SheetTitle className="text-center">
            {comments.length} 条评论
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto h-[calc(80vh-140px)] px-4 py-2">
          {comments.map((comment) => (
            <div key={comment.id} className="flex py-3">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={comment.avatar} />
                <AvatarFallback>{comment.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{comment.username}</p>
                <p className="text-md py-0.5">{comment.content}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{comment.timestamp}</span>
                  <button
                    className="ml-4 flex items-center"
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    回复
                  </button>
                </div>
              </div>
              <button
                className="flex flex-col items-center justify-center ml-2"
                onClick={() => handleLikeComment(comment.id)}
              >
                <Heart
                  size={16}
                  fill={likedComments.has(comment.id) ? "hsl(var(--primary))" : "transparent"}
                  className={
                    likedComments.has(comment.id) ? "text-primary" : "text-muted-foreground"
                  }
                />
                <span className="text-xs mt-1 text-muted-foreground">
                  {comment.likes}
                </span>
              </button>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t bg-background px-4 py-2">
          <div className="flex space-x-2">
            <Input
              placeholder="添加评论..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSendComment}>发送</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommentSection;
