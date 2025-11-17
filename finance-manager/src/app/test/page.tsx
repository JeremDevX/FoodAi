'use client';

import { useState, useEffect } from 'react';
import { db, initializeDatabase } from '@/lib/database';
import { addTransaction, addGoal, exportData } from '@/lib/database';

export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    try {
      addResult('🧪 Starting tests...');
      
      // Test 1: Database initialization
      addResult('1️⃣ Testing database initialization...');
      await initializeDatabase();
      addResult('✅ Database initialized successfully');
      
      // Test 2: Add a transaction
      addResult('2️⃣ Testing transaction addition...');
      const testTransaction = {
        date: new Date(),
        amount: 50.00,
        description: 'Test transaction',
        category: 'Alimentation',
        account: 'Compte Principal',
        type: 'expense' as const,
        notes: 'Test notes'
      };
      
      const transactionId = await addTransaction(testTransaction);
      addResult(`✅ Transaction added with ID: ${transactionId}`);
      
      // Test 3: Retrieve transactions
      addResult('3️⃣ Testing transaction retrieval...');
      const transactions = await db.transactions.toArray();
      addResult(`✅ Retrieved ${transactions.length} transactions`);
      
      // Test 4: Add a goal
      addResult('4️⃣ Testing goal addition...');
      const testGoal = {
        name: 'Test Goal',
        targetAmount: 1000,
        currentAmount: 100,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        description: 'Test goal description',
        category: 'Test',
        image: ''
      };
      
      const goalId = await addGoal(testGoal);
      addResult(`✅ Goal added with ID: ${goalId}`);
      
      // Test 5: Export data
      addResult('5️⃣ Testing data export...');
      const exportedData = await exportData();
      addResult('✅ Data exported successfully');
      addResult(`📊 Exported data contains:`);
      addResult(`  - Transactions: ${exportedData.transactions.length}`);
      addResult(`  - Goals: ${exportedData.goals.length}`);
      addResult(`  - Categories: ${exportedData.categories.length}`);
      addResult(`  - Accounts: ${exportedData.accounts.length}`);
      
      addResult('\n🎉 All tests passed successfully!');
      
    } catch (error) {
      addResult(`❌ Test failed: ${error}`);
      console.error('Test error:', error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">🧪 Test de l'Application</h1>
          <p className="text-gray-600 mb-6">
            Cette page permet de tester les fonctionnalités principales de l'application.
          </p>
          
          <button
            onClick={runTests}
            disabled={isTesting}
            className="px-6 py-3 bg-financial-600 hover:bg-financial-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
          >
            {isTesting ? 'Tests en cours...' : 'Lancer les tests'}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Résultats des tests</h2>
            <div className="space-y-2 font-mono text-sm">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-gray-400">›</span>
                  <span className={result.includes('❌') ? 'text-danger' : result.includes('✅') ? 'text-success' : 'text-gray-700'}>
                    {result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Informations de débogage</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>Navigateur: {typeof navigator !== 'undefined' ? navigator.userAgent : 'Non disponible'}</p>
            <p>IndexedDB support: {typeof window !== 'undefined' && 'indexedDB' in window ? '✅ Disponible' : '❌ Non disponible'}</p>
            <p>LocalStorage support: {typeof window !== 'undefined' && 'localStorage' in window ? '✅ Disponible' : '❌ Non disponible'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}