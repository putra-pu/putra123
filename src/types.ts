export type UserRole = 'admin' | 'guru' | 'staff' | 'siswa';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface Siswa {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
}

export interface Ujian {
  id: string;
  title: string;
  durasi: number;
  tanggal: string;
  created_by: string;
  created_at: string;
}

export interface Soal {
  id: string;
  ujian_id: string;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  jawaban_benar: 'A' | 'B' | 'C' | 'D';
}

export interface JawabanSiswa {
  id: string;
  siswa_id: string;
  soal_id: string;
  jawaban: 'A' | 'B' | 'C' | 'D' | null;
}

export interface Nilai {
  id: string;
  siswa_id: string;
  ujian_id: string;
  skor: number;
  finished_at: string;
}

export interface AbsensiKaryawan {
  id: string;
  user_id: string;
  tanggal: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpa';
}

export interface AbsensiSiswa {
  id: string;
  siswa_id: string;
  tanggal: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpa';
  guru_id: string;
}
