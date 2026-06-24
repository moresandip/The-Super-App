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
    const db = getLocalStorageItem("super_app_users_db", {});
    const usernameKey = userData.username.toLowerCase();
    
    if (!db[usernameKey]) {
      db[usernameKey] = {
        user: userData,
        categories: [],
        notes: "",
        apiKeys: { omdb: "", openweather: "" }
      };
    } else {
      db[usernameKey].user = userData;
    }
    
    localStorage.setItem("super_app_users_db", JSON.stringify(db));
    localStorage.setItem("super_app_user", JSON.stringify(userData));
    localStorage.setItem("super_app_categories", JSON.stringify(db[usernameKey].categories));
    localStorage.setItem("super_app_notes", db[usernameKey].notes);
    localStorage.setItem("super_app_api_keys", JSON.stringify(db[usernameKey].apiKeys));
    
    set({ 
      user: userData,
      categories: db[usernameKey].categories,
      notes: db[usernameKey].notes,
      apiKeys: db[usernameKey].apiKeys
    });
  },
  
  setCategories: (categoryArray) => {
    const activeUser = useStore.getState().user;
    if (activeUser && activeUser.username) {
      const db = getLocalStorageItem("super_app_users_db", {});
      const usernameKey = activeUser.username.toLowerCase();
      if (db[usernameKey]) {
        db[usernameKey].categories = categoryArray;
        localStorage.setItem("super_app_users_db", JSON.stringify(db));
      }
    }
    localStorage.setItem("super_app_categories", JSON.stringify(categoryArray));
    set({ categories: categoryArray });
  },
  
  setNotes: (noteText) => {
    const activeUser = useStore.getState().user;
    if (activeUser && activeUser.username) {
      const db = getLocalStorageItem("super_app_users_db", {});
      const usernameKey = activeUser.username.toLowerCase();
      if (db[usernameKey]) {
        db[usernameKey].notes = noteText;
        localStorage.setItem("super_app_users_db", JSON.stringify(db));
      }
    }
    localStorage.setItem("super_app_notes", noteText);
    set({ notes: noteText });
  },

  setApiKeys: (keys) => {
    const activeUser = useStore.getState().user;
    if (activeUser && activeUser.username) {
      const db = getLocalStorageItem("super_app_users_db", {});
      const usernameKey = activeUser.username.toLowerCase();
      if (db[usernameKey]) {
        db[usernameKey].apiKeys = keys;
        localStorage.setItem("super_app_users_db", JSON.stringify(db));
      }
    }
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
