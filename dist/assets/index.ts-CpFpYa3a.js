import{s as N,D as M,g as w}from"./storage-BT_x06Oc.js";var L;(function(e){e.STRING="string",e.NUMBER="number",e.INTEGER="integer",e.BOOLEAN="boolean",e.ARRAY="array",e.OBJECT="object"})(L||(L={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var x;(function(e){e.LANGUAGE_UNSPECIFIED="language_unspecified",e.PYTHON="python"})(x||(x={}));var G;(function(e){e.OUTCOME_UNSPECIFIED="outcome_unspecified",e.OUTCOME_OK="outcome_ok",e.OUTCOME_FAILED="outcome_failed",e.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"})(G||(G={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D=["user","model","function","system"];var O;(function(e){e.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",e.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",e.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",e.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",e.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",e.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY"})(O||(O={}));var v;(function(e){e.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",e.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",e.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",e.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",e.BLOCK_NONE="BLOCK_NONE"})(v||(v={}));var U;(function(e){e.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",e.NEGLIGIBLE="NEGLIGIBLE",e.LOW="LOW",e.MEDIUM="MEDIUM",e.HIGH="HIGH"})(U||(U={}));var H;(function(e){e.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",e.SAFETY="SAFETY",e.OTHER="OTHER"})(H||(H={}));var A;(function(e){e.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",e.STOP="STOP",e.MAX_TOKENS="MAX_TOKENS",e.SAFETY="SAFETY",e.RECITATION="RECITATION",e.LANGUAGE="LANGUAGE",e.BLOCKLIST="BLOCKLIST",e.PROHIBITED_CONTENT="PROHIBITED_CONTENT",e.SPII="SPII",e.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",e.OTHER="OTHER"})(A||(A={}));var F;(function(e){e.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",e.RETRIEVAL_QUERY="RETRIEVAL_QUERY",e.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",e.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",e.CLASSIFICATION="CLASSIFICATION",e.CLUSTERING="CLUSTERING"})(F||(F={}));var k;(function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.AUTO="AUTO",e.ANY="ANY",e.NONE="NONE"})(k||(k={}));var B;(function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.MODE_DYNAMIC="MODE_DYNAMIC"})(B||(B={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f extends Error{constructor(t){super(`[GoogleGenerativeAI Error]: ${t}`)}}class m extends f{constructor(t,n){super(t),this.response=n}}class J extends f{constructor(t,n,s,o){super(t),this.status=n,this.statusText=s,this.errorDetails=o}}class _ extends f{}class W extends f{}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z="https://generativelanguage.googleapis.com",ee="v1beta",te="0.24.1",ne="genai-js";var p;(function(e){e.GENERATE_CONTENT="generateContent",e.STREAM_GENERATE_CONTENT="streamGenerateContent",e.COUNT_TOKENS="countTokens",e.EMBED_CONTENT="embedContent",e.BATCH_EMBED_CONTENTS="batchEmbedContents"})(p||(p={}));class se{constructor(t,n,s,o,i){this.model=t,this.task=n,this.apiKey=s,this.stream=o,this.requestOptions=i}toString(){var t,n;const s=((t=this.requestOptions)===null||t===void 0?void 0:t.apiVersion)||ee;let i=`${((n=this.requestOptions)===null||n===void 0?void 0:n.baseUrl)||Z}/${s}/${this.model}:${this.task}`;return this.stream&&(i+="?alt=sse"),i}}function oe(e){const t=[];return e!=null&&e.apiClient&&t.push(e.apiClient),t.push(`${ne}/${te}`),t.join(" ")}async function ie(e){var t;const n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",oe(e.requestOptions)),n.append("x-goog-api-key",e.apiKey);let s=(t=e.requestOptions)===null||t===void 0?void 0:t.customHeaders;if(s){if(!(s instanceof Headers))try{s=new Headers(s)}catch(o){throw new _(`unable to convert customHeaders value ${JSON.stringify(s)} to Headers: ${o.message}`)}for(const[o,i]of s.entries()){if(o==="x-goog-api-key")throw new _(`Cannot set reserved header name ${o}`);if(o==="x-goog-api-client")throw new _(`Header name ${o} can only be set using the apiClient field`);n.append(o,i)}}return n}async function re(e,t,n,s,o,i){const r=new se(e,t,n,s,i);return{url:r.toString(),fetchOptions:Object.assign(Object.assign({},de(i)),{method:"POST",headers:await ie(r),body:o})}}async function S(e,t,n,s,o,i={},r=fetch){const{url:a,fetchOptions:c}=await re(e,t,n,s,o,i);return ae(a,c,r)}async function ae(e,t,n=fetch){let s;try{s=await n(e,t)}catch(o){ce(o,e)}return s.ok||await le(s,e),s}function ce(e,t){let n=e;throw n.name==="AbortError"?(n=new W(`Request aborted when fetching ${t.toString()}: ${e.message}`),n.stack=e.stack):e instanceof J||e instanceof _||(n=new f(`Error fetching from ${t.toString()}: ${e.message}`),n.stack=e.stack),n}async function le(e,t){let n="",s;try{const o=await e.json();n=o.error.message,o.error.details&&(n+=` ${JSON.stringify(o.error.details)}`,s=o.error.details)}catch{}throw new J(`Error fetching from ${t.toString()}: [${e.status} ${e.statusText}] ${n}`,e.status,e.statusText,s)}function de(e){const t={};if((e==null?void 0:e.signal)!==void 0||(e==null?void 0:e.timeout)>=0){const n=new AbortController;(e==null?void 0:e.timeout)>=0&&setTimeout(()=>n.abort(),e.timeout),e!=null&&e.signal&&e.signal.addEventListener("abort",()=>{n.abort()}),t.signal=n.signal}return t}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function b(e){return e.text=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),T(e.candidates[0]))throw new m(`${C(e)}`,e);return ue(e)}else if(e.promptFeedback)throw new m(`Text not available. ${C(e)}`,e);return""},e.functionCall=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),T(e.candidates[0]))throw new m(`${C(e)}`,e);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),Y(e)[0]}else if(e.promptFeedback)throw new m(`Function call not available. ${C(e)}`,e)},e.functionCalls=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),T(e.candidates[0]))throw new m(`${C(e)}`,e);return Y(e)}else if(e.promptFeedback)throw new m(`Function call not available. ${C(e)}`,e)},e}function ue(e){var t,n,s,o;const i=[];if(!((n=(t=e.candidates)===null||t===void 0?void 0:t[0].content)===null||n===void 0)&&n.parts)for(const r of(o=(s=e.candidates)===null||s===void 0?void 0:s[0].content)===null||o===void 0?void 0:o.parts)r.text&&i.push(r.text),r.executableCode&&i.push("\n```"+r.executableCode.language+`
`+r.executableCode.code+"\n```\n"),r.codeExecutionResult&&i.push("\n```\n"+r.codeExecutionResult.output+"\n```\n");return i.length>0?i.join(""):""}function Y(e){var t,n,s,o;const i=[];if(!((n=(t=e.candidates)===null||t===void 0?void 0:t[0].content)===null||n===void 0)&&n.parts)for(const r of(o=(s=e.candidates)===null||s===void 0?void 0:s[0].content)===null||o===void 0?void 0:o.parts)r.functionCall&&i.push(r.functionCall);if(i.length>0)return i}const fe=[A.RECITATION,A.SAFETY,A.LANGUAGE];function T(e){return!!e.finishReason&&fe.includes(e.finishReason)}function C(e){var t,n,s;let o="";if((!e.candidates||e.candidates.length===0)&&e.promptFeedback)o+="Response was blocked",!((t=e.promptFeedback)===null||t===void 0)&&t.blockReason&&(o+=` due to ${e.promptFeedback.blockReason}`),!((n=e.promptFeedback)===null||n===void 0)&&n.blockReasonMessage&&(o+=`: ${e.promptFeedback.blockReasonMessage}`);else if(!((s=e.candidates)===null||s===void 0)&&s[0]){const i=e.candidates[0];T(i)&&(o+=`Candidate was blocked due to ${i.finishReason}`,i.finishMessage&&(o+=`: ${i.finishMessage}`))}return o}function R(e){return this instanceof R?(this.v=e,this):new R(e)}function he(e,t,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var s=n.apply(e,t||[]),o,i=[];return o={},r("next"),r("throw"),r("return"),o[Symbol.asyncIterator]=function(){return this},o;function r(l){s[l]&&(o[l]=function(d){return new Promise(function(u,I){i.push([l,d,u,I])>1||a(l,d)})})}function a(l,d){try{c(s[l](d))}catch(u){E(i[0][3],u)}}function c(l){l.value instanceof R?Promise.resolve(l.value.v).then(h,g):E(i[0][2],l)}function h(l){a("next",l)}function g(l){a("throw",l)}function E(l,d){l(d),i.shift(),i.length&&a(i[0][0],i[0][1])}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function ge(e){const t=e.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),n=_e(t),[s,o]=n.tee();return{stream:Ce(s),response:Ee(o)}}async function Ee(e){const t=[],n=e.getReader();for(;;){const{done:s,value:o}=await n.read();if(s)return b(Ie(t));t.push(o)}}function Ce(e){return he(this,arguments,function*(){const n=e.getReader();for(;;){const{value:s,done:o}=yield R(n.read());if(o)break;yield yield R(b(s))}})}function _e(e){const t=e.getReader();return new ReadableStream({start(s){let o="";return i();function i(){return t.read().then(({value:r,done:a})=>{if(a){if(o.trim()){s.error(new f("Failed to parse stream"));return}s.close();return}o+=r;let c=o.match($),h;for(;c;){try{h=JSON.parse(c[1])}catch{s.error(new f(`Error parsing JSON response: "${c[1]}"`));return}s.enqueue(h),o=o.substring(c[0].length),c=o.match($)}return i()}).catch(r=>{let a=r;throw a.stack=r.stack,a.name==="AbortError"?a=new W("Request aborted when reading from the stream"):a=new f("Error reading from the stream"),a})}}})}function Ie(e){const t=e[e.length-1],n={promptFeedback:t==null?void 0:t.promptFeedback};for(const s of e){if(s.candidates){let o=0;for(const i of s.candidates)if(n.candidates||(n.candidates=[]),n.candidates[o]||(n.candidates[o]={index:o}),n.candidates[o].citationMetadata=i.citationMetadata,n.candidates[o].groundingMetadata=i.groundingMetadata,n.candidates[o].finishReason=i.finishReason,n.candidates[o].finishMessage=i.finishMessage,n.candidates[o].safetyRatings=i.safetyRatings,i.content&&i.content.parts){n.candidates[o].content||(n.candidates[o].content={role:i.content.role||"user",parts:[]});const r={};for(const a of i.content.parts)a.text&&(r.text=a.text),a.functionCall&&(r.functionCall=a.functionCall),a.executableCode&&(r.executableCode=a.executableCode),a.codeExecutionResult&&(r.codeExecutionResult=a.codeExecutionResult),Object.keys(r).length===0&&(r.text=""),n.candidates[o].content.parts.push(r)}o++}s.usageMetadata&&(n.usageMetadata=s.usageMetadata)}return n}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function X(e,t,n,s){const o=await S(t,p.STREAM_GENERATE_CONTENT,e,!0,JSON.stringify(n),s);return ge(o)}async function z(e,t,n,s){const i=await(await S(t,p.GENERATE_CONTENT,e,!1,JSON.stringify(n),s)).json();return{response:b(i)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Q(e){if(e!=null){if(typeof e=="string")return{role:"system",parts:[{text:e}]};if(e.text)return{role:"system",parts:[e]};if(e.parts)return e.role?e:{role:"system",parts:e.parts}}}function y(e){let t=[];if(typeof e=="string")t=[{text:e}];else for(const n of e)typeof n=="string"?t.push({text:n}):t.push(n);return pe(t)}function pe(e){const t={role:"user",parts:[]},n={role:"function",parts:[]};let s=!1,o=!1;for(const i of e)"functionResponse"in i?(n.parts.push(i),o=!0):(t.parts.push(i),s=!0);if(s&&o)throw new f("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!s&&!o)throw new f("No content is provided for sending chat message.");return s?t:n}function me(e,t){var n;let s={model:t==null?void 0:t.model,generationConfig:t==null?void 0:t.generationConfig,safetySettings:t==null?void 0:t.safetySettings,tools:t==null?void 0:t.tools,toolConfig:t==null?void 0:t.toolConfig,systemInstruction:t==null?void 0:t.systemInstruction,cachedContent:(n=t==null?void 0:t.cachedContent)===null||n===void 0?void 0:n.name,contents:[]};const o=e.generateContentRequest!=null;if(e.contents){if(o)throw new _("CountTokensRequest must have one of contents or generateContentRequest, not both.");s.contents=e.contents}else if(o)s=Object.assign(Object.assign({},s),e.generateContentRequest);else{const i=y(e);s.contents=[i]}return{generateContentRequest:s}}function K(e){let t;return e.contents?t=e:t={contents:[y(e)]},e.systemInstruction&&(t.systemInstruction=Q(e.systemInstruction)),t}function Oe(e){return typeof e=="string"||Array.isArray(e)?{content:y(e)}:e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],ve={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]};function Ae(e){let t=!1;for(const n of e){const{role:s,parts:o}=n;if(!t&&s!=="user")throw new f(`First content should be with role 'user', got ${s}`);if(!D.includes(s))throw new f(`Each item should include role field. Got ${s} but valid roles are: ${JSON.stringify(D)}`);if(!Array.isArray(o))throw new f("Content should have 'parts' property with an array of Parts");if(o.length===0)throw new f("Each Content should have at least one part");const i={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const a of o)for(const c of P)c in a&&(i[c]+=1);const r=ve[s];for(const a of P)if(!r.includes(a)&&i[a]>0)throw new f(`Content with role '${s}' can't contain '${a}' part`);t=!0}}function j(e){var t;if(e.candidates===void 0||e.candidates.length===0)return!1;const n=(t=e.candidates[0])===null||t===void 0?void 0:t.content;if(n===void 0||n.parts===void 0||n.parts.length===0)return!1;for(const s of n.parts)if(s===void 0||Object.keys(s).length===0||s.text!==void 0&&s.text==="")return!1;return!0}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V="SILENT_ERROR";class Re{constructor(t,n,s,o={}){this.model=n,this.params=s,this._requestOptions=o,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=t,s!=null&&s.history&&(Ae(s.history),this._history=s.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(t,n={}){var s,o,i,r,a,c;await this._sendPromise;const h=y(t),g={safetySettings:(s=this.params)===null||s===void 0?void 0:s.safetySettings,generationConfig:(o=this.params)===null||o===void 0?void 0:o.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(r=this.params)===null||r===void 0?void 0:r.toolConfig,systemInstruction:(a=this.params)===null||a===void 0?void 0:a.systemInstruction,cachedContent:(c=this.params)===null||c===void 0?void 0:c.cachedContent,contents:[...this._history,h]},E=Object.assign(Object.assign({},this._requestOptions),n);let l;return this._sendPromise=this._sendPromise.then(()=>z(this._apiKey,this.model,g,E)).then(d=>{var u;if(j(d.response)){this._history.push(h);const I=Object.assign({parts:[],role:"model"},(u=d.response.candidates)===null||u===void 0?void 0:u[0].content);this._history.push(I)}else{const I=C(d.response);I&&console.warn(`sendMessage() was unsuccessful. ${I}. Inspect response object for details.`)}l=d}).catch(d=>{throw this._sendPromise=Promise.resolve(),d}),await this._sendPromise,l}async sendMessageStream(t,n={}){var s,o,i,r,a,c;await this._sendPromise;const h=y(t),g={safetySettings:(s=this.params)===null||s===void 0?void 0:s.safetySettings,generationConfig:(o=this.params)===null||o===void 0?void 0:o.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(r=this.params)===null||r===void 0?void 0:r.toolConfig,systemInstruction:(a=this.params)===null||a===void 0?void 0:a.systemInstruction,cachedContent:(c=this.params)===null||c===void 0?void 0:c.cachedContent,contents:[...this._history,h]},E=Object.assign(Object.assign({},this._requestOptions),n),l=X(this._apiKey,this.model,g,E);return this._sendPromise=this._sendPromise.then(()=>l).catch(d=>{throw new Error(V)}).then(d=>d.response).then(d=>{if(j(d)){this._history.push(h);const u=Object.assign({},d.candidates[0].content);u.role||(u.role="model"),this._history.push(u)}else{const u=C(d);u&&console.warn(`sendMessageStream() was unsuccessful. ${u}. Inspect response object for details.`)}}).catch(d=>{d.message!==V&&console.error(d)}),l}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ye(e,t,n,s){return(await S(t,p.COUNT_TOKENS,e,!1,JSON.stringify(n),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Se(e,t,n,s){return(await S(t,p.EMBED_CONTENT,e,!1,JSON.stringify(n),s)).json()}async function Te(e,t,n,s){const o=n.requests.map(r=>Object.assign(Object.assign({},r),{model:t}));return(await S(t,p.BATCH_EMBED_CONTENTS,e,!1,JSON.stringify({requests:o}),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{constructor(t,n,s={}){this.apiKey=t,this._requestOptions=s,n.model.includes("/")?this.model=n.model:this.model=`models/${n.model}`,this.generationConfig=n.generationConfig||{},this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=Q(n.systemInstruction),this.cachedContent=n.cachedContent}async generateContent(t,n={}){var s;const o=K(t),i=Object.assign(Object.assign({},this._requestOptions),n);return z(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(s=this.cachedContent)===null||s===void 0?void 0:s.name},o),i)}async generateContentStream(t,n={}){var s;const o=K(t),i=Object.assign(Object.assign({},this._requestOptions),n);return X(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(s=this.cachedContent)===null||s===void 0?void 0:s.name},o),i)}startChat(t){var n;return new Re(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(n=this.cachedContent)===null||n===void 0?void 0:n.name},t),this._requestOptions)}async countTokens(t,n={}){const s=me(t,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent}),o=Object.assign(Object.assign({},this._requestOptions),n);return ye(this.apiKey,this.model,s,o)}async embedContent(t,n={}){const s=Oe(t),o=Object.assign(Object.assign({},this._requestOptions),n);return Se(this.apiKey,this.model,s,o)}async batchEmbedContents(t,n={}){const s=Object.assign(Object.assign({},this._requestOptions),n);return Te(this.apiKey,this.model,t,s)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(t){this.apiKey=t}getGenerativeModel(t,n){if(!t.model)throw new f("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new q(this.apiKey,t,n)}getGenerativeModelFromCachedContent(t,n,s){if(!t.name)throw new _("Cached content must contain a `name` field.");if(!t.model)throw new _("Cached content must contain a `model` field.");const o=["model","systemInstruction"];for(const r of o)if(n!=null&&n[r]&&t[r]&&(n==null?void 0:n[r])!==t[r]){if(r==="model"){const a=n.model.startsWith("models/")?n.model.replace("models/",""):n.model,c=t.model.startsWith("models/")?t.model.replace("models/",""):t.model;if(a===c)continue}throw new _(`Different value for "${r}" specified in modelParams (${n[r]}) and cachedContent (${t[r]})`)}const i=Object.assign(Object.assign({},n),{model:t.model,tools:t.tools,toolConfig:t.toolConfig,systemInstruction:t.systemInstruction,cachedContent:t});return new q(this.apiKey,i,s)}}chrome.runtime.onInstalled.addListener(async e=>{if(e.reason==="install")console.log("[LexiLens] Extension installed, setting defaults"),await N(M);else if(e.reason==="update"){console.log("[LexiLens] Extension updated to version",chrome.runtime.getManifest().version);const t=await w(),n={...M,...t};await N(n)}});const we=()=>{chrome.contextMenus.removeAll(()=>{chrome.contextMenus.create({id:"lexilens-read-selection",title:"🔊 Read with LexiLens",contexts:["selection"]}),chrome.contextMenus.create({id:"lexilens-summarize-selection",title:"📝 Summarize with LexiLens",contexts:["selection"]}),chrome.contextMenus.create({id:"lexilens-create-comic",title:"🍌 Create Nano Banana Comic",contexts:["selection"]})})};chrome.runtime.onInstalled.addListener(()=>{we()});const be=e=>{chrome.scripting.executeScript({target:{tabId:e},files:["webgazer.js"],world:"MAIN"},()=>{if(chrome.runtime.lastError){console.error("Failed to inject WebGazer:",JSON.stringify(chrome.runtime.lastError));return}chrome.scripting.executeScript({target:{tabId:e},files:["iris-driver.js"],world:"MAIN"})})};chrome.runtime.onMessage.addListener((e,t,n)=>{var s;e.type==="INJECT_IRIS"&&((s=t.tab)!=null&&s.id)&&be(t.tab.id)});chrome.contextMenus.onClicked.addListener(async(e,t)=>{e.selectionText&&(t!=null&&t.id)&&(e.menuItemId==="lexilens-read-selection"?chrome.tabs.sendMessage(t.id,{type:"READ_TEXT",payload:e.selectionText}):e.menuItemId==="lexilens-summarize-selection"?chrome.tabs.sendMessage(t.id,{type:"SUMMARIZE_TEXT",payload:e.selectionText}):e.menuItemId==="lexilens-create-comic"&&chrome.tabs.sendMessage(t.id,{type:"GENERATE_COMIC",payload:e.selectionText}))});chrome.runtime.onMessage.addListener((e,t,n)=>{if(e.type==="GET_SETTINGS")return w().then(s=>{n({success:!0,settings:s})}),!0;if(e.type==="SAVE_SETTINGS")return N(e.payload).then(()=>{n({success:!0})}),!0;if(e.type==="TOGGLE_EXTENSION")return w().then(async s=>{const o={...s,enabled:!s.enabled};await N(o),n({success:!0,enabled:o.enabled})}),!0;if(e.type==="FETCH_COMIC_FROM_BACKGROUND")return(async()=>{try{const s="AIzaSyCPurivlaBpWRQXEmSJES6H7EN0BuA2lTk";if(console.log("[LexiLens] API Key detected:",s?`${s.substring(0,4)}... analytics check`:"MISSING"),!s||s.trim()===""){console.error("Gemini API Key is missing or invalid."),n({success:!1,error:"MISSING_API_KEY: Please add VITE_GEMINI_API_KEY to your .env file and restart 'npm run dev'."});return}const o=new Ne(s),i=async g=>{const E=o.getGenerativeModel({model:g,safetySettings:[{category:O.HARM_CATEGORY_HARASSMENT,threshold:v.BLOCK_NONE},{category:O.HARM_CATEGORY_HATE_SPEECH,threshold:v.BLOCK_NONE},{category:O.HARM_CATEGORY_SEXUALLY_EXPLICIT,threshold:v.BLOCK_NONE},{category:O.HARM_CATEGORY_DANGEROUS_CONTENT,threshold:v.BLOCK_NONE}]}),l=["1930s Rubber Hose Animation (classic cartoon, bouncy, ink-blot)","Cyberpunk Neon-Vector (high contrast, glowing lines, vibrant purples/cyans)","Minimalist Zen-Brush (elegant ink strokes, lots of negative space, brush textures)","Retro-Futurism Collage (textured paper, geometric shapes, mid-century sci-fi vibe)"],d=l[Math.floor(Math.random()*l.length)],u=`
            ROLE: You are a Surrealist Graphic Novelist and a Neuro-Psychologist.
            TASK: Create an "Out-of-the-Box" Narrative Visualization (Nano Banana V4) for this text: "${e.payload}"
            
            CREATIVE PARADIGM:
            - ART STYLE: ${d}.
            - VISUAL LOGIC: Never use literal translations. Use 'Visual Pun' logic for abstract nouns. 
              (e.g., if the text is about 'Economic Inflation', show the mascot tethering a giant coin-shaped balloon).
            - COMPOSITION (Conceptual Art Storyboard):
              Panel 1: Extreme Close-up (Focus on intense emotion of the mascot).
              Panel 2: Wide Cinematic Shot (Show the surreal environment/metaphor).
              Panel 3: First-Person Perspective (Through the mascot's eyes, showing success/glow-up).
            - DYNAMIC LAYOUT: Abandon boring boxes. Use skewed angles, varying sizes, and overlapping elements. 
              The mascot's arm or effects like 'POW' bursts should 'break' the panel borders.
            
            TECHNICAL INNOVATION:
            - SHADOWS & DEPTH: Use <feGaussianBlur> and <feOffset> for floating 3D layer effects.
            - META-NARRATIVE: The mascot should interact with the UI or the text itself (e.g., sweeping away letters).
            - LIGHTING: Use <radialGradient> for God Rays or spotlights in Panel 3.
            
            DIRECTIVES:
            - Background: Must be #FDFCF2. Panels can have vibrant, textured accent colors based on the style.
            - Captions: Integrate text into the art (on signs, carved into scenery). Use <text> tags with 'font-family: sans-serif; font-weight: 800;'.
            - Formatting: Return ONLY the raw <svg> code. No markdown code blocks. The SVG must be responsive (viewBox="0 0 1200 400").
          `;return await(await E.generateContent(u)).response};let r;const a=["gemini-2.5-flash"];let c=null;for(const g of a)try{if(console.log(`[LexiLens] Trying model: ${g}`),r=await i(g),r)break}catch(E){console.warn(`[LexiLens] ${g} failed:`,E.message),c||(c=E)}if(!r)throw c||new Error("All models failed to generate content.");let h=r.text();h=h.replace(/```svg/g,"").replace(/```/g,"").trim(),n({success:!0,data:h})}catch(s){console.error("Background AI Gen Failed:",s);const o=s.message||String(s);n({success:!1,error:o})}})(),!0});console.log("[LexiLens] Background service worker started");
