import React, { useState, useMemo } from 'react';
import { Download, FileText, Search, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import data from '../data.json';

export default function SwotAnalysis() {
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const population = data.population_2020;
  const densite = data.densite;
  const actifs = data.actifs;
  const ageGroups = data.age_groups || [];
  const pyramidData = useMemo(() => ageGroups.map(g => ({ name: g.label, men: g.men, women: -g.women })).reverse(), [ageGroups]);
  const searchFilter = items => { if (!search) return items || []; return (items||[]).filter(i => i.label.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase())); };
  const exportCSV = () => { let csv = '\ufeff'; csv += 'Section;Dimension;Libellé;Description;Impact\n'; Object.entries(data.swot).forEach(([key, arr]) => { (arr||[]).forEach(it => { csv += `${key};"${it.label}";"${it.desc}";${it.impact}\n`; }); }); const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'swot_ain_benian.csv'; a.click(); };
  const exportText = () => { let text = `ANALYSE SOCIO-DEMOGRAPHIQUE - ${data.commune}\nPopulation: ${population} | Densité: ${densite} hab/km²\n\n`; Object.entries(data.swot).forEach(([k, arr]) => { text += `== ${k.toUpperCase()} ==\n`; (arr||[]).forEach((it, idx) => { text += `${idx + 1}. ${it.label} - ${it.desc} (Impact: ${it.impact})\n`; }); text += '\n'; }); const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'swot_ain_benian.txt'; a.click(); };
  if (!data || !data.swot) { return <div className="p-10 text-red-600 font-bold">Erreur : données introuvables.</div>; }
  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow mb-6 border-t-4 border-blue-600">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Analyse socio-démographique — {data.commune}</h1>
              <p className="text-sm text-gray-600 mt-1">Données de référence : 31/12/2020 — CA Cheraga | Wilaya d'Alger</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={exportCSV} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded"><Download size={16} /> CSV</button>
              <button onClick={exportText} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded"><FileText size={16} /> TXT</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border"><div className="text-xs text-blue-600">Population</div><div className="text-2xl font-bold">{population.toLocaleString()}</div><div className="text-xs text-gray-500">habitants</div></div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border"><div className="text-xs text-purple-600">Densité</div><div className="text-2xl font-bold">{densite.toLocaleString()}</div><div className="text-xs text-gray-500">hab/km²</div></div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border"><div className="text-xs text-green-600">Population active</div><div className="text-2xl font-bold">59,26%</div><div className="text-xs text-gray-500">{actifs.toLocaleString()} actifs</div></div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border"><div className="text-xs text-orange-600">Urbanisation</div><div className="text-2xl font-bold">97,2%</div><div className="text-xs text-gray-500">taux d'urbanisation</div></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="flex items-center gap-2 border-b pb-3 mb-4">
            <button className={`px-3 py-2 rounded ${tab === 'overview' ? 'bg-slate-100' : 'hover:bg-slate-50'}`} onClick={() => setTab('overview')}>Résumé</button>
            <button className={`px-3 py-2 rounded ${tab === 'demography' ? 'bg-slate-100' : 'hover:bg-slate-50'}`} onClick={() => setTab('demography')}>Structure & pyramide</button>
            <button className={`px-3 py-2 rounded ${tab === 'projections' ? 'bg-slate-100' : 'hover:bg-slate-50'}`} onClick={() => setTab('projections')}>Projections 2030</button>
            <button className={`px-3 py-2 rounded ${tab === 'swot' ? 'bg-slate-100' : 'hover:bg-slate-50'}`} onClick={() => setTab('swot')}>SWOT</button>
            <div className="ml-auto relative"><Search size={16} className="absolute left-3 top-3 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher dans le SWOT..." className="pl-9 pr-8 py-2 border rounded w-64" />{search && <button onClick={() => setSearch('')} className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}</div>
          </div>
          {tab === 'overview' && (<div className="text-sm text-gray-700 space-y-4"><p>Ain Benian, commune littorale de 16 km², représente 29 % de la population de la CA de Cheraga. Urbanisation quasi-totale (97,2 %), densité élevée (4 734 hab/km²), forte concentration urbaine.</p><ul className="list-disc list-inside"><li>Pression sur le logement et les écoles (+3 000 logements nécessaires)</li><li>Population active très majoritaire (59,26 %)</li><li>Vieillissement progressif à anticiper</li></ul></div>)}
          {tab === 'demography' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h3 className="font-semibold mb-3">Pyramide des âges (hommes / femmes)</h3>{ageGroups.length > 0 && (<div style={{ width: '100%', height: 420 }}><ResponsiveContainer><BarChart data={pyramidData} layout="vertical" margin={{ left: 20, right: 20 }}><XAxis type="number" tickFormatter={v => Math.abs(v)} /><YAxis type="category" dataKey="name" /><Tooltip formatter={v => Math.abs(v)} /><Legend /><Bar dataKey="men" name="Hommes" stackId="a" fill="#2563eb" /><Bar dataKey="women" name="Femmes" stackId="a" fill="#fb7185" /></BarChart></ResponsiveContainer></div>)}</div><div><h3 className="font-semibold mb-3">Répartition par âge</h3><div className="space-y-2">{ageGroups.map(g => (<div key={g.label} className="flex items-center justify-between bg-slate-50 p-2 rounded"><div><div className="font-medium">{g.label}</div><div className="text-xs text-gray-500">H: {g.men.toLocaleString()} — F: {g.women.toLocaleString()}</div></div><div className="text-sm">Total: <strong>{g.total.toLocaleString()}</strong></div></div>))}</div></div></div>)}
          {tab === 'projections' && (<div className="text-sm text-gray-700"><h3 className="font-semibold mb-2">Projection 2030 (croissance 1,2 %/an)</h3><p>Population estimée : <strong>{data.projection_2030.population.toLocaleString()}</strong> habitants, soit +{data.projection_2030.extra_habitants.toLocaleString()} habitants et environ {data.projection_2030.logements_needed.toLocaleString()} logements à prévoir.</p></div>)}
          {tab === 'swot' && (<div><div className="grid grid-cols-1 md:grid-cols-4 gap-4">{Object.entries({Forces: data.swot.strengths, Faiblesses: data.swot.weaknesses, Opportunités: data.swot.opportunities, Menaces: data.swot.threats}).map(([k, arr]) => (<div key={k} className="p-3 rounded-lg shadow-sm bg-white border"><div className="flex items-center justify-between mb-2"><h4 className="font-semibold">{k}</h4><div className="text-xs text-gray-500">{(arr || []).length}</div></div><div className="space-y-2">{searchFilter(arr || []).map(it => (<div key={it.label} className="p-2 rounded border hover:bg-slate-50"><div className="flex items-start justify-between"><div><div className="font-medium">{it.label}</div><div className="text-xs text-gray-500">{it.desc}</div></div><div className="text-xs text-gray-600">{it.impact}</div></div></div>))}</div></div>))}</div><div className="mt-6 text-sm text-gray-700"><h4 className="font-semibold mb-2">Conseils de présentation</h4><ol className="list-decimal list-inside"><li>Commence par le contexte (densité, population active)</li><li>Montre la pyramide pour le pic des 35–44 ans</li><li>Explique la projection 2030 (+9 561 hab.)</li><li>Conclue avec le SWOT et 3 priorités d'action</li></ol></div></div>)}
        </div>
        <div className="text-xs text-gray-500 mt-4">Source : Données socio-démographiques au 31/12/2020 — CA Cheraga | Wilaya d’Alger</div>
      </div>
    </div>
  );
}
