export const cls = (...items:(string|false|undefined|null)[]) => items.filter(Boolean).join(' ');
export const fmt = (n:number) => new Intl.NumberFormat('az-AZ').format(n);
export function downloadText(name:string, content:string){ const blob=new Blob([content],{type:'text/plain;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); URL.revokeObjectURL(a.href); }
