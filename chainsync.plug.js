var mod=(()=>{var h=Object.defineProperty;var L=Object.getOwnPropertyDescriptor;var O=Object.getOwnPropertyNames;var E=Object.prototype.hasOwnProperty;var g=(e,r)=>{for(var n in r)h(e,n,{get:r[n],enumerable:!0})},D=(e,r,n,o)=>{if(r&&typeof r=="object"||typeof r=="function")for(let i of O(r))!E.call(e,i)&&i!==n&&h(e,i,{get:()=>r[i],enumerable:!(o=L(r,i))||o.enumerable});return e};var $=e=>D(h({},"__esModule",{value:!0}),e);var De={};g(De,{functionMapping:()=>U});function k(e){let r=atob(e),n=r.length,o=new Uint8Array(n);for(let i=0;i<n;i++)o[i]=r.charCodeAt(i);return o}function q(e,r){return syscall("sandboxFetch.fetch",e,r)}function M(){globalThis.nativeFetch=globalThis.fetch,globalThis.fetch=async function(e,r){let n=await q(e,r&&{method:r.method,headers:r.headers,body:r.body});return new Response(n.base64Body?k(n.base64Body):null,{status:n.status,headers:n.headers})}}typeof Deno>"u"&&(self.Deno={args:[],build:{arch:"x86_64"},env:{get(){}}});var v=new Map,y=0;function m(e){self.postMessage(e)}self.syscall=async(e,...r)=>await new Promise((n,o)=>{y++,v.set(y,{resolve:n,reject:o}),m({type:"sys",id:y,name:e,args:r})});function A(e,r){self.addEventListener("message",n=>{(async()=>{let o=n.data;switch(o.type){case"inv":{let i=e[o.name];if(!i)throw new Error(`Function not loaded: ${o.name}`);try{let s=await Promise.resolve(i(...o.args||[]));m({type:"invr",id:o.id,result:s})}catch(s){console.error(s),m({type:"invr",id:o.id,error:s.message})}}break;case"sysr":{let i=o.id,s=v.get(i);if(!s)throw Error("Invalid request id");v.delete(i),o.error?s.reject(new Error(o.error)):s.resolve(o.result)}break}})().catch(console.error)}),m({type:"manifest",manifest:r})}M();var d={};g(d,{confirm:()=>ce,dispatch:()=>se,downloadFile:()=>X,filterBox:()=>Z,flashNotification:()=>Y,fold:()=>fe,foldAll:()=>me,getCurrentPage:()=>W,getCursor:()=>K,getSelection:()=>Q,getText:()=>j,getUiOption:()=>le,hidePanel:()=>re,insertAtCursor:()=>ie,insertAtPos:()=>te,moveCursor:()=>oe,navigate:()=>z,openUrl:()=>J,prompt:()=>ae,reloadPage:()=>G,reloadUI:()=>H,replaceRange:()=>ne,save:()=>_,setPage:()=>B,setSelection:()=>V,setUiOption:()=>de,showPanel:()=>ee,toggleFold:()=>ge,unfold:()=>pe,unfoldAll:()=>Pe,vimEx:()=>ue});typeof self>"u"&&(self={syscall:()=>{throw new Error("Not implemented here")}});var t=self.syscall;function W(){return t("editor.getCurrentPage")}function B(e){return t("editor.setPage",e)}function j(){return t("editor.getText")}function K(){return t("editor.getCursor")}function Q(){return t("editor.getSelection")}function V(e,r){return t("editor.setSelection",e,r)}function _(){return t("editor.save")}function z(e,r,n=!1,o=!1){return t("editor.navigate",e,r,n,o)}function G(){return t("editor.reloadPage")}function H(){return t("editor.reloadUI")}function J(e,r=!1){return t("editor.openUrl",e,r)}function X(e,r){return t("editor.downloadFile",e,r)}function Y(e,r="info"){return t("editor.flashNotification",e,r)}function Z(e,r,n="",o=""){return t("editor.filterBox",e,r,n,o)}function ee(e,r,n,o=""){return t("editor.showPanel",e,r,n,o)}function re(e){return t("editor.hidePanel",e)}function te(e,r){return t("editor.insertAtPos",e,r)}function ne(e,r,n){return t("editor.replaceRange",e,r,n)}function oe(e,r=!1){return t("editor.moveCursor",e,r)}function ie(e){return t("editor.insertAtCursor",e)}function se(e){return t("editor.dispatch",e)}function ae(e,r=""){return t("editor.prompt",e,r)}function ce(e){return t("editor.confirm",e)}function le(e){return t("editor.getUiOption",e)}function de(e,r){return t("editor.setUiOption",e,r)}function ue(e){return t("editor.vimEx",e)}function fe(){return t("editor.fold")}function pe(){return t("editor.unfold")}function ge(){return t("editor.toggleFold")}function me(){return t("editor.foldAll")}function Pe(){return t("editor.unfoldAll")}var f={};g(f,{parseMarkdown:()=>he});function he(e){return t("markdown.parseMarkdown",e)}var u={};g(u,{deleteAttachment:()=>Fe,deletePage:()=>we,getAttachmentMeta:()=>Ae,getPageMeta:()=>ve,listAttachments:()=>Me,listPages:()=>ye,listPlugs:()=>ke,readAttachment:()=>Re,readPage:()=>Te,writeAttachment:()=>Ce,writePage:()=>be});function ye(e=!1){return t("space.listPages",e)}function ve(e){return t("space.getPageMeta",e)}function Te(e){return t("space.readPage",e)}function be(e,r){return t("space.writePage",e,r)}function we(e){return t("space.deletePage",e)}function ke(){return t("space.listPlugs")}function Me(){return t("space.listAttachments")}function Ae(e){return t("space.getAttachmentMeta",e)}function Re(e){return t("space.readAttachment",e)}function Ce(e,r){return t("space.writeAttachment",e,r)}function Fe(e){return t("space.deleteAttachment",e)}function R(e,r){if(r(e))return[e];let n=[];if(e.children)for(let o of e.children)n=[...n,...R(o,r)];return n}function T(e,r){if(e.children){let n=e.children.slice();for(let o of n){let i=r(o);if(i!==void 0){let s=e.children.indexOf(o);i?e.children.splice(s,1,i):e.children.splice(s,1)}else T(o,r)}}}function P(e,r){return R(e,n=>n.type===r)[0]}function b(e){let r=[];if(e.text!==void 0)return e.text;for(let n of e.children)r.push(b(n));return r.join("")}function C(e,r){return!(r.from>=e.to||e.from>=r.to)}function S(e,r,n=!1){if(F(e)&&!F(r)){let o=e.split("/")[0];return n&&(o=Le(o)),`${o}/${r}`}else return r}function Le(e){return e=e.substring(1),e.startsWith("localhost")?e="http://"+e:e="https://"+e,e}function F(e){return e.startsWith("!")}function w(e,r,n){if(e.from===void 0||e.to===void 0)return console.warn("findNodeTypeInRange: Node does not have a defined range  ",e),null;if(C(n,e)){if(e.type===r)return e;if(e.children)for(let o of e.children){let i=w(o,r,n);if(i)return i}}return null}async function Oe(e,r,n){if(e===await d.getCurrentPage())d.dispatch({changes:{...n,insert:r}});else{let o=await u.readPage(e),i=o.slice(0,n.from)+r+o.slice(n.to);await u.writePage(e,i)}}async function N(e){let r=await d.getCurrentPage(),n=await d.getText(),o=await f.parseMarkdown(n);for await(let i of e.changes){let s=w(o,"Task",i.newRange);if(s){console.log("found task ",s);let a;if(T(s,c=>{if(c.type==="WikiLink"&&(console.log("found wiki link ",c),P(c,"WikiLinkAlias")?.children[0].text==="\u{1F517}")){let l=P(c,"WikiLinkPage");console.log("found chain link page = ",l);try{let[x,I]=S(r,l.children[0].text).split("@");return a={page:x,pos:Number.parseInt(I,10)},null}catch(x){console.log(x)}}return c}),a){console.log(`chain link to "${a.page}@${a.pos}" from "${r}"`);let c,p;console.log("hi"),a.page!==r?(c=await u.readPage(a.page),p=await f.parseMarkdown(c)):(c=n,p=o);let l=w(p,"Task",{from:a.pos,to:a.pos+1});l&&l.from!==void 0&&l.to!==void 0&&await Oe(a.page,b(s),l)}console.log(s)}}}var U={onPageModified:N},Ee={name:"chainsync",functions:{onPageModified:{path:"./chainsync.ts:onPageModified",events:["editor:pageModified"]}},assets:{}};A(U,Ee);return $(De);})();
