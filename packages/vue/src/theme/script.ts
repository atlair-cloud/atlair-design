import { themeStorageKey } from './useTheme.ts'

export const createThemeScript = (storageKey: string = themeStorageKey) =>
  `(function(){var d=document.documentElement,p=null;try{p=localStorage.getItem(${JSON.stringify(storageKey)})}catch(e){}var t=p==='dark'||p!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.dataset.theme=t;d.style.colorScheme=t})()`
