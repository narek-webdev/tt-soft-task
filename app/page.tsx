'use client';

import { useState } from 'react';
import Navigation from './components/Navigation/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import Quiz from './components/Quiz/Quiz';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quiz'>('dashboard');

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'dashboard' ? <Dashboard /> : <Quiz />}
    </>
  );
}
