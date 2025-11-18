// Script de migration pour renommer "Compte Principal" en "Compte Courant"
// À exécuter dans la console du navigateur

async function migrateAccountNames() {
  console.log("🔄 Début de la migration des noms de comptes...");

  try {
    // Ouvrir la base de données
    const dbRequest = indexedDB.open("FinanceManager", 1);

    dbRequest.onsuccess = async (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["transactions"], "readwrite");
      const store = transaction.objectStore("transactions");

      // Lire toutes les transactions
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        const transactions = getAllRequest.result;
        let updatedCount = 0;

        transactions.forEach((transaction) => {
          let needsUpdate = false;

          // Mettre à jour le champ account
          if (transaction.account === "Compte Principal") {
            transaction.account = "Compte Courant";
            needsUpdate = true;
          }

          // Mettre à jour fromAccount pour les transferts
          if (transaction.fromAccount === "Compte Principal") {
            transaction.fromAccount = "Compte Courant";
            needsUpdate = true;
          }

          // Mettre à jour toAccount pour les transferts
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
          console.log("🔄 Rechargement de la page...");
          setTimeout(() => window.location.reload(), 1000);
        };
      };

      getAllRequest.onerror = () => {
        console.error("❌ Erreur lors de la lecture des transactions");
      };
    };

    dbRequest.onerror = () => {
      console.error("❌ Erreur lors de l'ouverture de la base de données");
    };
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
  }
}

// Instructions pour l'utilisateur
console.log(`
═══════════════════════════════════════════════════════
  MIGRATION DES NOMS DE COMPTES
═══════════════════════════════════════════════════════

Pour migrer automatiquement "Compte Principal" vers "Compte Courant":

1. Copiez et exécutez cette commande dans la console :
   
   migrateAccountNames()

2. La page se rechargera automatiquement après la migration

═══════════════════════════════════════════════════════
`);
