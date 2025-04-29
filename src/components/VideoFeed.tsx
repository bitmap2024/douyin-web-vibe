
import React, { useState, useRef, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import UserInfo from "./UserInfo";
import ActionBar from "./ActionBar";
import CommentSection from "./CommentSection";

interface Video {
  id: string;
  src: string;
  username: string;
  nickname: string;
  caption: string;
  avatarSrc: string;
  likes: number;
  comments: number;
  shares: number;
  musicName: string;
}

const DUMMY_VIDEOS: Video[] = [
  {
    id: "1",
    src: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-practicing-yoga-at-sunset-39760-large.mp4",
    username: "yogalover",
    nickname: "瑜伽达人",
    caption: "日落时分的瑜伽练习 #瑜伽 #日落 #健康",
    avatarSrc: "",
    likes: 12400,
    comments: 88,
    shares: 120,
    musicName: "原声 - yogalover创作"
  },
  {
    id: "2",
    src: "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4",
    username: "travel_world",
    nickname: "环游世界",
    caption: "美丽的海滩风景 #旅行 #海滩 #夏天",
    avatarSrc: "",
    likes: 45600,
    comments: 234,
    shares: 456,
    musicName: "夏日海滩 - 热门BGM"
  },
  {
    id: "3",
    src: "https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-seashore-with-rocks-1090-large.mp4",
    username: "drone_master",
    nickname: "航拍大师",
    caption: "航拍海岸线 #航拍 #海岸 #自然",
    avatarSrc: "",
    likes: 78900,
    comments: 543,
    shares: 876,
    musicName: "自然之声 - 纯音乐"
  },
];

const VideoFeed: React.FC = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentVideoId, setCommentVideoId] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (feedRef.current) {
      const scrollTop = feedRef.current.scrollTop;
      const videoHeight = window.innerHeight;
      const index = Math.round(scrollTop / videoHeight);
      setActiveVideoIndex(index);
    }
  };

  useEffect(() => {
    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener("scroll", handleScroll);
      return () => feedElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleCommentOpen = (videoId: string) => {
    setCommentVideoId(videoId);
    setCommentOpen(true);
  };

  return (
    <>
      <div
        ref={feedRef}
        className="h-screen w-full overflow-y-scroll snap-mandatory snap-y hide-scrollbar"
      >
        {DUMMY_VIDEOS.map((video, index) => (
          <div
            key={video.id}
            className="h-screen w-full snap-start"
          >
            <div className="relative h-full">
              <VideoPlayer
                src={video.src}
                isActive={index === activeVideoIndex}
              />
              <UserInfo
                username={video.username}
                nickname={video.nickname}
                caption={video.caption}
                avatarSrc={video.avatarSrc}
                musicName={video.musicName}
              />
              <ActionBar
                likes={video.likes}
                comments={video.comments}
                shares={video.shares}
                onComment={() => handleCommentOpen(video.id)}
              />
            </div>
          </div>
        ))}
      </div>
      <CommentSection
        isOpen={commentOpen}
        onClose={() => setCommentOpen(false)}
        videoId={commentVideoId}
      />
    </>
  );
};

export default VideoFeed;
