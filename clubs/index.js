grist.ready({
    requiredTables: ['Associations', 'Contacts']
});
  
grist.onRecord(function(record) {
    Object.assign(record, record.API);
  
    document.getElementById('card-asso').style.display = 'none';
    document.getElementById('card-rna').style.display = 'none';
  
    if(!record.RNA) {
      document.getElementById("btn-jo").setAttribute('href','https://www.journal-officiel.gouv.fr/pages/associations-recherche/?disjunctive.source&sort=cronosort&q=' + record.Nom);
      document.getElementById("btn-rna").addEventListener("click", function(){
        updateRecord(record, {
          RNA: document.getElementById("input-rna").value
        });
        
        document.getElementById('card-rna').style.display = 'none';
      });
  
      document.getElementById('card-rna').style.display = 'block';
    }else{
      document.getElementById("asso-nom").textContent = record.Nom;
      document.getElementById("asso-categorie").textContent = record.Categorie;
      document.getElementById("asso-description").textContent = record.Description;
  
      const btnSite = document.getElementById("asso-link-site");
      const btnEmail = document.getElementById("asso-link-email");
      btnSite.style.display = 'none';
      btnEmail.style.display = 'none';
  
      if(record.Site) {
        btnSite.setAttribute("href", record.Site);
        btnSite.style.display = 'inline';
      }
      if(record.Courriel) {
        btnEmail.setAttribute("href", 'mailto:' + record.Courriel);
        btnEmail.style.display = 'inline';
      }
  
      document.getElementById("asso-categorie").className = 'badge text-bg-' + getColor(record.Categorie);
  
      if(record.Contacts == null) {
        document.getElementById('section-contacts').style.display = 'none';
      }else{
        const contacts = [];
        record.Contacts.forEach(contact => {
          contacts.push(contact.Libelle);
        });
        if(contacts.length > 0) {
          document.getElementById('asso-contacts').textContent = contacts.join(', ');
          document.getElementById('section-contacts').style.display = 'block';
        }else{
          document.getElementById('section-contacts').style.display = 'none';
        }
      }
  
      document.getElementById('card-asso').style.display = 'block';
    }
    
    //document.getElementById('debug').innerHTML = JSON.stringify(record, null, 2);
  });
  
  function getColor(text) {
    const colors = {
      'patriotique': 'danger',
      'sportive': 'success',
      'culturelle': 'info',
      'diverse': 'warning'
    };
    return colors[text.toLowerCase()] || 'primary';
  }
  
  function updateRecord (record, data) {
    grist
      .getTable()
      .getTableId()
      .then((tableId) => {
        grist.docApi
          .applyUserActions([["UpdateRecord", tableId, record.id, data]])
          .then(() => {
            console.log("Record successfully updated");
          })
          .catch((err) => {
            console.error("Failed to update record", err);
          });
      });
  };