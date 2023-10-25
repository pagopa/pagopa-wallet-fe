const npgScriptEl = document.createElement("script");
const npgDomainScript = window._env_.WALLET_NPG_SDK_URL;
npgScriptEl.setAttribute("src", npgDomainScript);
npgScriptEl.setAttribute("type", "text/javascript");
npgScriptEl.setAttribute("charset", "UTF-8");
document.head.appendChild(npgScriptEl);
