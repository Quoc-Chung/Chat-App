import { useNavigate } from "react-router-dom";
import { stories } from "./Story";
import { useState, useEffect } from "react";

const StatusViewer = () => {
  /*- Chỉ số của story hiện tại -*/ 
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  /*- phần trăm tiến trình của story hiện tại -*/ 
  const [progress, setProgress] = useState(0);

  /* khoảng thời gian chạy một ảnh */ 
  const duration = 3000;
  const navigate = useNavigate(); 

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStoryIndex((prevIndex) => (prevIndex + 1) % stories.length);
          return 0;
        }
        return prev + 100 / (duration / 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [currentStoryIndex]);

  /*- Điều hướng story quay lại trước -*/ 
  const handlePrevStory = () => {
    setProgress(0);
    setCurrentStoryIndex((prevIndex) =>
      prevIndex === 0 ? stories.length - 1 : prevIndex - 1
    );
  };

  /*- Điều hướng story sau -*/ 
  const handleNextStory = () => {
    setProgress(0);
    setCurrentStoryIndex((prevIndex) => (prevIndex + 1) % stories.length);
  };

  const handleNavigate = () => {
    navigate("/status")
  }

  return (
    <div className="flex items-center justify-center h-screen bg-slate-700">
      <div className="relative w-[28vw] h-[95vh] rounded-xl overflow-hidden bg-black shadow-2xl">
        {/* Nút thoát */}
        <div onClick={handleNavigate} className="absolute flex items-center justify-center w-10 h-10 bg-white border-none rounded-full top-5 right-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="text-black size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Thanh tiến trình */}
        <div className="absolute z-10 flex gap-1 top-2 left-2 right-2">
          {stories.map((story, idx) => (
            <div
              key={idx}
              className="flex-1 h-[3px] bg-gray-400 rounded overflow-hidden"
            >
              <div
                className="h-full transition-all duration-100 bg-white"
                style={{
                  width:
                    idx === currentStoryIndex
                      ? `${progress}%`
                      : idx < currentStoryIndex
                        ? "100%"
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Nút trái */}
        <div
          className="absolute z-10 -translate-y-1/2 cursor-pointer top-1/2 left-4"
          onClick={handlePrevStory}
        >
          <div className="p-2 bg-white rounded-full bg-opacity-20 hover:bg-opacity-40 backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </div>

        {/* Nút phải */}
        <div
          className="absolute z-10 -translate-y-1/2 cursor-pointer top-1/2 right-4"
          onClick={handleNextStory}
        >
          <div className="p-2 bg-white rounded-full bg-opacity-20 hover:bg-opacity-40 backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Hình ảnh story */}
        <img
          className="object-cover w-full h-full"
          src={stories[currentStoryIndex].image}
          alt={`story-${currentStoryIndex}`}
        />
      </div>
    </div>
  );
};

export default StatusViewer;
