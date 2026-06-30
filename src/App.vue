<template>
  <div
    class="flex h-screen w-screen bg-dark-bg text-gray-200 overflow-hidden font-sans select-none"
  >
    <!-- ================= SIDEBAR KIRI ================= -->
    <aside
      class="w-64 bg-dark-sidebar flex flex-col border-r border-gray-800 shrink-0"
    >
      <!-- Header Sidebar -->
      <div
        class="p-4 flex items-center justify-between border-b border-gray-850"
      >
        <h1
          class="text-emerald-400 font-bold tracking-wide text-lg flex items-center gap-2"
        >
          <span>📝</span> Asidiq Notes
        </h1>
        <button
          @click="createNewNote"
          class="bg-dark-green hover:bg-dark-green-light text-emerald-300 p-2 rounded-lg transition-colors duration-200 text-sm font-semibold flex items-center justify-center border border-emerald-800"
          title="Tambah Catatan Baru"
        >
          + Baru
        </button>
      </div>

      <!-- List Daftar Catatan -->
      <div class="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        <div
          v-if="notes.length === 0"
          class="text-gray-500 text-xs text-center mt-8 italic px-4"
        >
          Belum ada catatan. <br />
          Klik tombol "+ Baru" di atas.
        </div>

        <div
          v-for="note in notes"
          :key="note.id"
          @click="selectNote(note.id)"
          :class="[
            'group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150',
            activeNoteId === note.id
              ? 'bg-dark-green text-emerald-200 font-medium border border-emerald-900/50'
              : 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-200',
          ]"
        >
          <div class="flex items-center gap-2 overflow-hidden w-full mr-2">
            <span class="text-sm shrink-0">📄</span>
            <!-- Input inline untuk edit nama catatan langsung di sidebar -->
            <input
              v-model="note.title"
              @change="saveToLocalStorage"
              @click.stop
              type="text"
              class="bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-emerald-600 rounded px-1 text-sm w-full truncate cursor-text"
            />
          </div>

          <!-- Tombol Hapus Catatan (Muncul pas di-hover) -->
          <button
            @click.stop="deleteNote(note.id)"
            class="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-xs shrink-0"
            title="Hapus Catatan"
          >
            ❌
          </button>
        </div>
      </div>
    </aside>

    <!-- ================= MAIN AREA KANAN ================= -->
    <main class="flex-1 flex flex-col bg-dark-bg relative overflow-hidden">
      <!-- Jika ada catatan yang dipilih -->
      <div v-if="activeNote" class="flex-1 flex flex-col h-full">
        <!-- Header Atas Area Konten -->
        <header
          class="p-4 border-b border-gray-850 flex items-center justify-between bg-dark-sidebar/30"
        >
          <div class="flex items-center gap-3 w-2/3">
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
        <span class="text-6xl mb-4">📂</span>
        <h2 class="text-xl font-bold text-gray-400">Belum Ada Catatan Aktif</h2>
        <p class="text-sm text-gray-600 mt-1 max-w-sm">
          Silahkan pilih catatan di sidebar kiri atau klik tombol tambah baru
          buat mulai nulis ya.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// --- State Utama Aplikasi ---
const notes = ref([]);
const activeNoteId = ref(null);
const newTodoText = ref("");

// --- Computed Properties ---
const activeNote = computed(() => {
  return notes.value.find((note) => note.id === activeNoteId.value) || null;
});

// --- Lifecycle Hook ---
onMounted(() => {
  const savedNotes = localStorage.getItem("notes_data");
  const savedActiveId = localStorage.getItem("active_note_id");

  if (savedNotes) {
    notes.value = JSON.parse(savedNotes);
  }

  if (savedActiveId && notes.value.some((n) => n.id === savedActiveId)) {
    activeNoteId.value = savedActiveId;
  } else if (notes.value.length > 0) {
    activeNoteId.value = notes.value[0].id;
  }
});

// --- Fungsi-Fungsi Core Logika ---
// 1. Menyimpan data otomatis ke Local Storage Windows
const saveToLocalStorage = () => {
  localStorage.setItem("notes_data", JSON.stringify(notes.value));
  if (activeNoteId.value) {
    localStorage.setItem("active_note_id", activeNoteId.value);
  } else {
    localStorage.removeItem("active_note_id");
  }
};

// 2. Membuat Catatan Baru
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

// 3. Memilih Catatan untuk dibuka di kanan
const selectNote = (id) => {
  activeNoteId.value = id;
  saveToLocalStorage();
};

// 4. Menghapus Jurnal/Catatan
const deleteNote = (id) => {
  const index = notes.value.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes.value.splice(index, 1);
    // Alur jika catatan yang dihapus kebetulan lagi dibuka
    if (activeNoteId.value === id) {
      if (notes.value.length > 0) {
        activeNoteId.value = notes.value[0].id;
      } else {
        activeNoteId.value = null;
      }
    }
    saveToLocalStorage();
  }
};

// 5. Menambahkan Tugas/To-Do ke Catatan yang sedang Aktif
const addTodo = () => {
  if (!newTodoText.value.trim() || !activeNote.value) return;
  const newTodo = {
    id: Date.now(),
    text: newTodoText.value.trim(),
    done: false,
  };
  activeNote.value.todos.push(newTodo);
  newTodoText.value = ""; // Reset kolom input tugas
  saveToLocalStorage();
};

// 6. Menghapus Tugas/To-Do
const deleteTodo = (todoId) => {
  if (!activeNote.value) return;
  const index = activeNote.value.todos.findIndex((todo) => todo.id === todoId);
  if (index !== -1) {
    activeNote.value.todos.splice(index, 1);
    saveToLocalStorage();
  }
};
</script>

/* Custom border opacity utilitas tambahan */
<style>
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
