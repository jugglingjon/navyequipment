!function(){for(var e,n=function(){},o=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],r=o.length,t=window.console=window.console||{};r--;)e=o[r],t[e]||(t[e]=n)}(),$.extend($.expr[":"],{containsIN:function(e,n,o,r){return(e.textContent||e.innerText||"").toLowerCase().indexOf((o[3]||"").toLowerCase())>=0}});