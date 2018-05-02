function changeScreen(t,e){$lastScreen=$currentScreen,$currentScreen=t;var a=$(".screen:not(."+t+")"),n=a.length;a.fadeOut($globalFadeTime,function(){--n>0||(e&&e.before&&e.before(),$("."+t).fadeIn($globalFadeTime,function(){e&&e.after&&e.after()}))})}function populateCatalog(){$.get("template-catalog.html",function(t){var e=Mustache.render(t,$data);$(".catalog").empty().html(e),$.each($favorites,function(){$(".catalog-item[data-index="+this+"]").addClass("item-favorite")}),$.each($history,function(t){var e=$history.length-t;$(".catalog-item[data-index="+this+"]").attr("data-history",e)}),$(".catalog").isotope({getSortData:{history:function(t){if($(t).attr("data-history"))return parseInt($(t).attr("data-history"))}}})})}function populateCategoriesFilter(){var t=[];$.each($data.items,function(){t.indexOf(this.category)==-1&&(t.push(this.category),$(".filter-category").append($('<option value="'+this.category+'">'+this.category+"</option>")))})}function filterCatalog(){var t=!1;$(".catalog").isotope({filter:function(){return t=!($(".filter-search-box").val()&&!$(this).has(":containsIN("+$(".filter-search-box").val()+")").length)&&(!($("#catalog-set-favorites").is(":checked")&&!$(this).hasClass("item-favorite"))&&(!($("#catalog-set-history").is(":checked")&&!$(this).attr("data-history"))&&(!$(".filter-category").val()||$(this).find(".catalog-item-category").text()==$(".filter-category").val())))}}),$("#catalog-set-history").is(":checked")&&$(".catalog").isotope("updateSortData").isotope({sortBy:"history"})}function add3D(t,e){function a(){if(r=document.createElement("div"),$(".content-explore")[0].appendChild(r),d=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,.1,2e3),d.position.set(0,0,6),d.lookAt(new THREE.Vector3(0,0,0)),l=new THREE.OrbitControls(d),l.target.set(0,0,0),l.update(),u=new THREE.Scene,s=new THREE.Clock,"collada"==e){var a=new THREE.LoadingManager(function(){g.add(f)}),i=new THREE.ColladaLoader(a);i.load("models/"+t+"/model.dae",function(t){f=t.scene})}else if("obj"==e){THREE.Loader.Handlers.add(/\.dds$/i,new THREE.DDSLoader);var o=new THREE.MTLLoader;o.setPath("models/"+t+"/"),o.load("model.mtl",function(e){e.preload();var a=new THREE.OBJLoader;a.setMaterials(e),a.setPath("models/"+t+"/"),a.load("model.obj",function(t){t.position.y=-95,u.add(t)})})}var c=new THREE.AmbientLight(13421772,.4);u.add(c);var m=new THREE.DirectionalLight(16777215,.8);m.position.set(1,1,0).normalize(),u.add(m),u.add(g),h=new THREE.WebGLRenderer({alpha:!0}),h.setPixelRatio(window.devicePixelRatio),d.aspect=window.innerWidth/(window.innerHeight-114),d.updateProjectionMatrix(),h.setSize(window.innerWidth,window.innerHeight-114),r.appendChild(h.domElement),window.addEventListener("resize",n,!1)}function n(){d.aspect=window.innerWidth/(window.innerHeight-114),d.updateProjectionMatrix(),h.setSize(window.innerWidth,window.innerHeight-114)}function i(){requestAnimationFrame(i),o()}function o(){var t=s.getDelta();void 0!==f&&(g.rotation.y+=.5*t),h.render(u,d)}var r,c,s,l,d,u,h,f,g=new THREE.Group;e="collada",a(),i()}function quiz(t){$.get("template-quiz.html",function(e){var a=$currentItem.quiz[t];a.progress=$currentAnswers;var n=Mustache.render(e,a);$(".content-quiz").empty().html(n),$('.content-quiz a:containsIN("*")').addClass("correct"),$(".content-quiz a.correct").text($(".content-quiz a.correct").text().replace("*","")),$(".quiz-progress-dot").eq($currentQuiz).addClass("current"),$(".quiz-answers .row").randomize(".quiz-answer"),$(".content-quiz").fadeIn($globalFadeTime)})}function loadDetails(t){if($(".content-tabs").empty(),$(".content-explore").empty(),$currentItem=$data.items[t],$data.items[t].content.details&&($.get("template-details.html",function(e){var a=Mustache.render(e,$data.items[t]);$(".content-details").empty().html(a)}),$(".content-tabs").append($('<a href="#" data-to="content-details">Details</a>'))),$data.items[t].content.explore&&(add3D($data.items[t].slug),$(".content-tabs").append($('<a href="#" data-to="content-explore">Explore</a>'))),$data.items[t].quiz){for($currentAnswers=[],$currentQuiz=0,i=0;i<$currentItem.quiz.length;i++)$currentAnswers[i]="incorrect";quiz($currentQuiz),$(".content-tabs").append($('<a href="#" data-to="content-quiz">Quiz</a>'))}$(".content-tabs a:first").addClass("current"),changeScreen("screen-content",{before:function(){$(".content").hide(),$(".content:not(:empty)").first().show()}})}function onDeviceReady(){StatusBar.hide()}var $data,$currentScreen="screen-catalog",$lastScreen="screen-catalog",$globalFadeTime=400,$currentQuiz=0,$currentItem,$currentAnswers=[],$favorites=[],$history=[],$version="1.0",$namespace="netc-equipment-v"+$version;$.fn.randomize=function(t){return(t?this.find(t):this).parent().each(function(){$(this).children(t).sort(function(){return Math.random()-.5}).detach().appendTo(this)}),this},$(".nav-link").on("click",function(){return changeScreen($(this).attr("data-to")),!1});var camera;$("body").on("click",".quiz-answers a",function(){$(".quiz-answers").addClass("clicked"),$(this).addClass("clicked"),$(this).is(".correct")?$currentAnswers[$currentQuiz]="correct":$currentAnswers[$currentQuiz]="incorrect",setTimeout(function(){$(".content-quiz").fadeOut($globalFadeTime,function(){$currentQuiz+1===$currentItem.quiz.length?$currentQuiz=0:$currentQuiz++,quiz($currentQuiz)})},1e3)}),document.addEventListener("deviceready",onDeviceReady,!1),$(document).ready(function(){FastClick.attach(document.body),localStorage[$namespace+"-favorites"]&&($favorites=JSON.parse(localStorage[$namespace+"-favorites"])),localStorage[$namespace+"-history"]&&($history=JSON.parse(localStorage[$namespace+"-history"])),$.getJSON("items.json",function(t){$data=t,$.each($data.items,function(t){this.index=t,this.content.details.slug=this.slug}),populateCatalog(),populateCategoriesFilter()}),$(".catalog").on("click",".catalog-item",function(){$history.indexOf($(this).attr("data-index"))!=-1&&$history.splice($history.indexOf($(this).attr("data-index")),1),$history.push($(this).attr("data-index")),console.log($history),$(".catalog-item").removeAttr("data-history"),$.each($history,function(t){var e=$history.length-t;$(".catalog-item[data-index="+this+"]").attr("data-history",e)}),localStorage[$namespace+"-history"]=JSON.stringify($history),loadDetails($(this).attr("data-index"))}),$(".catalog").on("click",".catalog-item-info",function(t){return $(this).closest(".catalog-item").toggleClass("info-open"),t.stopPropagation(),!1}),$(".catalog").on("click",".catalog-item-info-close",function(t){return $(this).closest(".catalog-item").toggleClass("info-open"),t.stopPropagation(),!1}),$(".catalog").on("click",".catalog-item-favorite",function(t){return $(this).closest(".catalog-item").toggleClass("item-favorite"),$favorites=[],$(".catalog-item").each(function(){$(this).hasClass("item-favorite")&&$favorites.push(parseInt($(this).attr("data-index")))}),localStorage[$namespace+"-favorites"]=JSON.stringify($favorites),filterCatalog(),t.stopPropagation(),!1}),$(".filter-search-box").keyup(function(){filterCatalog()}),$("[name=catalog-set]").change(function(){filterCatalog()}),$(".filter-category").change(function(){filterCatalog()}),$(".content-tabs").on("click","a",function(){$(this).addClass("current").siblings().removeClass("current");var t=$(this);$.when($(".content").fadeOut($globalFadeTime)).done(function(){$(".content."+t.attr("data-to")).fadeIn($globalFadeTime)})})});