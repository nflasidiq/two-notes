<template>
  <aside
    class="bg-dark-sidebar flex flex-col border-r border-gray-800 shrink-0 overflow-hidden"
    :class="{ 'sidebar-closing': !isOpen }"
    :style="{ width: isOpen ? width + 'px' : '0px' }"
  >
    <!-- Wrapper isi sidebar (supaya konten gak ikut kecil pas collapse) -->
    <div class="h-full flex flex-col" :style="{ minWidth: width + 'px' }">
      <!-- Header Sidebar -->
      <div
        class="p-4 flex items-center justify-between border-b border-gray-850"
      >
        <button
          @click="createNewNote"
          class="bg-dark-green hover:bg-dark-green-light text-emerald-300 p-2 rounded-lg transition-colors duration-200 text-sm font-semibold flex items-center justify-center border border-emerald-800"
          title="Tambah Catatan Baru"
        >
          + Baru
        </button>
        <!-- Tombol Close Sidebar -->
        <button
          @click="toggleSidebar"
          class="text-gray-500 hover:text-emerald-400 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
          title="Tutup Sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <polyline points="15 8 12 12 15 16" />
          </svg>
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
            'group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 relative',
            activeNoteId === note.id
              ? 'bg-dark-green text-emerald-200 font-medium border border-emerald-900/50'
              : 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-200',
          ]"
        >
          <div class="flex items-center gap-2 overflow-hidden w-full mr-2">
            <span class="text-sm shrink-0">📄</span>
            <!-- Input inline untuk edit nama catatan -->
            <input
              :ref="(el) => setNoteInputRef(note.id, el)"
              v-model="note.title"
              @change="saveToLocalStorage"
              @click.stop
              @keyup.enter="finishEditing"
              @blur="finishEditing"
              type="text"
              :readonly="editingNoteId !== note.id"
              :class="[
                'bg-transparent border-none focus:outline-none rounded px-1 py-1 text-sm w-full truncate',
                editingNoteId === note.id
                  ? 'ring-1 ring-emerald-600 cursor-text bg-gray-900/50'
                  : 'cursor-pointer',
              ]"
            />
          </div>

          <!-- Tombol 3 Titik Menu -->
          <button
            @click.stop="toggleMenu(note.id)"
            class="text-gray-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-150 p-1 rounded-md hover:bg-gray-700/50 shrink-0"
            :class="{ 'opacity-100': openMenuId === note.id }"
            title="Opsi Catatan"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <Transition name="dropdown">
            <div
              v-if="openMenuId === note.id"
              class="absolute right-2 top-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 py-1 min-w-[160px] overflow-hidden"
            >
              <!-- Edit Nama -->
              <button
                @click.stop="startEditing(note.id)"
                class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 hover:bg-gray-700/70 hover:text-emerald-400 transition-colors duration-100 text-left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
                Edit Nama
              </button>
              <!-- Hapus Catatan -->
              <button
                @click.stop="confirmDelete(note.id, note.title)"
                class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 hover:bg-red-900/30 hover:text-red-400 transition-colors duration-100 text-left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                Hapus Catatan
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- ===== MODAL KONFIRMASI HAPUS ===== -->
    <Transition name="modal">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        @click.self="cancelDelete"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <!-- Modal Box -->
        <div
          class="relative bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 z-10"
        >
          <!-- Icon Peringatan -->
          <div class="flex justify-center mb-4">
            <div
              class="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f87171"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </div>
          </div>

          <h3 class="text-lg font-bold text-white text-center mb-2">
            Hapus Catatan?
          </h3>
          <p class="text-sm text-gray-400 text-center mb-6 leading-relaxed">
            Kamu yakin ingin menghapus
            <span class="text-emerald-400 font-semibold"
              >"{{ deleteTargetTitle }}"</span
            >? <br />Catatan yang dihapus tidak bisa dikembalikan.
          </p>

          <!-- Tombol Aksi -->
          <div class="flex gap-3">
            <button
              @click="cancelDelete"
              class="flex-1 px-4 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors duration-150 text-sm font-medium"
            >
              Batal
            </button>
            <button
              @click="executeDelete"
              class="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors duration-150 text-sm font-semibold"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </aside>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from "vue";

defineProps({
  notes: { type: Array, required: true },
  activeNoteId: { type: String, default: null },
  isOpen: { type: Boolean, default: true },
  width: { type: Number, default: 256 },
});

const emit = defineEmits([
  "create-note",
  "select-note",
  "delete-note",
  "save",
  "toggle-sidebar",
]);

// --- Dropdown Menu State ---
const openMenuId = ref(null);

// --- Edit Nama State ---
const editingNoteId = ref(null);
const noteInputRefs = {};

const setNoteInputRef = (id, el) => {
  if (el) noteInputRefs[id] = el;
};

// --- Delete Modal State ---
const showDeleteModal = ref(false);
const deleteTargetId = ref(null);
const deleteTargetTitle = ref("");

// --- Dropdown Menu Functions ---
const toggleMenu = (noteId) => {
  openMenuId.value = openMenuId.value === noteId ? null : noteId;
};

const closeMenu = () => {
  openMenuId.value = null;
};

// --- Edit Nama Functions ---
const startEditing = (noteId) => {
  closeMenu();
  editingNoteId.value = noteId;
  nextTick(() => {
    const input = noteInputRefs[noteId];
    if (input) {
      input.readOnly = false;
      input.focus();
      input.select();
    }
  });
};

const finishEditing = () => {
  editingNoteId.value = null;
  saveToLocalStorage();
};

// --- Delete Functions ---
const confirmDelete = (noteId, noteTitle) => {
  closeMenu();
  deleteTargetId.value = noteId;
  deleteTargetTitle.value = noteTitle;
  showDeleteModal.value = true;
};

const executeDelete = () => {
  if (deleteTargetId.value) {
    emit("delete-note", deleteTargetId.value);
  }
  cancelDelete();
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  deleteTargetId.value = null;
  deleteTargetTitle.value = "";
};

// --- Click Outside Handler ---
const handleClickOutside = (e) => {
  if (openMenuId.value !== null) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// --- Wrapper functions ---
const createNewNote = () => emit("create-note");
const selectNote = (id) => emit("select-note", id);
const saveToLocalStorage = () => emit("save");
const toggleSidebar = () => emit("toggle-sidebar");
</script>

<style scoped>
.border-gray-850 {
  border-color: rgba(31, 41, 55, 0.6);
}
.sidebar-closing {
  transition: width 0.3s ease-in-out;
  border-right-width: 0;
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

/* Dropdown Animation */
.dropdown-enter-active {
  transition: all 0.15s ease-out;
}
.dropdown-leave-active {
  transition: all 0.1s ease-in;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
}

/* Modal Animation */
.modal-enter-active {
  transition: all 0.2s ease-out;
}
.modal-leave-active {
  transition: all 0.15s ease-in;
}
.modal-enter-from {
  opacity: 0;
}
.modal-enter-from > .relative {
  transform: scale(0.9);
}
.modal-leave-to {
  opacity: 0;
}
</style>
