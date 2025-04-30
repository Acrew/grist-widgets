document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('section-alerts').style.display = 'none';
  if (!window.grist) {
    alert("Cette vue nécessite Grist pour fonctionner");
  }
  const Mustache = require('mustache');
});

grist.ready({
    requiredTables: ['Associations', 'Contacts'],
    requiredAccess: 'full',
    allowSelectBy: true
});
  
grist.onRecord(function(record) {
    Object.assign(record, record.API);
    let first = {'tab' : 0, 'content' : 0};
    
    const template = document.getElementById('template-club').innerHTML;
    const rendered = Mustache.render(template, { record,
      'displayPhone' : function(){return this.match(/.{2}/g).join('.');},
      'color' : function(){return getColor(record.Categorie)},
      'firstTab' : function(){first['tab']++; return (first['tab']==1);},
      'firstContent' : function(){first['content']++; return (first['content']==1);},
      'contactsExists' : function(){return (record.Contacts !== null);}
    });
    document.getElementById('section-association').innerHTML = rendered;

    if(!record.RNA) {
      document.getElementById("btn-jo").setAttribute('href','https://www.journal-officiel.gouv.fr/pages/associations-recherche/?disjunctive.source&sort=cronosort&q=' + record.Nom);
      document.getElementById("btn-rna").addEventListener("click", function(){
        updateRecord(record, {
          RNA: document.getElementById("input-rna").value
        });
      });
    }
});

function alert(message, type) {
  const types = {
    'danger': 'danger',
    'success': 'success',
    'info': 'info',
    'warning': 'warning'
  };
  type = types[type.toLowerCase()] || 'danger';

  let alerts = document.getElementById('section-alerts').innerHTML;
  document.getElementById('section-alerts').style.display = 'block';
  const template = document.getElementById('template-alert').innerHTML;
  const rendered = Mustache.render(template, { message, type });
  document.getElementById('section-alerts').innerHTML = alerts + rendered;
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