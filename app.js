import {normalizeCities,filterCities,radius,formatPopulation} from './model.js';
const stateAbbreviations={Alabama:'AL',Alaska:'AK',Arizona:'AZ',Arkansas:'AR',California:'CA',Colorado:'CO',Connecticut:'CT',Delaware:'DE','District of Columbia':'DC',Florida:'FL',Georgia:'GA',Hawaii:'HI',Idaho:'ID',Illinois:'IL',Indiana:'IN',Iowa:'IA',Kansas:'KS',Kentucky:'KY',Louisiana:'LA',Maine:'ME',Maryland:'MD',Massachusetts:'MA',Michigan:'MI',Minnesota:'MN',Mississippi:'MS',Missouri:'MO',Montana:'MT',Nebraska:'NE',Nevada:'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND',Ohio:'OH',Oklahoma:'OK',Oregon:'OR',Pennsylvania:'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD',Tennessee:'TN',Texas:'TX',Utah:'UT',Vermont:'VT',Virginia:'VA',Washington:'WA','West Virginia':'WV',Wisconsin:'WI',Wyoming:'WY'};
const $=id=>document.getElementById(id); const svg=d3.select('#map');
let cities=[],selected=null,filtered=[];
const projection=d3.geoAlbersUsa().translate([500,300]).scale(1200);
function selectCity(city){
 selected=city;
 const point=projection([city.longitude,city.latitude]);
 svg.selectAll('.location-reticle').remove();
 if(point){const reticle=svg.append('g').attr('class','location-reticle').attr('aria-hidden','true').attr('transform',`translate(${point[0]},${point[1]})`);reticle.append('circle').attr('r',radius(city.population)+12);reticle.append('path').attr('d','M-44,0H-31 M31,0H44 M0,-44V-31 M0,31V44');}
 $('selected-rank').textContent=`CITY ${String(city.rank).padStart(2,'0')} / ${cities.length}`;
 $('selected-city').textContent=city.name;$('selected-population').textContent=formatPopulation(city.population);
 $('selected-coordinates').textContent=`${Math.abs(city.latitude).toFixed(2)}° ${city.latitude<0?'S':'N'} / ${Math.abs(city.longitude).toFixed(2)}° ${city.longitude<0?'W':'E'}`;
 svg.selectAll('.city-marker').classed('selected',d=>d.id===city.id).attr('aria-pressed',d=>String(d.id===city.id));
 $('city-list').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.id)===city.id)));
}
function renderFilter(){
 filtered=filterCities(cities,$('city-search').value,Number($('rank-limit').value));
 $('result-count').textContent=`${filtered.length} ${filtered.length===1?'place':'places'}`;
 $('no-results').hidden=filtered.length!==0; $('next-city').disabled=filtered.length===0;
 const visible=new Set(filtered.map(c=>c.id));
 svg.selectAll('.city-marker').attr('hidden',d=>visible.has(d.id)?null:'').attr('tabindex',d=>visible.has(d.id)?0:-1);
 $('city-list').replaceChildren(...filtered.map(city=>{
  const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.dataset.id=city.id;button.setAttribute('aria-label',`${city.rank}. ${city.name}, ${formatPopulation(city.population)} people`);
  for(const [className,value]of [['rank',String(city.rank).padStart(2,'0')],['name',city.name],['population',formatPopulation(city.population)]]){const span=document.createElement('span');span.className=className;span.textContent=value;button.append(span);}
  button.addEventListener('click',()=>selectCity(city));li.append(button);return li;
 }));
 if(filtered.length&&(!selected||!visible.has(selected.id))) selectCity(filtered[0]);
 else if(selected)selectCity(selected);
}
async function init(){try{
 const [states,rows]=await Promise.all([d3.json('./data/us-states.json'),d3.csv('./data/us-cities.csv')]);cities=normalizeCities(rows);
 projection.fitExtent([[22,25],[978,590]],states);
 const path=d3.geoPath(projection);
 svg.append('g').attr('aria-hidden','true').selectAll('path').data(states.features).join('path').attr('class','state').attr('d',path).append('title').text(d=>d.properties.name);
 svg.append('g').attr('id','labels').attr('aria-hidden','true').selectAll('text').data(states.features.filter(d=>Number.isFinite(path.centroid(d)[0]))).join('text').attr('class','state-label').attr('text-anchor','middle').attr('x',d=>path.centroid(d)[0]).attr('y',d=>path.centroid(d)[1]).text(d=>stateAbbreviations[d.properties.name]||d.properties.name);
 svg.append('g').selectAll('circle').data([...cities].reverse().filter(c=>projection([c.longitude,c.latitude]))).join('circle').attr('class','city-marker').attr('role','button').attr('tabindex',0).attr('aria-label',c=>`${c.name}, ${formatPopulation(c.population)} people. Select city.`).attr('cx',c=>projection([c.longitude,c.latitude])[0]).attr('cy',c=>projection([c.longitude,c.latitude])[1]).attr('r',c=>radius(c.population)).on('click',(_,c)=>selectCity(c)).on('keydown',(event,c)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectCity(c);}}).append('title').text(c=>`${c.name}: ${formatPopulation(c.population)}`);
 $('loading').hidden=true;renderFilter();
 $('city-search').addEventListener('input',renderFilter);$('rank-limit').addEventListener('change',renderFilter);
 $('state-labels').addEventListener('change',()=>svg.select('#labels').attr('display',$('state-labels').checked?null:'none'));
 $('reset-filters').addEventListener('click',()=>{$('city-search').value='';$('rank-limit').value='50';$('state-labels').checked=true;svg.select('#labels').attr('display',null);selected=null;renderFilter();});
 $('next-city').addEventListener('click',()=>{if(filtered.length)selectCity(filtered[(filtered.findIndex(c=>c.id===selected.id)+1)%filtered.length]);});
}catch(error){$('loading').textContent='The atlas could not load. Please refresh the page.';$('next-city').disabled=true;console.error('Unable to load the local map data',error);}}
init();
