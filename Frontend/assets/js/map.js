var map = L.map('map').setView([43.21, 5.45], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:18,
      attribution:'© OpenStreetMap contributors'
    }).addTo(map);

    // --- Calanques ---
    var calanques = [
      { name: 'Calanque de Samena', lat:43.2202, lon:5.3514, difficulty:'Easy', comment:'Petite calanque avec galets, accessible depuis les Goudes.', trailhead:{name:'Les Goudes', lat:43.215, lon:5.345, time_min:20}},
      { name: 'Calanque de l’Esacalette', lat:43.2186, lon:5.3573, difficulty:'Easy', comment:'Petit port pittoresque.', trailhead:{name:'Les Goudes', lat:43.215, lon:5.345, time_min:15}},
      { name: 'Calanque de Callelongue', lat:43.2128, lon:5.3543, difficulty:'Easy', comment:'Extrémité sud de Marseille.', trailhead:{name:'Callelongue village', lat:43.2130, lon:5.3540, time_min:5}},
      { name: 'Calanque de Marseilleveyre', lat:43.2173, lon:5.3706, difficulty:'Medium', comment:'Belle plage de galets, accessible uniquement à pied.', trailhead:{name:'Callelongue', lat:43.2130, lon:5.3540, time_min:45}},
      { name: 'Calanque de Podestat', lat:43.2176, lon:5.3805, difficulty:'Medium', comment:'Sauvage et isolée.', trailhead:{name:'Callelongue', lat:43.2130, lon:5.3540, time_min:60}},
      { name: 'Calanque de Sormiou', lat:43.2131, lon:5.4410, difficulty:'Medium', comment:'Grande calanque avec plage de sable.', trailhead:{name:'Parking de la Cayolle', lat:43.2180, lon:5.4410, time_min:40}},
      { name: 'Calanque de Morgiou', lat:43.2129, lon:5.4433, difficulty:'Medium', comment:'Petit port et falaises.', trailhead:{name:'Les Baumettes', lat:43.2165, lon:5.4360, time_min:60}},
      { name: 'Calanque de Sugiton', lat:43.2307, lon:5.4399, difficulty:'Easy', comment:'Très fréquentée, accessible depuis Luminy.', trailhead:{name:'Campus Luminy', lat:43.2305, lon:5.4388, time_min:20}},
      { name: 'Calanque d’En-Vau', lat:43.2024, lon:5.4977, difficulty:'Hard', comment:'Superbe mais difficile d’accès.', trailhead:{name:'Col de la Gardiole', lat:43.2075, lon:5.5075, time_min:75}},
      { name: 'Calanque de Port-Pin', lat:43.2040, lon:5.5106, difficulty:'Easy', comment:'Charmante petite calanque.', trailhead:{name:'Port-Miou', lat:43.2085, lon:5.5179, time_min:30}},
      { name: 'Calanque de Port-Miou', lat:43.2084, lon:5.5179, difficulty:'Easy', comment:'La plus proche de Cassis, avec port.', trailhead:{name:'Cassis centre', lat:43.2100, lon:5.5170, time_min:10}}
    ];

    var colors = { 'Easy':'green', 'Medium':'orange', 'Hard':'red' };
    var calanquesLayers = { 'Easy': L.layerGroup(), 'Medium': L.layerGroup(), 'Hard': L.layerGroup() };

    calanques.forEach(function(c){
      var marker = L.circleMarker([c.lat,c.lon],{radius:8, color:colors[c.difficulty], fillOpacity:0.9}).bindPopup(
        '<strong>'+c.name+'</strong><br/>' + c.comment + '<br/><em>Difficulté:</em> ' + c.difficulty + '<br/>' + '<em>Sentier:</em> départ <strong>'+c.trailhead.name+'</strong> ('+c.trailhead.time_min+' min)'
      );
      marker.addTo(calanquesLayers[c.difficulty]);

      var th = L.marker([c.trailhead.lat, c.trailhead.lon]).bindPopup('<strong>Départ:</strong> '+c.trailhead.name+'<br>'+c.name);
      th.addTo(calanquesLayers[c.difficulty]);

      L.polyline([[c.trailhead.lat,c.trailhead.lon],[c.lat,c.lon]],{weight:3,opacity:0.6}).addTo(calanquesLayers[c.difficulty]);
    });

    // --- Ressources naturelles ---
    var ressources = [
      { name: 'Forêt du Parc National', type:'forest', latlngs:[[43.220,5.370],[43.225,5.375],[43.223,5.380],[43.218,5.375]] },
      { name: 'Rivière ou petit cours d’eau', type:'water', latlngs:[[43.215,5.400],[43.217,5.405],[43.219,5.402]] },
      { name: 'Plage', type:'beach', latlng:[43.2135,5.4410] }
    ];

    var colorsRessources = { 'forest':'green', 'water':'blue', 'beach':'yellow' };
    var ressourcesLayers = { 'forest': L.layerGroup(), 'water': L.layerGroup(), 'beach': L.layerGroup() };

    ressources.forEach(function(r){
      if(r.latlngs){
        L.polygon(r.latlngs,{color:colorsRessources[r.type], fillOpacity:0.4}).bindPopup('<strong>'+r.name+'</strong>').addTo(ressourcesLayers[r.type]);
      } else if(r.latlng){
        L.circleMarker(r.latlng,{radius:6,color:colorsRessources[r.type], fillOpacity:0.7}).bindPopup('<strong>'+r.name+'</strong>').addTo(ressourcesLayers[r.type]);
      }
    });

    // --- Contrôle des couches ---
    L.control.layers(
      { 'Facile': calanquesLayers['Easy'], 'Moyenne': calanquesLayers['Medium'], 'Difficile': calanquesLayers['Hard'] },
      { 'Forêt': ressourcesLayers['forest'], 'Eau': ressourcesLayers['water'], 'Plage': ressourcesLayers['beach'] },
      {collapsed:false}
    ).addTo(map);

    // --- Légende ---
    var legend = L.control({position:'bottomright'});
    legend.onAdd = function(){
      var div = L.DomUtil.create('div','legend');
      div.innerHTML = '<strong>Difficulté Calanques</strong><br/>' +
        '<i style="background:green;width:12px;height:12px;display:inline-block;margin-right:6px"></i> Facile<br/>' +
        '<i style="background:orange;width:12px;height:12px;display:inline-block;margin-right:6px"></i> Moyenne<br/>' +
        '<i style="background:red;width:12px;height:12px;display:inline-block;margin-right:6px"></i> Difficile<br/><br/>' +
        '<strong>Ressources naturelles</strong><br/>' +
        '<i style="background:green;width:12px;height:12px;display:inline-block;margin-right:6px"></i> Forêt<br/>' +
        '<i style="background:blue;width:12px;height:12px;display:inline-block;margin-right:6px"></i> Eau<br/>' +
        '<i style="background:yellow;width:12px;height:12px;display:inline-block;margin-right:6px"></i> Plage<br/>';
      return div;
    };
    legend.addTo(map);

    // --- Ajuster la vue pour inclure tout ---
    var group = L.featureGroup();
    calanques.forEach(function(c){
      group.addLayer(L.marker([c.lat,c.lon]));
      group.addLayer(L.marker([c.trailhead.lat,c.trailhead.lon]));
    });
    ressources.forEach(function(r){
      if(r.latlngs){ r.latlngs.forEach(ll=>group.addLayer(L.marker(ll))); }
      else if(r.latlng){ group.addLayer(L.marker(r.latlng)); }
    });
    map.fitBounds(group.getBounds().pad(0.2));

    // Ajouter toutes les couches calanques par défaut
    calanquesLayers['Easy'].addTo(map);
    calanquesLayers['Medium'].addTo(map);
    calanquesLayers['Hard'].addTo(map);

    // Ajouter toutes les couches ressources par défaut