import {cp,mkdir,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/vendor',{recursive:true});
for(const file of ['index.html','style.css','app.js','model.js','data','README.md']) await cp(file,`dist/${file}`,{recursive:true});
await cp('node_modules/d3/dist/d3.min.js','dist/vendor/d3.min.js');
await cp('node_modules/d3/LICENSE','dist/vendor/D3-LICENSE');
console.log('Built a self-contained static city atlas.');
