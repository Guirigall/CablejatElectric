let preference='system';try{const saved=globalThis.document&&globalThis.localStorage?.getItem('bord-theme');if(['system','light','dark'].includes(saved))preference=saved}catch{}
const media=globalThis.matchMedia?.('(prefers-color-scheme: dark)');
export const getThemePreference=()=>preference;
export const getEffectiveTheme=()=>preference==='system'?(media?.matches?'dark':'light'):preference;
export function setTheme(value){if(!['system','light','dark'].includes(value))return;preference=value;try{globalThis.localStorage?.setItem('bord-theme',value)}catch{}globalThis.document?.documentElement?.setAttribute('data-theme',getEffectiveTheme());const picker=globalThis.document?.querySelector?.('#theme');if(picker)picker.value=value}
export function initTheme(){const picker=globalThis.document?.querySelector?.('#theme');if(picker)picker.onchange=()=>setTheme(picker.value);setTheme(preference);media?.addEventListener?.('change',()=>{if(preference==='system')setTheme('system')})}
