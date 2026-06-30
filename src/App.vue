<template>
  <div
    class="flex h-screen w-screen bg-dark-bg text-gray-200 overflow-hidden font-sans select-none"
  >
    <!-- ================= SIDEBAR KIRI ================= -->
    <Sidebar
      :notes="notes"
      :activeNoteId="activeNoteId"
      @create-note="createNewNote"
      @select-note="selectNote"
      @delete-note="deleteNote"
      @save="saveToLocalStorage"
    />

    <!-- ================= MAIN AREA KANAN ================= -->
    <MainArea
      :activeNote="activeNote"
      @add-todo="addTodo"
      @delete-todo="deleteTodo"
      @save="saveToLocalStorage"
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

// --- Computed Properties ---
const activeNote = computed(() => {
  return notes.value.find((note) => note.id === activeNoteId.value) || null;
});

// --- Lifecycle Hook ---
onMounted(() => {
  const savedNotes = localStorage.getItem("arim_notes_data");
  const savedActiveId = localStorage.getItem("arim_active_note_id");

  if (savedNotes) {
    notes.value = JSON.parse(savedNotes);
  }

  if (savedActiveId && notes.value.some((n) => n.id === savedActiveId)) {
    activeNoteId.value = savedActiveId;
  } else if (notes.value.length > 0) {
    activeNoteId.value = notes.value[0].id;
  }
});

// --- Fungsi Core Jurnal Logika ---
const saveToLocalStorage = () => {
  localStorage.setItem("arim_notes_data", JSON.stringify(notes.value));
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
