document.addEventListener('DOMContentLoaded', () => {
  if (!window.grist) {
    alert("Cette vue nécessite Grist pour fonctionner");
  }
  const Mustache = require('mustache');
});

grist.ready({
    requiredTables: ['Entreprises'],
    requiredAccess: 'full',
    allowSelectBy: true
});

grist.onRecord(function(record) {
    Object.assign(record, record.API);
    const template = document.getElementById('template').innerHTML;
    const rendered = Mustache.render(template, { 
      record, 
      'displayPhone' : function(){return this.match(/.{2}/g).join('.');},
      'displayColor' : function(){let color = 'dark'; const colors = {
        'Commerces' : 'success',
        'Services' : 'info',
        'Services de santé' : 'primary',
        'Artisans' : 'danger',
        'Agriculture, élevage' : 'warning',
        'Artistes' : 'light',
        'Divers' : 'secondary'
      };
      if(colors[record.API.Activite.Categorie] !== undefined) {
        color = colors[record.API.Activite.Categorie];
      }
      return color;
      }
    });
    document.getElementById('page').innerHTML = rendered;

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});