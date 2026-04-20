# Panduan Setup Database Supabase

Silakan jalankan SQL berikut di SQL Editor Supabase Anda untuk membuat tabel dan skema yang diperlukan aplikasi CBT SMK Prima Unggul.

## 1. Tabel Profil & RBAC
```sql
-- Profiles handle RBAC
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role TEXT CHECK (role IN ('admin', 'guru', 'staff', 'siswa')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (new.id, new.raw_user_meta_data->>'name', COALESCE(new.raw_user_meta_data->>'role', 'siswa'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 2. Tabel Data Siswa
```sql
CREATE TABLE siswa (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  nis TEXT UNIQUE,
  nama TEXT,
  kelas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## 3. Tabel Ujian & Soal
```sql
CREATE TABLE ujian (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  durasi INTEGER NOT NULL, -- dalam menit
  tanggal TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE soal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ujian_id UUID REFERENCES ujian(id) ON DELETE CASCADE,
  pertanyaan TEXT NOT NULL,
  opsi_a TEXT NOT NULL,
  opsi_b TEXT NOT NULL,
  opsi_c TEXT NOT NULL,
  opsi_d TEXT NOT NULL,
  jawaban_benar CHAR(1) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## 4. Tabel Jawaban & Nilai
```sql
CREATE TABLE jawaban_siswa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_id UUID REFERENCES profiles(id),
  soal_id UUID REFERENCES soal(id) ON DELETE CASCADE,
  jawaban CHAR(1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE nilai (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_id UUID REFERENCES profiles(id),
  ujian_id UUID REFERENCES ujian(id) ON DELETE CASCADE,
  skor NUMERIC NOT NULL,
  finished_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(siswa_id, ujian_id)
);
```

## 5. Tabel Absensi
```sql
CREATE TABLE absensi_karyawan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  tanggal DATE DEFAULT CURRENT_DATE,
  status TEXT CHECK (status IN ('hadir', 'izin', 'sakit', 'alpa')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE absensi_siswa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_id UUID REFERENCES profiles(id),
  tanggal DATE DEFAULT CURRENT_DATE,
  status TEXT CHECK (status IN ('hadir', 'izin', 'sakit', 'alpa')),
  guru_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## 6. Kebijakan Keamanan (RLS)
Pastikan untuk mengaktifkan RLS dan atur kebijakan akses sesuai role (admin/guru/siswa) di dashboard Supabase atau tambahkan script RLS manual.
