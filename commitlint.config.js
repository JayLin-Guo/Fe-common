module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复bug
        'docs',     // 文档变更
        'style',    // 代码格式变更
        'refactor', // 重构
        'perf',     // 性能优化
        'test',     // 测试相关
        'chore',    // 构建过程或辅助工具的变动
        'revert',   // 回滚
        'build',    // 构建系统或外部依赖项的更改
        'ci',       // CI配置文件和脚本的更改
      ],
    ],
    'subject-max-length': [2, 'always', 72],
    'subject-case': [0],
  },
}; 