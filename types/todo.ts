export interface Todo {
  id: string;
  // Support both legacy "text" and new "content" fields
  text?: string;
  content?: string;
  title?: string;
  completed?: boolean;
  createdAt: Date | string;
}

export type Note = {
  id: string;
  // add other properties as needed, e.g. title: string;
  createdAt: Date | string;
  text?: string;
  content?: string;
  title?: string;
  completed?: boolean;
  [key: string]: unknown;
};
