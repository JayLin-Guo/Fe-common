// Vue3 公共类型定义
import type { CSSProperties } from 'vue';

export interface BaseComponentProps {
  class?: string;
  style?: CSSProperties;
}

export type Size = 'small' | 'medium' | 'large';
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type Theme = 'light' | 'dark'; 