# Migration "Compte Principal" → "Compte Courant"

## 📌 Instructions

Le système de comptes a été mis à jour. Si vous aviez des transactions avec "Compte Principal", suivez ces étapes pour les migrer vers "Compte Courant" :

### Option 1 : Migration Automatique (Recommandé)

1. **Ouvrez l'application** dans votre navigateur
2. **Ouvrez la console JavaScript** (F12 ou Cmd+Option+I sur Mac)
3. **Copiez et collez** le script suivant dans la console :

```javascript
// Script de migration automatique
(async function migrateAccountNames() {
  console.log("🔄 Début de la migration des noms de comptes...");

  try {
    const dbRequest = indexedDB.open("FinanceManager", 1);

    dbRequest.onsuccess = async (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["transactions"], "readwrite");
      const store = transaction.objectStore("transactions");

      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        const transactions = getAllRequest.result;
        let updatedCount = 0;

        transactions.forEach((transaction) => {
          let needsUpdate = false;

          if (transaction.account === "Compte Principal") {
            transaction.account = "Compte Courant";
            needsUpdate = true;
          }

          if (transaction.fromAccount === "Compte Principal") {
            transaction.fromAccount = "Compte Courant";
            needsUpdate = true;
          }

          if (transaction.toAccount === "Compte Principal") {
            transaction.toAccount = "Compte Courant";
            needsUpdate = true;
          }

          if (needsUpdate) {
            store.put(transaction);
            updatedCount++;
          }
        });

        transaction.oncomplete = () => {
          console.log(
            `✅ Migration terminée ! ${updatedCount} transactions mises à jour.`
          );
          alert(
            `Migration réussie ! ${updatedCount} transaction(s) mise(s) à jour.\n\nLa page va se recharger.`
          );
          setTimeout(() => window.location.reload(), 1000);
        };
      };
    };

    dbRequest.onerror = () => {
      console.error("❌ Erreur lors de l'ouverture de la base de données");
      alert("Erreur lors de la migration. Veuillez réessayer.");
    };
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
    alert("Erreur lors de la migration : " + error.message);
  }
})();
```

4. **Appuyez sur Entrée** pour exécuter le script
5. La page se rechargera automatiquement après la migration

### Option 2 : Migration Manuel le

Si vous préférez ne pas utiliser le script :

1. **Exportez vos données** via le bouton d'export dans le header
2. **Ouvrez le fichier JSON** avec un éditeur de texte
3. **Recherchez et remplacez** toutes les occurrences de `"Compte Principal"` par `"Compte Courant"`
4. **Sauvegardez** le fichier
5. **Importez** le fichier modifié via le bouton d'import

### ✅ Vérification

Après la migration, vous devriez voir :

- Toutes vos transactions dans "Compte Courant"
- Le sélecteur de compte affiche correctement les soldes
- Aucune transaction dans "Compte Principal"

### 🆘 Support

Si vous rencontrez des problèmes :

1. Assurez-vous d'avoir exporté vos données avant la migration
2. Vérifiez que le script s'exécute sans erreur dans la console
3. En cas de problème, restaurez votre backup via l'import

---

**Note :** Le système reconnaît automatiquement "Compte Principal" comme "Compte Courant" pour l'affichage des soldes, mais la migration est recommandée pour la cohérence des données.
