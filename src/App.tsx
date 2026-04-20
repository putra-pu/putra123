/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';

// Pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const UjianManagement = React.lazy(() => import('./pages/UjianManagement'));
const BankSoal = React.lazy(() => import('./pages/BankSoal'));
const DataSiswa = React.lazy(() => import('./pages/DataSiswa'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));
const UjianSaya = React.lazy(() => import('./pages/UjianSaya'));
const TakeUjian = React.lazy(() => import('./pages/TakeUjian'));
const Absensi = React.lazy(() => import('./pages/Absensi'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Memuat Aplikasi...</p>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="ujian" element={<UjianManagement />} />
            <Route path="bank-soal" element={<BankSoal />} />
            <Route path="siswa" element={<DataSiswa />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="ujian-saya" element={<UjianSaya />} />
            <Route path="absensi" element={<Absensi />} />
          </Route>

          <Route path="/ujian/:id" element={<TakeUjian />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
