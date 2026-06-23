import { create } from "zustand";

// Helper to safe-parse JSON from local storage
const getLocalStorageItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return fallback;
  }
};

export const useStore = create((set) => ({
  user: getLocalStorageItem("super_app_user", {
    name: "",
    username: "",
    email: "",
    mobile: "",
  }),
  categories: getLocalStorageItem("super_app_categories", []),
  notes: localStorage.getItem("super_app_notes") || "",
  apiKeys: getLocalStorageItem("super_app_api_keys", {
    omdb: "",
    openweather: "",
  }),

  setUser: (userData) => {
    localStorage.setItem("super_app_user", JSON.stringify(userData));
    set({ user: userData });
  },
  
  setCategories: (categoryArray) => {
    localStorage.setItem("super_app_categories", JSON.stringify(categoryArray));
    set({ categories: categoryArray });
  },
  
  setNotes: (noteText) => {
    localStorage.setItem("super_app_notes", noteText);
    set({ notes: noteText });
  },

  setApiKeys: (keys) => {
    localStorage.setItem("super_app_api_keys", JSON.stringify(keys));
    set({ apiKeys: keys });
  },

  resetStore: () => {
    localStorage.removeItem("super_app_user");
    localStorage.removeItem("super_app_categories");
    localStorage.removeItem("super_app_notes");
    localStorage.removeItem("super_app_api_keys");
    set({
      user: { name: "", username: "", email: "", mobile: "" },
      categories: [],
      notes: "",
      apiKeys: { omdb: "", openweather: "" }
    });
  }
}));
