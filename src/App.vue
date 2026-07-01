<template>
  <div
    class="flex h-screen w-screen bg-dark-bg text-gray-200 overflow-hidden font-sans"
    :class="{ 'select-none': isResizing }"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
  >
    <!-- ================= SIDEBAR KIRI ================= -->
    <Sidebar
      :notes="notes"
      :activeNoteId="activeNoteId"
      :isOpen="sidebarOpen"
      :width="sidebarWidth"
      @create-note="createNewNote"
      @select-note="selectNote"
      @delete-note="deleteNote"
      @save="saveToLocalStorage"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- ================= DIVIDER RESIZER ================= -->
    <div
      v-if="sidebarOpen"
      class="resizer-handle shrink-0"
      :class="{ 'resizer-active': isResizing }"
      @mousedown.prevent="onMouseDown"
    >
      <div class="resizer-line"></div>
    </div>

    <!-- ================= MAIN AREA KANAN ================= -->
    <MainArea
      :activeNote="activeNote"
      :sidebarOpen="sidebarOpen"
      @add-todo="addTodo"
      @delete-todo="deleteTodo"
      @save="saveToLocalStorage"
      @toggle-sidebar="toggleSidebar"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Sidebar from "./components/Sidebar.vue";
import MainArea from "./components/MainArea.vue";

// --- State Utama Aplikasi ---
const notes = ref([]);
const activeNoteId = ref(null);
const sidebarOpen = ref(true);

// --- Resizer State ---
const sidebarWidth = ref(256); // default w-64 = 256px
const isResizing = ref(false);
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

// --- Toggle Sidebar ---
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// --- Resizer Handlers ---
const onMouseDown = () => {
  isResizing.value = true;
};

const onMouseMove = (e) => {
  if (!isResizing.value) return;
  const newWidth = e.clientX;
  if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
    sidebarWidth.value = newWidth;
  } else if (newWidth < MIN_WIDTH) {
    sidebarWidth.value = MIN_WIDTH;
  } else if (newWidth > MAX_WIDTH) {
    sidebarWidth.value = MAX_WIDTH;
  }
};

const onMouseUp = () => {
  if (isResizing.value) {
    isResizing.value = false;
  }
};

// --- Computed Properties ---
const activeNote = computed(() => {
  return notes.value.find((note) => note.id === activeNoteId.value) || null;
});

// --- Lifecycle Hook ---
onMounted(() => {
  const savedNotes = localStorage.getItem("arim_notes_data");
  const savedActiveId = localStorage.getItem("arim_active_note_id");
  const savedWidth = localStorage.getItem("arim_sidebar_width");

  if (savedNotes) {
    notes.value = JSON.parse(savedNotes);
  }

  if (savedActiveId && notes.value.some((n) => n.id === savedActiveId)) {
    activeNoteId.value = savedActiveId;
  } else if (notes.value.length > 0) {
    activeNoteId.value = notes.value[0].id;
  }

  if (savedWidth) {
    sidebarWidth.value = parseInt(savedWidth);
  }
});

// --- Fungsi Core Jurnal Logika ---
const saveToLocalStorage = () => {
  localStorage.setItem("arim_notes_data", JSON.stringify(notes.value));
  localStorage.setItem("arim_sidebar_width", sidebarWidth.value.toString());
  if (activeNoteId.value) {
    localStorage.setItem("arim_active_note_id", activeNoteId.value);
  } else {
    localStorage.removeItem("arim_active_note_id");
  }
};

const createNewNote = () => {
  const newNote = {
    id: Date.now().toString(),
    title: "Catatan Baru " + (notes.value.length + 1),
    content: "",
    todos: [],
    createdAt: new Date().toISOString(),
  };
  notes.value.unshift(newNote);
  activeNoteId.value = newNote.id;
  saveToLocalStorage();
};

const selectNote = (id) => {
  activeNoteId.value = id;
  saveToLocalStorage();
};

const deleteNote = (id) => {
  const index = notes.value.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes.value.splice(index, 1);
    if (activeNoteId.value === id) {
      activeNoteId.value = notes.value.length > 0 ? notes.value[0].id : null;
    }
    saveToLocalStorage();
  }
};

const addTodo = (text) => {
  if (!activeNote.value) return;
  const newTodo = {
    id: Date.now(),
    text: text,
    done: false,
  };
  activeNote.value.todos.push(newTodo);
  saveToLocalStorage();
};

const deleteTodo = (todoId) => {
  if (!activeNote.value) return;
  const index = activeNote.value.todos.findIndex((todo) => todo.id === todoId);
  if (index !== -1) {
    activeNote.value.todos.splice(index, 1);
    saveToLocalStorage();
  }
};
</script>

<style>
/* ===== Resizer Handle ===== */
.resizer-handle {
  width: 2px;
  cursor: col-resize;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease;
}

.resizer-handle:hover,
.resizer-active {
  background-color: rgba(16, 185, 129, 0.15);
}

.resizer-line {
  width: 2px;
  height: 100%;
  background-color: rgba(55, 65, 81, 0.6);
  transition: background-color 0.15s ease;
}

.resizer-handle:hover .resizer-line,
.resizer-active .resizer-line {
  background-color: #10b981;
}
</style>
