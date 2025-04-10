"use client";

import { useState } from "react";

import { SectionProps } from "../../_type/sectionprops.type";
import { useAuthStore } from "../../_store/authStore";

export const CodeUrlInput: React.FC<SectionProps> = ({
  isActive,
  onClick,
  id,
}) => {
  const [codeurl, setCodeurl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;

  const handleSubmit = async () => {
    if (!codeurl.trim()) return;

    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/problems`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ link: codeurl }),
          mode: "cors",
        }
      );

      if (response.ok) {
        alert("URL 저장 완료: " + codeurl);
        setCodeurl("");
      } else {
        const errorData = await response.json();
        alert(
          "오류가 발생했습니다: " + (errorData.message || response.statusText)
        );
      }
    } catch (error) {
      console.error("서버 요청 실패:", error);
      alert("서버 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <section
      id={id}
      className={`h-screen w-full flex justify-center items-center bg-white transition-opacity duration-500 ${
        isActive ? "opacity-100" : "opacity-50"
      }`}
      onClick={onClick}
    >
      <input
        type="text"
        placeholder={
          isAuthenticated
            ? "해결한 코테 링크를 작성해주세요..."
            : "로그인 후 사용해주세요"
        }
        value={codeurl}
        onChange={(e) => setCodeurl(e.target.value)}
        onKeyDown={handleKeyPress}
        className="w-64 p-2 border-t border-l border-b border-black rounded-l-2xl focus:outline-none"
        disabled={isLoading}
      />
      <button
        onClick={handleSubmit}
        className={`px-2 py-2 border rounded-r-2xl transition-all ${
          isAuthenticated
            ? isLoading
              ? "opacity-70 cursor-not-allowed border-blue-500 bg-blue-500 text-white"
              : "hover:bg-blue-600 border-blue-500 bg-blue-500 text-white"
            : "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={isLoading || !isAuthenticated}
      >
        {isLoading ? "전송 중..." : "전송"}
      </button>
    </section>
  );
};
