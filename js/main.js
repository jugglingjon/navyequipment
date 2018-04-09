

// ====================================
// 				^GLOBALS
// ====================================

var $data,
	$currentScreen='screen-catalog',
	$lastScreen='screen-catalog',
	$globalFadeTime=400,
	$currentQuiz=0,
	$currentItem,
	$currentAnswers=[];


// ====================================
// 				^UTILITIES
// ====================================

//randomize jquery object children
$.fn.randomize = function(selector){
    (selector ? this.find(selector) : this).parent().each(function(){
        $(this).children(selector).sort(function(){
            return Math.random() - 0.5;
        }).detach().appendTo(this);
    });

    return this;
};


// ====================================
// 				^SCREEN CONTROL
// ====================================



//changes to targeted screen
//callback object: {before:<callback before fadein begins>, after: <callback after faded in>}
function changeScreen(screenClass, callbackObj){
	
	//manage current and last screen variables
	$lastScreen=$currentScreen;
	$currentScreen=screenClass;

	var elementsToFade=$('.screen:not(.'+screenClass+')');
	var fadeCount=elementsToFade.length;

	elementsToFade.fadeOut($globalFadeTime, function(){
		if(--fadeCount>0) return;

		if(callbackObj&&callbackObj.before){
			callbackObj.before();
		}
		
		$('.'+screenClass).fadeIn($globalFadeTime,function(){
			if(callbackObj&&callbackObj.after){
				callbackObj.after();
			}
		});
	});
}


//generic link type to change between screens
$('.nav-link').on('click',function(){
	changeScreen($(this).attr('data-to'));
	return false;
});


// ====================================
// 				^CATALOG
// ====================================



function populateCatalog(){
	$.get('template-catalog.html',function(template){
		var rendered=Mustache.render(template,$data);
		$('.catalog').empty().html(rendered);
		//$('.found-options').randomize('.found-option');

		$('.catalog').isotope();
	});
}

function populateCategoriesFilter(){
	var categories=[];
	$.each($data.items,function(){
		if(categories.indexOf(this.category)==-1){
			categories.push(this.category);

			$('.filter-category').append($('<option value="'+this.category+'">'+this.category+'</option>'));
		}
	});
}

function filterCatalog(){
	var alltrue=false;
	$('.catalog').isotope({
		filter: function(){
			console.log($('.filter-category').val(),$(this).find('.catalog-item-category').text()===$('.filter-category').val());
			if($('.filter-search-box').val() && !$(this).has(':containsIN('+$('.filter-search-box').val()+')').length){
				alltrue = false;
			}
			else if($('#catalog-set-favorites').is(':checked') && !$(this).hasClass('item-favorite')){
				alltrue = false;
				console.log(alltrue);
			}
			else if($('.filter-category').val() && $(this).find('.catalog-item-category').text()!=$('.filter-category').val()){
				alltrue = false;
			}
			else{
				alltrue = true;
			}
			return alltrue;
		}
	});
}


// ====================================
// 				^3D
// ====================================

var camera;
function add3D(slug,format){


	var container, stats, clock, controls;
	var camera, scene, renderer, model;
	var group = new THREE.Group();

	format='collada';
	init();
	animate();

	

	function init()
	{
	    container = document.createElement('div');
	    $('.content-explore')[0].appendChild(container);
		
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
		camera.position.set( 0, 0, 6 );
		camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

		controls = new THREE.OrbitControls( camera );
		controls.target.set( 0, 0, 0 );
		controls.update();

		scene = new THREE.Scene();

		clock = new THREE.Clock();


		if(format=='collada'){
			// if collada
			var loadingManager = new THREE.LoadingManager( function() {

				group.add( model );

			} );

			var loader = new THREE.ColladaLoader( loadingManager );
			loader.load( 'models/'+slug+'/model.dae', function ( collada ) {

				model = collada.scene;

			} );

		}
		else if(format=='obj'){
			//if obj
			THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

			var mtlLoader = new THREE.MTLLoader();
			mtlLoader.setPath( 'models/'+slug+'/' );
			mtlLoader.load( 'model.mtl', function( materials ) {

				materials.preload();

				var objLoader = new THREE.OBJLoader();
				objLoader.setMaterials( materials );
				objLoader.setPath( 'models/'+slug+'/' );
				objLoader.load( 'model.obj', function ( object ) {

					object.position.y = - 95;
					scene.add( object );

				});

			});
		}


		var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
		scene.add( ambientLight );

		var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
		directionalLight.position.set( 1, 1, 0 ).normalize();
		scene.add( directionalLight );

		//sprites
		// var spriteMap = new THREE.TextureLoader().load( "img/sprite.png" );
		// var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
		// var sprite = new THREE.Sprite( spriteMaterial );
		// sprite.position.set( 0, 2, .9 );
		// sprite.scale.set( .3, .3, 1 ); // imageWidth, imageHeight
		// group.add( sprite );

		// var spriteMap = new THREE.TextureLoader().load( "img/sprite.png" );
		// var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
		// var sprite = new THREE.Sprite( spriteMaterial );
		// sprite.position.set( 0, -1.6, -1.2 );
		// sprite.scale.set( .3, .3, 1 ); // imageWidth, imageHeight
		// group.add( sprite );




		scene.add(group);

		renderer = new THREE.WebGLRenderer( { alpha: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		camera.aspect = window.innerWidth / (window.innerHeight-114);
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, (window.innerHeight-114) );
		container.appendChild( renderer.domElement );

		//



		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / (window.innerHeight-114);
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, (window.innerHeight-114) );

	}

	function animate() {

		requestAnimationFrame( animate );

		render();

	}

	function render() {

		var delta = clock.getDelta();

		if ( model !== undefined ) {

			group.rotation.y += delta * 0.5;

		}

		renderer.render( scene, camera );

	}


}

// ====================================
// 				^QUIZ
// ====================================


function quiz(qindex){
	$.get('template-quiz.html',function(template){
		var model=$currentItem.quiz[qindex];
		model.progress=$currentAnswers;

		var rendered=Mustache.render(template,model);
		$('.content-quiz').empty().html(rendered)
		$('.content-quiz a:containsIN("*")').addClass('correct');
		$('.content-quiz a.correct').text($('.content-quiz a.correct').text().replace('*',''));
		$('.quiz-progress-dot').eq($currentQuiz).addClass('current');
		$('.quiz-answers .row').randomize('.quiz-answer');
		$('.content-quiz').fadeIn($globalFadeTime);
	});
}

$('body').on('click','.quiz-answers a',function(){

	$('.quiz-answers').addClass('clicked');
	$(this).addClass('clicked');

	if($(this).is('.correct')){
		$currentAnswers[$currentQuiz]='correct';
	}
	else{
		$currentAnswers[$currentQuiz]='incorrect';
	}

	setTimeout(function(){
		$('.content-quiz').fadeOut($globalFadeTime,function(){
			if($currentQuiz+1===$currentItem.quiz.length){
				$currentQuiz=0;
			}
			else{
				$currentQuiz++;
			}	
			quiz($currentQuiz);
		});
	},1000);
	

	
});


// ====================================
// 				^DETAILS
// ====================================

function loadDetails(id){

	$('.content-tabs').empty();
	$('.content-explore').empty();
	$currentItem=$data.items[id];
	
	if($data.items[id].content.details){
		$.get('template-details.html',function(template){
			var rendered=Mustache.render(template,$data.items[id]);
			$('.content-details').empty().html(rendered);
		});

		$('.content-tabs').append($('<a href="#" data-to="content-details">Details</a>'))
	}

	if($data.items[id].content.explore){

		add3D($data.items[id].slug);

		$('.content-tabs').append($('<a href="#" data-to="content-explore">Explore</a>'));
		

	}


	if($data.items[id].quiz){
		$currentAnswers=[];
		$currentQuiz=0;

		for(i=0;i<$currentItem.quiz.length;i++){
			$currentAnswers[i]='incorrect';
		}

		quiz($currentQuiz);
	
		$('.content-tabs').append($('<a href="#" data-to="content-quiz">Quiz</a>'))
	}

	$('.content-tabs a:first').addClass('current');

	changeScreen('screen-content',{before:function(){
		$('.content').hide();
		$('.content:not(:empty)').first().show();
	}});
	
}



// ====================================
// 				^EVENTS
// ====================================

$(document).ready(function(){

	//load items json, initialize catalog
	$.getJSON('items.json',function(data){
		$data=data;

		$.each($data.items,function(index){
			this.index=index;
			this.content.details.slug=this.slug;
		});

		populateCatalog();
		populateCategoriesFilter();
	});
	
	//when catalog item clicked
	$('.catalog').on('click','.catalog-item',function(){
		loadDetails($(this).attr('data-index'));
	});

	//catalog item info button
	$('.catalog').on('click','.catalog-item-info',function(event){
		$(this).closest('.catalog-item').toggleClass('info-open');

		event.stopPropagation();
		return false;
	});

	//catalog item info close
	$('.catalog').on('click','.catalog-item-info-close',function(event){
		$(this).closest('.catalog-item').toggleClass('info-open');
		event.stopPropagation();
		return false;
	});

	//catalog item favorite
	$('.catalog').on('click','.catalog-item-favorite',function(event){
		$(this).closest('.catalog-item').toggleClass('item-favorite');
		filterCatalog();
		event.stopPropagation();
		return false;
	});

	//filter search
	$('.filter-search-box').keyup(function(){

		filterCatalog();
	});

	//filter pills
	$('[name=catalog-set]').change(function(){
		filterCatalog();
	});

	//filter category dropdown
	$('.filter-category').change(function(){
		filterCatalog();
	});

	//content tab navigation
	$('.content-tabs').on('click','a',function(){

		$(this).addClass('current').siblings().removeClass('current');
		var el=$(this);
		$.when($('.content').fadeOut($globalFadeTime)).done(function(){
			$('.content.'+el.attr('data-to')).fadeIn($globalFadeTime);
		});
		
	});

	//back button

});