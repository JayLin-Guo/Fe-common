<template>
  <div id="app" class="playground-app">
    <!-- 头部导航 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <h1>UI 公共组件库</h1>
        </div>
        <nav class="header-nav">
          <a
            href="https://github.com/JayLin-Guo/Fe-common"
            target="_blank"
            class="nav-link"
          >
            <Icon icon="mdi:github" />
            GitHub
          </a>
        </nav>
      </div>
    </header>

    <!-- 主体内容 -->
    <div class="app-body">
      <!-- 左侧边栏 -->
      <aside class="sidebar">
        <nav class="sidebar-nav">
          <div class="nav-section">
            <h3 class="section-title">组件展示</h3>
            <ul class="nav-list">
              <li class="nav-item">
                <router-link to="/components" class="nav-link">
                  <Icon icon="mdi:view-grid" />
                  组件库
                </router-link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <!-- 右侧内容区域 -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
</script>

<style lang="scss" scoped>
.playground-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

// 头部样式
.app-header {
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 100;
  flex-shrink: 0;

  .header-content {
    height: 100%;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .header-nav {
    display: flex;
    align-items: center;
    gap: 16px;

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      color: #64748b;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s ease;
      font-size: 14px;
      font-weight: 500;

      &:hover {
        background: #f1f5f9;
        color: #334155;
      }

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
}

// 主体内容
.app-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

// 左侧边栏
.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  flex-shrink: 0;
  overflow-y: auto;

  .sidebar-nav {
    padding: 24px 0;

    .nav-section {
      margin-bottom: 32px;

      .section-title {
        margin: 0 0 16px 0;
        padding: 0 24px;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .nav-list {
        list-style: none;
        margin: 0;
        padding: 0;

        .nav-item {
          .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 24px;
            color: #64748b;
            text-decoration: none;
            transition: all 0.2s ease;
            font-size: 14px;
            font-weight: 500;
            border-left: 3px solid transparent;

            &:hover {
              background: #f8fafc;
              color: #334155;
              border-left-color: #e2e8f0;
            }

            &.active {
              background: #eff6ff;
              color: #2563eb;
              border-left-color: #2563eb;
              font-weight: 600;

              svg {
                color: #2563eb;
              }
            }

            svg {
              width: 20px;
              height: 20px;
              flex-shrink: 0;
            }
          }
        }
      }
    }
  }
}

// 主内容区域
.main-content {
  flex: 1;
  overflow: hidden;
  background: #f8fafc;
}

// 响应式设计
@media (max-width: 768px) {
  .app-header {
    .header-content {
      padding: 0 16px;
    }

    .logo h1 {
      font-size: 18px;
    }
  }

  .sidebar {
    width: 200px;

    .sidebar-nav {
      padding: 16px 0;

      .nav-section {
        .section-title {
          padding: 0 16px;
          font-size: 12px;
        }

        .nav-list .nav-item .nav-link {
          padding: 10px 16px;
          font-size: 13px;
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .app-body {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;

    .sidebar-nav {
      padding: 12px 0;

      .nav-section {
        margin-bottom: 0;

        .nav-list {
          display: flex;
          gap: 8px;
          padding: 0 16px;

          .nav-item .nav-link {
            padding: 8px 16px;
            border-radius: 8px;
            border-left: none;
            white-space: nowrap;

            &.active {
              background: #2563eb;
              color: white;
            }
          }
        }
      }
    }
  }
}
</style>
