export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* 个人资料卡片 */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* 头像 */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
            A
          </div>

          {/* 个人信息 */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              博客作者
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              全栈开发者 | 技术爱好者 | 开源贡献者
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              热爱编程，喜欢分享技术心得和生活感悟。专注于 Web 开发、云计算和人工智能领域。
            </p>
          </div>
        </div>
      </section>

      {/* 技能展示 */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          技术栈
        </h2>
        <div className="flex flex-wrap gap-3">
          {["Next.js", "React", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "Git", "Docker", "AWS", "Python"].map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* 联系方式 */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          联系方式
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-300 font-medium w-24">
              邮箱：
            </span>
            <a
              href="mailto:example@example.com"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              example@example.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-300 font-medium w-24">
              GitHub：
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              github.com/yourusername
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}