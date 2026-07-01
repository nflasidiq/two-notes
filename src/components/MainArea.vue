<template>
  <main class="flex-1 flex flex-col bg-dark-bg relative overflow-hidden">
    <!-- Jika ada catatan yang dipilih -->
    <div v-if="activeNote" class="flex-1 flex flex-col h-full">
      <!-- Header Atas Area Konten -->
      <header
        class="p-4 border-b border-gray-850 flex items-center justify-between bg-dark-sidebar/30"
      >
        <div class="flex items-center gap-3 w-2/3">
          <!-- Tombol Hamburger (Muncul kalau sidebar ditutup) -->
          <button
            v-if="!sidebarOpen"
            @click="toggleSidebar"
            class="text-gray-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-gray-800/50 transition-all duration-200 shrink-0"
            title="Buka Sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <input
            v-model="activeNote.title"
            @input="saveToLocalStorage"
            type="text"
            class="bg-transparent font-bold text-xl border-none focus:outline-none text-white w-full"
            placeholder="Judul Catatan..."
          />
        </div>
      </header>

      <!-- Area Isi Konten (Bisa Teks Panjang & To-Do List sekaligus) -->
      <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <!-- BAGIAN 1: Catatan Teks Panjang -->
        <section class="space-y-2">
          <label
            class="text-xs font-semibold text-emerald-500 tracking-wider uppercase flex items-center gap-1.5"
          >
            <span>✍️</span> Catatan
          </label>
          <textarea
            v-model="activeNote.content"
            @input="saveToLocalStorage"
            class="w-full min-h-[180px] bg-gray-900/50 border border-gray-800 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 rounded-xl p-4 text-gray-200 placeholder-gray-600 focus:outline-none resize-none leading-relaxed text-sm shadow-inner"
            placeholder="Ketik apa apapun di sini..."
          ></textarea>
        </section>

        <!-- BAGIAN 2: To-Do List Ceklis -->
        <section class="space-y-3">
          <label
            class="text-xs font-semibold text-emerald-500 tracking-wider uppercase flex items-center gap-1.5"
          >
            <span>✅</span> To-Do List
          </label>

          <!-- Input Buat Tambah To-Do Baru -->
          <div class="flex gap-2">
            <input
              v-model="newTodoText"
              @keyup.enter="addTodo"
              type="text"
              class="flex-1 bg-gray-900/50 border border-gray-800 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none"
              placeholder="Tambah tugas baru lalu tekan Enter..."
            />
            <button
              @click="addTodo"
              class="bg-dark-green hover:bg-dark-green-light text-emerald-300 px-4 py-2.5 rounded-xl border border-emerald-800 text-sm font-semibold transition-colors duration-150"
            >
              Tambah
            </button>
          </div>

          <!-- Daftar Item To-Do -->
          <div
            class="mt-4 bg-gray-900/30 border border-gray-850 rounded-xl divide-y divide-gray-850 overflow-hidden shadow-sm"
          >
            <div
              v-if="activeNote.todos.length === 0"
              class="p-4 text-center text-sm text-gray-600"
            >
              Belum ada tugas di catatan ini
            </div>

            <div
              v-for="todo in activeNote.todos"
              :key="todo.id"
              class="flex items-center justify-between p-3.5 hover:bg-gray-800/30 transition-colors duration-100 group/todo"
            >
              <div class="flex items-center gap-3 flex-1 mr-4">
                <!-- Checkbox Custom -->
                <input
                  type="checkbox"
                  v-model="todo.done"
                  @change="saveToLocalStorage"
                  class="w-4 h-4 rounded border-gray-700 bg-gray-800 text-emerald-600 focus:ring-emerald-900 cursor-pointer accent-emerald-600"
                />
                <!-- Teks To-Do (Jika dicoret/done, pakai kelas line-through) -->
                <input
                  v-model="todo.text"
                  @change="saveToLocalStorage"
                  type="text"
                  :class="[
                    'bg-transparent border-none focus:outline-none w-full text-sm transition-all duration-150',
                    todo.done
                      ? 'line-through text-gray-600 italic'
                      : 'text-gray-300',
                  ]"
                />
              </div>

              <!-- Hapus Item To-Do -->
              <button
                @click="deleteTodo(todo.id)"
                class="text-gray-600 hover:text-red-400 opacity-0 group-hover/todo:opacity-100 transition-opacity p-1 text-xs shrink-0"
                title="Hapus Tugas"
              >
                🗑️
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Tampilan Default Jika Belum Ada Catatan yang Dipilih/Dibuat -->
    <div
      v-else
      class="flex-1 flex flex-col items-center justify-center p-8 text-center select-none"
    >
      <!-- Tombol Hamburger di pojok kiri atas kalau sidebar ditutup -->
      <button
        v-if="!sidebarOpen"
        @click="toggleSidebar"
        class="absolute top-4 left-4 text-gray-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
        title="Buka Sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <span class="text-6xl mb-4">📂</span>
      <h2 class="text-xl font-bold text-gray-400">Belum Ada Catatan Aktif</h2>
      <p class="text-sm text-gray-600 mt-1 max-w-sm">
        Silahkan pilih catatan di sidebar kiri atau klik tombol tambah baru buat
        mulai nulis ya.
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  activeNote: { type: Object, default: null },
  sidebarOpen: { type: Boolean, default: true },
});

const emit = defineEmits(["add-todo", "delete-todo", "save", "toggle-sidebar"]);

// Variabel untuk input to-do baru (sesuai dengan v-model di template)
const newTodoText = ref("");

// Wrapper functions supaya template bisa manggil dengan benar
const addTodo = () => {
  if (!newTodoText.value.trim()) return;
  emit("add-todo", newTodoText.value.trim());
  newTodoText.value = "";
};

const deleteTodo = (todoId) => {
  emit("delete-todo", todoId);
};

const saveToLocalStorage = () => {
  emit("save");
};

const toggleSidebar = () => {
  emit("toggle-sidebar");
};
</script>

<style scoped>
.border-gray-850 {
  border-color: rgba(31, 41, 55, 0.6);
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #2a2a2a;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #1b5e34;
}
</style>
