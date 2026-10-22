export function normalizeCities(rows){
 return rows.map((r,index)=>({name:String(r.name),population:Number(r.population),latitude:Number(r.latitude),longitude:Number(r.longitude),id:index})).filter(r=>r.name&&Number.isFinite(r.population)&&r.population>0&&Number.isFinite(r.latitude)&&Math.abs(r.latitude)<=90&&Number.isFinite(r.longitude)&&Math.abs(r.longitude)<=180).sort((a,b)=>b.population-a.population).map((r,index)=>({...r,rank:index+1}));
}
export function filterCities(cities,query='',limit=50){
 const text=query.trim().toLowerCase();
 return cities.filter(c=>c.rank<=limit&&c.name.toLowerCase().includes(text));
}
export function radius(population){return Math.sqrt(Math.max(0,Number(population)||0)*0.00004);}
export const formatPopulation=n=>new Intl.NumberFormat('en-US').format(n);
