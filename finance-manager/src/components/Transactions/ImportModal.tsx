'use client';

import { useState, useRef } from 'react';
import { parseCSV } from '@/lib/utils';
import { Transaction } from '@/types';
import { X, Upload, FileText, CheckCircle, XCircle } from 'lucide-react';

interface ImportModalProps {
  onClose: () => void;
  onImport: () => void;
}

interface ImportPreview {
  data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[];
  errors: string[];
  totalRows: number;
  validRows: number;
}

export default function ImportModal({ onClose, onImport }: ImportModalProps) {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'complete'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, number>>({});
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredFields = [
    { key: 'date', label: 'Date', required: true },
    { key: 'description', label: 'Description', required: true },
    { key: 'amount', label: 'Montant', required: true },
    { key: 'type', label: 'Type', required: true },
    { key: 'category', label: 'Catégorie', required: false },
    { key: 'account', label: 'Compte', required: false }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    
    try {
      const text = await uploadedFile.text();
      const parsed = parseCSV(text);
      
      if (parsed.length === 0) {
        alert('Le fichier est vide ou invalide');
        return;
      }

      setCsvData(parsed);
      setHeaders(parsed[0]);
      setStep('mapping');
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Erreur lors de la lecture du fichier');
    }
  };

  const handleMappingNext = () => {
    const missingRequired = requiredFields.filter(field => field.required && !mapping[field.key]);
    if (missingRequired.length > 0) {
      alert(`Veuillez mapper les champs requis: ${missingRequired.map(f => f.label).join(', ')}`);
      return;
    }

    // Generate preview
    const previewData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[] = [];
    const errors: string[] = [];

    for (let i = 1; i < Math.min(csvData.length, 21); i++) { // Preview first 20 rows
      const row = csvData[i];
      if (!row || row.every(cell => !cell.trim())) continue;

      try {
        const date = row[mapping.date];
        const description = row[mapping.description];
        const amount = parseFloat(row[mapping.amount]?.replace(',', '.') || '0');
        const type = row[mapping.type]?.toLowerCase().includes('revenu') || 
                    row[mapping.type]?.toLowerCase().includes('income') || 
                    row[mapping.type]?.toLowerCase().includes('+') ? 'income' : 'expense';
        const category = mapping.category ? row[mapping.category] : 'Autre';
        const account = mapping.account ? row[mapping.account] : 'Compte Principal';

        if (!date || !description || !amount) {
          errors.push(`Ligne ${i + 1}: Données manquantes`);
          continue;
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          errors.push(`Ligne ${i + 1}: Date invalide`);
          continue;
        }

        if (isNaN(amount) || amount <= 0) {
          errors.push(`Ligne ${i + 1}: Montant invalide`);
          continue;
        }

        previewData.push({
          date: parsedDate,
          amount: amount,
          description: description.trim(),
          category: category || 'Autre',
          account: account || 'Compte Principal',
          type: type,
          notes: '',
          tags: []
        });
      } catch (error) {
        errors.push(`Ligne ${i + 1}: ${error}`);
      }
    }

    setPreview({
      data: previewData,
      errors,
      totalRows: csvData.length - 1,
      validRows: previewData.length
    });

    setStep('preview');
  };

  const handleImport = async () => {
    if (!preview) return;

    setIsImporting(true);
    try {
      const { addTransaction } = await import('@/lib/database');
      
      // Import all valid rows (not just preview)
      const allData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[] = [];
      
      for (let i = 1; i < csvData.length; i++) {
        const row = csvData[i];
        if (!row || row.every(cell => !cell.trim())) continue;

        try {
          const date = row[mapping.date];
          const description = row[mapping.description];
          const amount = parseFloat(row[mapping.amount]?.replace(',', '.') || '0');
          const type = row[mapping.type]?.toLowerCase().includes('revenu') || 
                      row[mapping.type]?.toLowerCase().includes('income') || 
                      row[mapping.type]?.toLowerCase().includes('+') ? 'income' : 'expense';
          const category = mapping.category ? row[mapping.category] : 'Autre';
          const account = mapping.account ? row[mapping.account] : 'Compte Principal';

          if (!date || !description || !amount) continue;

          const parsedDate = new Date(date);
          if (isNaN(parsedDate.getTime())) continue;
          if (isNaN(amount) || amount <= 0) continue;

          allData.push({
            date: parsedDate,
            amount: amount,
            description: description.trim(),
            category: category || 'Autre',
            account: account || 'Compte Principal',
            type: type,
            notes: '',
            tags: []
          });
        } catch (error) {
          console.warn(`Skipping row ${i + 1}:`, error);
        }
      }

      // Add all transactions in batch
      for (const transaction of allData) {
        await addTransaction(transaction);
      }

      setStep('complete');
      onImport();
    } catch (error) {
      console.error('Error importing transactions:', error);
      alert('Erreur lors de l\'import des transactions');
    } finally {
      setIsImporting(false);
    }
  };

  const resetAndClose = () => {
    setStep('upload');
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setMapping({});
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Importer des transactions</h2>
            <button
              onClick={resetAndClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-24 h-24 bg-financial-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-12 w-12 text-financial-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Téléchargez votre fichier</h3>
                <p className="text-gray-600 mb-6">
                  Support des formats CSV, avec les colonnes : Date, Description, Montant, Type
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-financial-400 transition-colors">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-financial-600 hover:bg-financial-700 text-white rounded-lg transition-colors font-medium"
                >
                  Choisir un fichier
                </button>
                <p className="text-sm text-gray-500 mt-2">ou glissez-déposez ici</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Format attendu :</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Date : JJ/MM/AAAA ou AAAA-MM-JJ</p>
                  <p>• Montant : nombre avec . ou , comme séparateur décimal</p>
                  <p>• Type : "revenu", "dépense", "+", "-", "income", "expense"</p>
                  <p>• Les autres colonnes sont optionnelles</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Mapping */}
          {step === 'mapping' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mapper les colonnes</h3>
                <p className="text-gray-600 mb-6">
                  Associez les colonnes de votre fichier aux champs de l'application
                </p>
              </div>

              <div className="space-y-4">
                {requiredFields.map((field) => (
                  <div key={field.key} className="flex items-center space-x-4">
                    <div className="w-32">
                      <label className={`text-sm font-medium ${
                        field.required ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {field.label}
                        {field.required && <span className="text-danger ml-1">*</span>}
                      </label>
                    </div>
                    <select
                      value={mapping[field.key] || ''}
                      onChange={(e) => setMapping({...mapping, [field.key]: parseInt(e.target.value)})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-financial-500 focus:border-transparent"
                      required={field.required}
                    >
                      <option value="">Sélectionner une colonne</option>
                      {headers.map((header, index) => (
                        <option key={index} value={index}>
                          Colonne {index + 1}: {header}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setStep('upload')}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Précédent
                </button>
                <button
                  onClick={handleMappingNext}
                  className="px-6 py-2 bg-financial-600 hover:bg-financial-700 text-white rounded-lg transition-colors font-medium"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 'preview' && preview && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu de l'import</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{preview.totalRows}</div>
                    <div className="text-sm text-blue-800">Lignes totales</div>
                  </div>
                  <div className="bg-success/10 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-success">{preview.validRows}</div>
                    <div className="text-sm text-success">Lignes valides</div>
                  </div>
                  <div className="bg-danger/10 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-danger">{preview.errors.length}</div>
                    <div className="text-sm text-danger">Erreurs</div>
                  </div>
                </div>
              </div>

              {preview.errors.length > 0 && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
                  <h4 className="font-medium text-danger mb-2">Erreurs détectées :</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {preview.errors.map((error, index) => (
                      <div key={index} className="text-sm text-danger flex items-center">
                        <XCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {preview.data.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Aperçu des premières transactions :</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {preview.data.slice(0, 10).map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-success" />
                          <div>
                            <div className="font-medium text-gray-900">{transaction.description}</div>
                            <div className="text-sm text-gray-500">
                              {transaction.category} • {new Date(transaction.date).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        <div className={`font-semibold ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)} €
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setStep('mapping')}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Précédent
                </button>
                <button
                  onClick={handleImport}
                  disabled={isImporting || preview.validRows === 0}
                  className="px-6 py-2 bg-success hover:bg-success/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? 'Import en cours...' : `Importer ${preview.validRows} transactions`}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-24 h-24 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Import réussi !</h3>
                <p className="text-gray-600">
                  Vos transactions ont été importées avec succès.
                </p>
              </div>
              <button
                onClick={resetAndClose}
                className="px-6 py-2 bg-financial-600 hover:bg-financial-700 text-white rounded-lg transition-colors font-medium"
              >
                Terminer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}