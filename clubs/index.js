document.addEventListener('DOMContentLoaded', () => {
  if (!window.grist) {
    error("Cette vue nécessite Grist pour fonctionner");
  }
  document.getElementById('alert').style.display = 'none';
  displaySection('droits');
});

grist.ready({
    requiredTables: ['Associations', 'Contacts'],
    requiredAccess: 'full',
    allowSelectBy: true
});
  
grist.onRecord(function(record) {
    Object.assign(record, record.API);
  
    displaySection('asso');
  
    if(!record.RNA) {
      document.getElementById("btn-jo").setAttribute('href','https://www.journal-officiel.gouv.fr/pages/associations-recherche/?disjunctive.source&sort=cronosort&q=' + record.Nom);
      document.getElementById("btn-rna").addEventListener("click", function(){
        updateRecord(record, {
          RNA: document.getElementById("input-rna").value
        });
        
        displaySection('asso');
      });
  
      displaySection('rna');
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

function displaySection(section) {
    const sections = ['droits','rna','asso'];
    sections.forEach((s) => {
        if(section == s) {
            document.getElementById('section-' + s).style.display = 'block';
        }else{
            document.getElementById('section-' + s).style.display = 'none';
        }
    });
}

function error(msg) {
  document.getElementById('alert-message').innerHTML(msg);
  document.getElementById('alert').style.display = 'block';
}

function updateRecord(record, data) {
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