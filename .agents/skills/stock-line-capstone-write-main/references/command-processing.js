function parseCommand(text){
 if(typeof text!=='string')return {kind:'invalid'};
 const t=text.trim(); if(t==='查詢門檻')return {kind:'query'};
 const m=/^門檻(?:改成\s*|\s+)(\d{1,2}(?:\.\d{1,2})?)\s*%?$/.exec(t);
 if(!m)return {kind:'invalid'};
 const value=Number(m[1]);return value>0&&value<100?{kind:'update',value}:{kind:'invalid'};
}
function planEvents(row,events,now,commit){
 if(!row||row.setting_key!=='stock_drop_threshold'||typeof row.threshold_pct!=='number'||!Number.isFinite(row.threshold_pct)||row.threshold_pct<=0||row.threshold_pct>=100||!Number.isInteger(row.state_version))throw new Error('共用門檻缺失或無效，停止處理。');
 const state=JSON.parse(row.event_state); if(!state||typeof state.events!=='object'||!Number.isFinite(state.lastTimestamp))throw new Error('事件狀態損壞');
 const cutoff=now-86400000;const seen={};
 for(const [id,rec] of Object.entries(state.events))if(rec.timestamp>=cutoff)seen[id]=rec;
 let threshold=row.threshold_pct,last=state.lastTimestamp,changed=false;const replies=[];
 const ordered=[...events].sort((a,b)=>a.timestamp-b.timestamp||a.webhookEventId.localeCompare(b.webhookEventId));
 for(const e of ordered){
  const id=e.webhookEventId;if(seen[id])continue;
  if(!Number.isFinite(e.timestamp)||e.timestamp<cutoff||e.timestamp>now+60000)continue;
  const cmd=parseCommand(e.message.text);const before=threshold;let action=cmd.kind,text;
  if(cmd.kind==='update'&&e.timestamp<=last){action='stale';text='這則修改指令比目前設定舊，未變更門檻。請重新傳送新的指令。';}
  else if(cmd.kind==='update'){threshold=cmd.value;last=e.timestamp;changed=true;text='已將跌幅門檻從 '+before+'% 改為 '+threshold+'%，下次股價檢查起生效。';}
  else if(cmd.kind==='query')text='目前跌幅門檻為 '+threshold+'%。';
  else text='請輸入「門檻改成 3%」或「查詢門檻」。門檻須大於0、小於100，最多兩位小數。';
  seen[id]={timestamp:e.timestamp,action,before,after:threshold,commit,status:'reply_reserved'};
  replies.push({eventId:id,timestamp:e.timestamp,action,before,after:threshold,text,replyToken:e.replyToken});
 }
 if(Object.keys(seen).length>5000)throw new Error('當日事件量超出此個人通知方案上限，停止寫入。');
 return {rowId:row.id,oldVersion:row.state_version,newVersion:row.state_version+1,thresholdPct:threshold,updatedAt:changed?new Date(now).toISOString():row.updated_at,eventState:JSON.stringify({events:seen,lastTimestamp:last,lastCommit:commit}),commit,replies};
}
function eligibleEvents(body,owner){
 if(!body||!Array.isArray(body.events))throw new Error('Webhook events格式錯誤');
 return body.events.filter(e=>e?.type==='message'&&e.source?.type==='user'&&e.source.userId===owner&&e.message?.type==='text'&&typeof e.message.text==='string'&&typeof e.webhookEventId==='string'&&/^[A-Za-z0-9_-]{1,100}$/.test(e.webhookEventId)&&typeof e.replyToken==='string'&&e.replyToken.length>0);
}
function signatureEqual(a,b){
 if(typeof a!=='string'||typeof b!=='string'||a.length!==44||b.length!==44)return false;
 let mismatch=0;for(let i=0;i<44;i++)mismatch|=a.charCodeAt(i)^b.charCodeAt(i);
 return mismatch===0;
}
