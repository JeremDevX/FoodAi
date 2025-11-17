'use client';

import { useFinanceStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#f97316', '#6b7280'];

export default function MonthlyOverview() {
  const { getMonthlyStats, getCategoryStats } = useFinanceStore();
  const stats = getMonthlyStats();
  const categoryStats = getCategoryStats();

  const pieData = categoryStats.map((stat, index) => ({
    name: stat.category,
    value: Math.abs(stat.amount),
    color: COLORS[index % COLORS.length]
  }));

  const barData = categoryStats.slice(0, 6).map(stat => ({
    category: stat.category,
    amount: Math.abs(stat.amount)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Summary Cards */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenus</h3>
            <div className="p-2 bg-success/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
          </div>
          <div className="text-3xl font-bold text-success">
            {formatCurrency(stats.income)}
          </div>
          <div className="text-sm text-gray-500 mt-1">Ce mois-ci</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Dépenses</h3>
            <div className="p-2 bg-danger/10 rounded-lg">
              <TrendingDown className="h-5 w-5 text-danger" />
            </div>
          </div>
          <div className="text-3xl font-bold text-danger">
            {formatCurrency(stats.expenses)}
          </div>
          <div className="text-sm text-gray-500 mt-1">Ce mois-ci</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Solde</h3>
            <div className="p-2 bg-financial-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-financial-600" />
            </div>
          </div>
          <div className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(stats.balance)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {stats.balance >= 0 ? 'Excédent' : 'Déficit'}
          </div>
        </div>
      </div>

      {/* Category Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des Dépenses</h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            Aucune donnée à afficher
          </div>
        )}
        
        {/* Legend */}
        <div className="mt-4 space-y-2">
          {pieData.slice(0, 4).map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-700">{entry.name}</span>
              </div>
              <span className="font-medium text-gray-900">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Dépenses par Catégorie</h3>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${Number(value) / 1000}k`}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar 
                dataKey="amount" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            Aucune donnée à afficher
          </div>
        )}
      </div>
    </div>
  );
}