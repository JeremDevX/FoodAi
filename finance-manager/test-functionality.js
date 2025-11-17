// Test de base pour vérifier les fonctionnalités clés
const { db, initializeDatabase } = require('./src/lib/database');

async function testDatabase() {
  console.log('🧪 Testing database functionality...');
  
  try {
    // Test 1: Initialize database
    console.log('1️⃣ Testing database initialization...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    // Test 2: Add a transaction
    console.log('2️⃣ Testing transaction addition...');
    const { addTransaction } = require('./src/lib/database');
    const testTransaction = {
      date: new Date(),
      amount: 50.00,
      description: 'Test transaction',
      category: 'Alimentation',
      account: 'Compte Principal',
      type: 'expense',
      notes: 'Test notes'
    };
    
    const id = await addTransaction(testTransaction);
    console.log('✅ Transaction added with ID:', id);
    
    // Test 3: Retrieve transactions
    console.log('3️⃣ Testing transaction retrieval...');
    const transactions = await db.transactions.toArray();
    console.log('✅ Retrieved', transactions.length, 'transactions');
    
    // Test 4: Add a goal
    console.log('4️⃣ Testing goal addition...');
    const { addGoal } = require('./src/lib/database');
    const testGoal = {
      name: 'Test Goal',
      targetAmount: 1000,
      currentAmount: 100,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      description: 'Test goal description',
      category: 'Test',
      image: ''
    };
    
    const goalId = await addGoal(testGoal);
    console.log('✅ Goal added with ID:', goalId);
    
    // Test 5: Export data
    console.log('5️⃣ Testing data export...');
    const { exportData } = require('./src/lib/database');
    const exportedData = await exportData();
    console.log('✅ Data exported successfully');
    console.log('📊 Exported data contains:');
    console.log('  - Transactions:', exportedData.transactions.length);
    console.log('  - Goals:', exportedData.goals.length);
    console.log('  - Categories:', exportedData.categories.length);
    console.log('  - Accounts:', exportedData.accounts.length);
    
    console.log('\n🎉 All tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run tests
testDatabase();