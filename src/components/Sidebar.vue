<template>
  <aside
    class="w-64 bg-dark-sidebar flex flex-col border-r border-gray-800 shrink-0"
  >
    <!-- Header Sidebar -->
    <div class="p-4 flex items-center justify-between border-b border-gray-850">
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
</template>

<script setup>
defineProps({
  notes: { type: Array, required: true },
  activeNoteId: { type: String, default: null },
});

const emit = defineEmits(["create-note", "select-note", "delete-note", "save"]);

// Wrapper functions supaya template bisa manggil dengan nama yang sesuai
const createNewNote = () => emit("create-note");
const selectNote = (id) => emit("select-note", id);
const deleteNote = (id) => emit("delete-note", id);
const saveToLocalStorage = () => emit("save");
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
